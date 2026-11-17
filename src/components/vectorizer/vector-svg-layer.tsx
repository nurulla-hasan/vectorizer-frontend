"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { VectorPreviewData } from "@/services";

interface VectorSvgLayerProps {
  preview: VectorPreviewData;
  wireframe: boolean;
  pathOverrides?: Record<string, string>;
  deletedPathIds?: readonly string[];
  editMode?: boolean;
  selectedPathId?: string | null;
  onSelectPath?: (pathId: string) => void;
}

export const VectorSvgLayer = React.memo(function VectorSvgLayer({
  preview,
  wireframe,
  pathOverrides,
  deletedPathIds,
  editMode = false,
  selectedPathId,
  onSelectPath,
}: VectorSvgLayerProps) {
  const deleted = React.useMemo(
    () => new Set(deletedPathIds ?? []),
    [deletedPathIds],
  );

  return (
    <div
      className={cn(
        "size-full",
        wireframe ? "vk-wireframe-svg" : "vk-full-svg",
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={preview.viewBox}
        width={preview.width}
        height={preview.height}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {preview.paths.map((item) => {
          if (deleted.has(item.id)) return null;
          const selected = editMode && item.id === selectedPathId;
          return (
            <path
              key={item.id}
              fill={wireframe ? "none" : item.fill}
              fillRule={item.fillRule}
              stroke={
                wireframe
                  ? "var(--trace)"
                  : selected
                    ? "var(--trace)"
                    : undefined
              }
              strokeWidth={wireframe ? 0.75 : selected ? 1.25 : undefined}
              vectorEffect={
                wireframe || selected ? "non-scaling-stroke" : undefined
              }
              d={pathOverrides?.[item.id] ?? item.d}
              transform={item.transform}
              style={editMode ? { cursor: "pointer" } : undefined}
              onPointerDown={
                editMode
                  ? (event) => {
                      if (event.button !== 0) return;
                      onSelectPath?.(item.id);
                    }
                  : undefined
              }
            />
          );
        })}
      </svg>
    </div>
  );
});
