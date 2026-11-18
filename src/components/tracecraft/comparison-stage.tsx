"use client";

import * as React from "react";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LOUPE_MIN_ZOOM_PERCENT,
  MAX_ZOOM_SCALE,
  useVectorStudio,
} from "./trace-studio-context";
import { PathEditorOverlay } from "./path-editor-overlay";
import { VectorSvgLayer } from "./trace-svg-layer";
import { WireframeLoupe } from "./wireframe-loupe";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function ComparisonStage() {
  const {
    originalUrl,
    preview,
    camera,
    minScale,
    sliderValue,
    viewMode,
    loupeEnabled,
    fullWireframe,
    editMode,
    selectedPathId,
    setSelectedPathId,
    pathOverrides,
    fillOverrides,
    deletedPathIds,
    getPathD,
    setPathD,
    beginPathEdit,
    setCamera: onCameraChange,
    setStageSize: onStageResize,
  } = useVectorStudio();
  const effectiveViewMode = editMode ? "single" : viewMode;
  const selectedPath =
    editMode && selectedPathId && preview
      ? preview.paths.find((item) => item.id === selectedPathId)
      : undefined;
  const selectedPathD = selectedPathId ? getPathD(selectedPathId) : "";
  const maxScale = MAX_ZOOM_SCALE;
  const previewWidth = preview?.width ?? 1;
  const previewHeight = preview?.height ?? 1;
  const stageRef = React.useRef<HTMLDivElement>(null);
  const rasterCanvasRef = React.useRef<HTMLCanvasElement>(null);
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
  const fittedPreviewRef = React.useRef<unknown>(null);
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

      // The stage only mounts after a job exists, so fit the camera here with
      // the real pane dimensions instead of the pre-mount placeholder sizes.
      if (preview && fittedPreviewRef.current !== preview) {
        fittedPreviewRef.current = preview;
        const pad = 32;
        const fitScale = clamp(
          Math.min(
            Math.max(1, next.width - pad) / preview.width,
            Math.max(1, next.height - pad) / preview.height,
          ),
          0.1,
          MAX_ZOOM_SCALE,
        );
        onCameraChange({
          scale: fitScale,
          dx: (next.width - preview.width * fitScale) / 2,
          dy: (next.height - preview.height * fitScale) / 2,
        });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [onCameraChange, onStageResize, preview]);

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
      const cursorX = event.clientX - rect.left;
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
  }, [maxScale, minScale, onCameraChange]);

  // Draw the original raster beneath the vector layer in curtain mode only.
  React.useEffect(() => {
    const canvas = rasterCanvasRef.current;
    const img = loadedImageRef.current;
    if (
      !canvas ||
      effectiveViewMode !== "curtain" ||
      stageSize.width <= 0 ||
      stageSize.height <= 0
    ) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const paneWidth = Math.floor(stageSize.width);
    const paneHeight = stageSize.height;

    canvas.width = Math.max(1, Math.floor(paneWidth * dpr));
    canvas.height = Math.max(1, Math.floor(paneHeight * dpr));

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, paneWidth, paneHeight);

    if (img) {
      ctx.imageSmoothingEnabled = camera.scale < 1;
      ctx.drawImage(
        img,
        camera.dx,
        camera.dy,
        previewWidth * camera.scale,
        previewHeight * camera.scale,
      );
    }
  }, [
    camera,
    effectiveViewMode,
    imageReadyTick,
    previewHeight,
    previewWidth,
    stageSize.height,
    stageSize.width,
  ]);

  const updatePointerCoords = (clientX: number, clientY: number) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setPointer({ x, y, paneX: x, paneY: y });
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
      width: `${previewWidth}px`,
      height: `${previewHeight}px`,
      transform: `translate(${camera.dx}px, ${camera.dy}px) scale(${camera.scale})`,
      transformOrigin: "0 0",
    }),
    [camera.dx, camera.dy, camera.scale, previewHeight, previewWidth],
  );

  if (!preview) return null;

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
        "vk-checkerboard relative size-full overflow-hidden select-none touch-none",
        isGrabbing ? "cursor-grabbing" : "cursor-grab",
      )}
    >
      {effectiveViewMode === "curtain" ? (
        <div className="relative size-full overflow-hidden">
          <canvas
            ref={rasterCanvasRef}
            className="block size-full"
            aria-label="Original raster image canvas"
          />

          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{ clipPath: "inset(0 0 0 var(--split-pos))" }}
          >
            <div className="absolute top-0 left-0" style={vectorTransformStyle}>
              <VectorSvgLayer
                preview={preview}
                wireframe={fullWireframe}
                pathOverrides={pathOverrides}
                fillOverrides={fillOverrides}
                deletedPathIds={deletedPathIds}
              />
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

          <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2">
            <span className="rounded-md border border-studio-border bg-studio-panel/90 px-2.5 py-1 text-xs font-medium text-studio-foreground">
              Pixels
            </span>
            <span className="rounded-md border border-studio-border bg-studio-panel/90 px-2.5 py-1 text-xs font-medium text-studio-foreground">
              Vectors
            </span>
          </div>
        </div>
      ) : (
        <div className="relative size-full overflow-hidden">
          <div className="absolute top-0 left-0" style={vectorTransformStyle}>
            <VectorSvgLayer
              preview={preview}
              wireframe={fullWireframe}
              pathOverrides={pathOverrides}
              fillOverrides={fillOverrides}
              deletedPathIds={deletedPathIds}
              editMode={editMode}
              selectedPathId={selectedPathId}
              onSelectPath={setSelectedPathId}
            />
            {editMode && selectedPath && selectedPathD && (
              <PathEditorOverlay
                preview={preview}
                pathId={selectedPath.id}
                pathD={selectedPathD}
                pathTransform={selectedPath.transform}
                cameraScale={camera.scale}
                onBeginEdit={beginPathEdit}
                onPathDChange={setPathD}
              />
            )}
          </div>
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-studio-border bg-studio-panel/90 px-2.5 py-1 text-xs font-medium text-studio-foreground">
            {editMode
              ? selectedPath
                ? "Editing path · drag the dots to fix lines · Del to remove"
                : "Edit mode · click a path to adjust it"
              : fullWireframe
                ? "Wireframe Outlines"
                : "Vectorized SVG"}
          </span>
        </div>
      )}

      {imageLoadError && effectiveViewMode === "curtain" && (
        <div
          role="status"
          className="pointer-events-none absolute top-20 left-3 rounded-md border border-studio-border bg-studio-panel/95 px-3 py-1.5 text-xs text-studio-muted"
        >
          Original raster preview could not be loaded.
        </div>
      )}

      {loupeEnabled &&
        !editMode &&
        pointer &&
        !imageLoadError &&
        sliderValue >= LOUPE_MIN_ZOOM_PERCENT && (
          <WireframeLoupe pointer={pointer} />
        )}
    </div>
  );
}
