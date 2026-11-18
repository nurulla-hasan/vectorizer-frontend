"use client";

import * as React from "react";
import { useVectorStudio } from "./trace-studio-context";
import { VectorSvgLayer } from "./trace-svg-layer";

const LOUPE_RADIUS = 88; // 176px lens / 2 (size-44)

interface WireframeLoupeProps {
  pointer: {
    x: number;
    y: number;
    paneX: number;
    paneY: number;
  };
}

export function WireframeLoupe({ pointer }: WireframeLoupeProps) {
  const { originalUrl, preview, camera } = useVectorStudio();
  if (!preview) return null;

  const loupeWorldStyle: React.CSSProperties = {
    width: `${preview.width}px`,
    height: `${preview.height}px`,
    transform: `translate(${LOUPE_RADIUS - pointer.paneX + camera.dx}px, ${LOUPE_RADIUS - pointer.paneY + camera.dy}px) scale(${camera.scale})`,
    transformOrigin: "0 0",
  };

  return (
    <div
      aria-hidden="true"
      style={{
        left: `${pointer.x}px`,
        top: `${pointer.y}px`,
      }}
      className="vk-loupe-ring pointer-events-none absolute z-20 size-44 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-studio-surface"
    >
      <div className="relative size-full overflow-hidden">
        <div className="absolute top-0 left-0" style={loupeWorldStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            crossOrigin="use-credentials"
            alt=""
            className="vk-crisp-image block size-full select-none"
            draggable={false}
          />
          <div className="absolute inset-0">
            <VectorSvgLayer preview={preview} wireframe={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
