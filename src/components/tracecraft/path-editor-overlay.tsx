"use client";

import * as React from "react";
import type { VectorPreviewData } from "@/services";
import {
  applyMatrix,
  getEditablePoints,
  mapDeltaToLocal,
  movePathPoint,
  parseSvgPath,
  parseTransformMatrix,
  serializeSvgPath,
  type PathPoint,
} from "@/lib/svg-path-edit";

interface PathEditorOverlayProps {
  preview: VectorPreviewData;
  pathId: string;
  pathD: string;
  pathTransform?: string;
  cameraScale: number;
  onBeginEdit: (pathId: string) => void;
  onPathDChange: (pathId: string, d: string) => void;
}

interface DragState {
  pointerId: number;
  point: PathPoint;
  startX: number;
  startY: number;
  commands: NonNullable<ReturnType<typeof parseSvgPath>>;
  beganEdit: boolean;
}

export function PathEditorOverlay({
  preview,
  pathId,
  pathD,
  pathTransform,
  cameraScale,
  onBeginEdit,
  onPathDChange,
}: PathEditorOverlayProps) {
  const dragRef = React.useRef<DragState | null>(null);
  const scale = Math.max(0.05, cameraScale);
  const anchorRadius = 5 / scale;
  const controlRadius = 3.5 / scale;
  const strokeWidth = 1.25 / scale;

  const geometry = React.useMemo(() => {
    const commands = parseSvgPath(pathD);
    if (!commands) return null;
    const matrix = parseTransformMatrix(pathTransform);
    const points = getEditablePoints(commands).map((point) => {
      const mapped = applyMatrix(matrix, point.x, point.y);
      const lineTo = point.lineTo
        ? applyMatrix(matrix, point.lineTo.x, point.lineTo.y)
        : undefined;
      return { ...point, x: mapped.x, y: mapped.y, lineTo };
    });
    return { commands, matrix, points };
  }, [pathD, pathTransform]);

  if (!geometry) return null;

  const handlePointerDown = (
    event: React.PointerEvent<SVGCircleElement>,
    point: PathPoint,
  ) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const commands = parseSvgPath(pathD);
    if (!commands) return;
    dragRef.current = {
      pointerId: event.pointerId,
      point,
      startX: event.clientX,
      startY: event.clientY,
      commands,
      beganEdit: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<SVGCircleElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();

    const previewDx = (event.clientX - drag.startX) / scale;
    const previewDy = (event.clientY - drag.startY) / scale;
    if (!drag.beganEdit) {
      if (previewDx === 0 && previewDy === 0) return;
      drag.beganEdit = true;
      onBeginEdit(pathId);
    }
    const local = mapDeltaToLocal(geometry.matrix, previewDx, previewDy);
    const next = movePathPoint(drag.commands, drag.point, local.dx, local.dy);
    onPathDChange(pathId, serializeSvgPath(next));
  };

  const endDrag = (event: React.PointerEvent<SVGCircleElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <svg
      className="pointer-events-none absolute inset-0 overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={preview.viewBox}
      width={preview.width}
      height={preview.height}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {geometry.points.map((point) => {
        const key = `${point.cmdIndex}-${point.field}`;
        if (point.kind === "control" && point.lineTo) {
          return (
            <g key={key}>
              <line
                x1={point.lineTo.x}
                y1={point.lineTo.y}
                x2={point.x}
                y2={point.y}
                stroke="var(--trace)"
                strokeOpacity={0.6}
                strokeWidth={strokeWidth}
              />
              <circle
                cx={point.x}
                cy={point.y}
                r={controlRadius}
                fill="var(--trace)"
                stroke="#ffffff"
                strokeWidth={strokeWidth}
                style={{ pointerEvents: "auto", cursor: "grab" }}
                onPointerDown={(event) =>
                  handlePointerDown(event, {
                    cmdIndex: point.cmdIndex,
                    field: point.field,
                  })
                }
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              />
            </g>
          );
        }
        return (
          <circle
            key={key}
            cx={point.x}
            cy={point.y}
            r={anchorRadius}
            fill="#ffffff"
            stroke="var(--trace)"
            strokeWidth={strokeWidth}
            style={{ pointerEvents: "auto", cursor: "grab" }}
            onPointerDown={(event) =>
              handlePointerDown(event, {
                cmdIndex: point.cmdIndex,
                field: point.field,
              })
            }
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          />
        );
      })}
    </svg>
  );
}
