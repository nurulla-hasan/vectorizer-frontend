"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { VectorPreviewData } from "@/lib/vectorizer-api";

interface VectorSvgLayerProps {
  preview: VectorPreviewData;
  wireframe: boolean;
}

export const VectorSvgLayer = React.memo(function VectorSvgLayer({
  preview,
  wireframe,
}: VectorSvgLayerProps) {
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
        {preview.paths.map((item) => (
          <path
            key={item.id}
            fill={wireframe ? "none" : item.fill}
            fillRule={item.fillRule}
            stroke={wireframe ? "var(--trace)" : undefined}
            strokeWidth={wireframe ? 1 : undefined}
            vectorEffect={wireframe ? "non-scaling-stroke" : undefined}
            d={item.d}
            transform={item.transform}
          />
        ))}
      </svg>
    </div>
  );
});
