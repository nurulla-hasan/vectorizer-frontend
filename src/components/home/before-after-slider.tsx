"use client";

import * as React from "react";
import { GripVertical, MoveHorizontal } from "lucide-react";
import { RasterGem, VectorGem } from "./gem-art";

const MIN = 0;
const MAX = 100;

function clamp(value: number): number {
  return Math.min(MAX, Math.max(MIN, value));
}

export function BeforeAfterSlider() {
  const [position, setPosition] = React.useState(58);
  const frameRef = React.useRef<HTMLDivElement>(null);
  const draggingRef = React.useRef(false);

  const updateFromClientX = React.useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    if (rect.width === 0) return;
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(event.clientX);
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 4;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setPosition((prev) => clamp(prev - step));
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setPosition((prev) => clamp(prev + step));
    } else if (event.key === "Home") {
      event.preventDefault();
      setPosition(MIN);
    } else if (event.key === "End") {
      event.preventDefault();
      setPosition(MAX);
    }
  };

  const percent = Math.round(position);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-5 -z-10 rounded-[2rem] bg-trace/10 blur-3xl"
      />

      <div className="overflow-hidden rounded-2xl border border-studio-border bg-studio-surface shadow-[0_40px_120px_-40px_rgba(2,6,23,0.8)]">
        <div className="flex items-center gap-2 border-b border-studio-border/70 px-3 py-2.5">
          <span className="size-2 rounded-full bg-[#ff5f57]/80" />
          <span className="size-2 rounded-full bg-[#febc2e]/80" />
          <span className="size-2 rounded-full bg-[#28c840]/80" />
          <span className="mx-2 h-4 w-px bg-studio-border/70" />
          <span className="truncate font-mono text-[11px] text-studio-muted">
            raster → vector
          </span>
          <span className="ml-auto rounded-full border border-trace/30 bg-trace/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-trace">
            LIVE WIPE
          </span>
        </div>

        <div
          ref={frameRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          className="relative aspect-[4/3] cursor-ew-resize touch-none select-none"
        >
          <div className="vk-checkerboard absolute inset-0">
            <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.2em] text-studio-muted uppercase">
              Raster
            </span>
            <div className="flex size-full items-center justify-center p-10">
              <RasterGem className="w-1/2 max-w-64" />
            </div>
          </div>

          <div
            className="vk-blueprint-grid absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${position}%)` }}
          >
            <span className="absolute top-4 right-4 z-10 font-mono text-[10px] tracking-[0.2em] text-trace/80 uppercase">
              Vector · SVG
            </span>
            <div className="flex size-full items-center justify-center p-10">
              <VectorGem idPrefix="compare-gem" className="w-1/2 max-w-64" />
            </div>
          </div>

          <div
            className="absolute inset-y-0 z-20 w-px bg-trace/80 shadow-[0_0_18px_rgba(34,211,238,0.55)]"
            style={{ left: `${position}%` }}
          >
            <div
              role="slider"
              tabIndex={0}
              aria-label="Raster and vector comparison divider"
              aria-orientation="horizontal"
              aria-valuemin={MIN}
              aria-valuemax={MAX}
              aria-valuenow={percent}
              aria-valuetext={`${percent}% raster`}
              onKeyDown={handleKeyDown}
              className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-trace/50 bg-studio-surface text-trace shadow-[0_0_28px_rgba(34,211,238,0.4)] outline-none focus-visible:ring-2 focus-visible:ring-trace/60"
            >
              <GripVertical className="size-4" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-studio-border/70 px-3 py-2.5">
          <span className="flex items-center gap-1.5 text-[11px] text-studio-muted">
            <MoveHorizontal className="size-3.5 text-trace" />
            Drag the divider — or use arrow keys
          </span>
          <span className="font-mono text-[10px] tracking-wider text-studio-muted">
            100% EDITABLE PATHS
          </span>
        </div>
      </div>
    </div>
  );
}
