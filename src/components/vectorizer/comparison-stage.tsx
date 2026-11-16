"use client";

import * as React from "react";
import { MoveHorizontal } from "lucide-react";
import type { VectorPreviewData } from "@/lib/vectorizer-api";
import { cn } from "@/lib/utils";
import type { CameraState, ViewMode } from "./types";
import { VectorSvgLayer } from "./vector-svg-layer";
import { WireframeLoupe } from "./wireframe-loupe";

interface ComparisonStageProps {
  originalUrl: string;
  preview: VectorPreviewData;
  camera: CameraState;
  minScale: number;
  maxScale: number;
  viewMode: ViewMode;
  loupeEnabled: boolean;
  fullWireframe: boolean;
  onCameraChange: React.Dispatch<React.SetStateAction<CameraState>>;
  onStageResize: (size: { width: number; height: number }) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function drawCrosshair(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  fgColor: string,
  bgColor: string,
) {
  const radius = 14;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = bgColor;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.lineWidth = 1.25;
  ctx.strokeStyle = fgColor;
  ctx.stroke();
  ctx.restore();
}

export function ComparisonStage({
  originalUrl,
  preview,
  camera,
  minScale,
  maxScale,
  viewMode,
  loupeEnabled,
  fullWireframe,
  onCameraChange,
  onStageResize,
}: ComparisonStageProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const leftCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const leftCrosshairRef = React.useRef<HTMLCanvasElement>(null);
  const rightCrosshairRef = React.useRef<HTMLCanvasElement>(null);
  const loadedImageRef = React.useRef<HTMLImageElement | null>(null);
  const dragRef = React.useRef<{
    pointerId: number;
    x: number;
    y: number;
  } | null>(null);
  const curtainDragRef = React.useRef<boolean>(false);

  const [stageSize, setStageSize] = React.useState({ width: 0, height: 0 });
  const [splitPercent, setSplitPercent] = React.useState(50);
  const [pointer, setPointer] = React.useState<{
    x: number;
    y: number;
    paneX: number;
    paneY: number;
  } | null>(null);
  const [isGrabbing, setIsGrabbing] = React.useState(false);
  const [imageReadyTick, setImageReadyTick] = React.useState(0);
  const [failedOriginalUrl, setFailedOriginalUrl] = React.useState<string | null>(
    null,
  );
  const imageLoadError = failedOriginalUrl === originalUrl;

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      const next = {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
      setStageSize(next);
      onStageResize(next);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [onStageResize]);

  React.useEffect(() => {
    let active = true;
    const img = new Image();
    img.crossOrigin = "use-credentials";
    img.onload = () => {
      if (!active) return;
      loadedImageRef.current = img;
      setFailedOriginalUrl((prev) => (prev === originalUrl ? null : prev));
      setImageReadyTick((n) => n + 1);
    };
    img.onerror = () => {
      if (!active) return;
      loadedImageRef.current = null;
      setFailedOriginalUrl(originalUrl);
    };
    img.src = originalUrl;

    return () => {
      active = false;
    };
  }, [originalUrl]);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = el.getBoundingClientRect();
      const paneWidth = viewMode === "split" ? rect.width / 2 : rect.width;
      const rawX = event.clientX - rect.left;
      const cursorX =
        viewMode === "split" && rawX > paneWidth ? rawX - paneWidth : rawX;
      const cursorY = event.clientY - rect.top;

      const factor = event.deltaY < 0 ? 1.15 : 1 / 1.15;

      onCameraChange((prev) => {
        const nextScale = clamp(prev.scale * factor, minScale, maxScale);
        const ratio = nextScale / prev.scale;
        return {
          scale: nextScale,
          dx: cursorX - (cursorX - prev.dx) * ratio,
          dy: cursorY - (cursorY - prev.dy) * ratio,
        };
      });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [maxScale, minScale, onCameraChange, viewMode]);

  // Draw base original raster canvas only when camera/stage/image changes (never on hover pointer moves)
  React.useEffect(() => {
    const leftCanvas = leftCanvasRef.current;
    const img = loadedImageRef.current;
    if (
      !leftCanvas ||
      viewMode === "single" ||
      stageSize.width <= 0 ||
      stageSize.height <= 0
    ) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const paneWidth =
      viewMode === "split" ? Math.floor(stageSize.width / 2) : stageSize.width;
    const paneHeight = stageSize.height;

    leftCanvas.width = Math.max(1, Math.floor(paneWidth * dpr));
    leftCanvas.height = Math.max(1, Math.floor(paneHeight * dpr));

    const ctx = leftCanvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, paneWidth, paneHeight);

    if (img) {
      ctx.imageSmoothingEnabled = camera.scale < 1;
      ctx.drawImage(
        img,
        camera.dx,
        camera.dy,
        preview.width * camera.scale,
        preview.height * camera.scale,
      );
    }
  }, [
    camera,
    imageReadyTick,
    preview.height,
    preview.width,
    stageSize.height,
    stageSize.width,
    viewMode,
  ]);

  // Lightweight crosshair overlay canvas updated on pointer moves in split view
  React.useEffect(() => {
    const leftOverlay = leftCrosshairRef.current;
    const rightOverlay = rightCrosshairRef.current;
    if (
      viewMode !== "split" ||
      !leftOverlay ||
      !rightOverlay ||
      stageSize.width <= 0 ||
      stageSize.height <= 0
    ) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const paneWidth = Math.floor(stageSize.width / 2);
    const paneHeight = stageSize.height;

    const styles = getComputedStyle(leftOverlay);
    const traceColor = styles.getPropertyValue("--trace").trim() || "cyan";
    const bgColor =
      styles.getPropertyValue("--studio-surface").trim() || "black";
    const fgColor =
      styles.getPropertyValue("--studio-foreground").trim() || "white";

    for (const [canvas, strokeColor] of [
      [leftOverlay, fgColor],
      [rightOverlay, traceColor],
    ] as const) {
      canvas.width = Math.max(1, Math.floor(paneWidth * dpr));
      canvas.height = Math.max(1, Math.floor(paneHeight * dpr));
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, paneWidth, paneHeight);
      if (pointer) {
        drawCrosshair(ctx, pointer.paneX, pointer.paneY, strokeColor, bgColor);
      }
    }
  }, [pointer, stageSize.height, stageSize.width, viewMode]);

  const updatePointerCoords = (clientX: number, clientY: number) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const paneWidth = viewMode === "split" ? rect.width / 2 : rect.width;
    const paneX = viewMode === "split" && x > paneWidth ? x - paneWidth : x;
    setPointer({ x, y, paneX, paneY: y });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || curtainDragRef.current) return;
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsGrabbing(true);
    updatePointerCoords(event.clientX, event.clientY);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (curtainDragRef.current && stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      const pct = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 100;
      setSplitPercent(clamp(pct, 0, 100));
      updatePointerCoords(event.clientX, event.clientY);
      return;
    }

    updatePointerCoords(event.clientX, event.clientY);

    if (dragRef.current && dragRef.current.pointerId === event.pointerId) {
      const dxDelta = event.clientX - dragRef.current.x;
      const dyDelta = event.clientY - dragRef.current.y;
      dragRef.current.x = event.clientX;
      dragRef.current.y = event.clientY;

      onCameraChange((prev) => ({
        ...prev,
        dx: prev.dx + dxDelta,
        dy: prev.dy + dyDelta,
      }));
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    curtainDragRef.current = false;
    if (dragRef.current && dragRef.current.pointerId === event.pointerId) {
      dragRef.current = null;
      setIsGrabbing(false);
    }
  };

  const vectorTransformStyle = React.useMemo<React.CSSProperties>(
    () => ({
      width: `${preview.width}px`,
      height: `${preview.height}px`,
      transform: `translate(${camera.dx}px, ${camera.dy}px) scale(${camera.scale})`,
      transformOrigin: "0 0",
    }),
    [camera.dx, camera.dy, camera.scale, preview.height, preview.width],
  );

  return (
    <div
      ref={stageRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={() => {
        if (!dragRef.current) setPointer(null);
      }}
      style={{ "--split-pos": `${splitPercent}%` } as React.CSSProperties}
      className={cn(
        "vk-checkerboard relative h-128 w-full overflow-hidden rounded-2xl border border-studio-border select-none touch-none lg:h-152",
        isGrabbing ? "cursor-grabbing" : "cursor-grab",
      )}
    >
      {viewMode === "split" ? (
        <div className="grid size-full grid-cols-2 divide-x divide-studio-border">
          <div className="relative size-full overflow-hidden">
            <canvas
              ref={leftCanvasRef}
              className="block size-full"
              aria-label="Original raster image canvas"
            />
            <canvas
              ref={leftCrosshairRef}
              className="pointer-events-none absolute inset-0 block size-full"
              aria-hidden="true"
            />
            <span className="pointer-events-none absolute top-3 left-3 rounded-md border border-studio-border bg-studio-panel/90 px-2.5 py-1 text-xs font-medium text-studio-foreground">
              Original Pixels
            </span>
          </div>

          <div className="relative size-full overflow-hidden">
            <div className="absolute top-0 left-0" style={vectorTransformStyle}>
              <VectorSvgLayer preview={preview} wireframe={fullWireframe} />
            </div>
            <canvas
              ref={rightCrosshairRef}
              className="pointer-events-none absolute inset-0 block size-full"
              aria-hidden="true"
            />
            <span className="pointer-events-none absolute top-3 left-3 rounded-md border border-studio-border bg-studio-panel/90 px-2.5 py-1 text-xs font-medium text-studio-foreground">
              {fullWireframe ? "Wireframe Outlines" : "Vectorized SVG"}
            </span>
          </div>
        </div>
      ) : viewMode === "curtain" ? (
        <div className="relative size-full overflow-hidden">
          <canvas
            ref={leftCanvasRef}
            className="block size-full"
            aria-label="Original raster image canvas"
          />

          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{ clipPath: "inset(0 0 0 var(--split-pos))" }}
          >
            <div className="absolute top-0 left-0" style={vectorTransformStyle}>
              <VectorSvgLayer preview={preview} wireframe={fullWireframe} />
            </div>
          </div>

          <div
            role="slider"
            tabIndex={0}
            aria-label="Pixels and vectors comparison divider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(splitPercent)}
            onPointerDown={(event) => {
              event.stopPropagation();
              curtainDragRef.current = true;
              stageRef.current?.setPointerCapture(event.pointerId);
            }}
            onKeyDown={(event) => {
              const step = event.shiftKey ? 10 : 2;
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                setSplitPercent((p) => clamp(p - step, 0, 100));
              } else if (event.key === "ArrowRight") {
                event.preventDefault();
                setSplitPercent((p) => clamp(p + step, 0, 100));
              }
            }}
            style={{ left: "var(--split-pos)" }}
            className="absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 cursor-ew-resize bg-trace focus-visible:outline-2 focus-visible:outline-trace"
          >
            <div className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-trace bg-studio-panel text-trace shadow-md">
              <MoveHorizontal className="size-4" />
            </div>
          </div>

          <span className="pointer-events-none absolute top-3 left-3 rounded-md border border-studio-border bg-studio-panel/90 px-2.5 py-1 text-xs font-medium text-studio-foreground">
            Pixels
          </span>
          <span className="pointer-events-none absolute top-3 right-3 rounded-md border border-studio-border bg-studio-panel/90 px-2.5 py-1 text-xs font-medium text-studio-foreground">
            Vectors
          </span>
        </div>
      ) : (
        <div className="relative size-full overflow-hidden">
          <div className="absolute top-0 left-0" style={vectorTransformStyle}>
            <VectorSvgLayer preview={preview} wireframe={fullWireframe} />
          </div>
          <span className="pointer-events-none absolute top-3 left-3 rounded-md border border-studio-border bg-studio-panel/90 px-2.5 py-1 text-xs font-medium text-studio-foreground">
            {fullWireframe ? "Wireframe Outlines" : "Vectorized SVG"}
          </span>
        </div>
      )}

      {imageLoadError && viewMode !== "single" && (
        <div
          role="status"
          className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-studio-border bg-studio-panel/95 px-3 py-1.5 text-xs text-studio-muted"
        >
          Original raster preview could not be loaded.
        </div>
      )}

      {loupeEnabled && pointer && !imageLoadError && (
        <WireframeLoupe
          originalUrl={originalUrl}
          preview={preview}
          camera={camera}
          pointer={pointer}
        />
      )}
    </div>
  );
}
