"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Download,
  Eye,
  FileCode2,
  FileText,
  Image as ImageIcon,
  Maximize2,
  Pencil,
  Plus,
  RotateCcw,
  ScanSearch,
  Sliders,
  SlidersHorizontal,
  Square,
  Trash2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import {
  LOUPE_MIN_ZOOM_PERCENT,
  useVectorStudio,
} from "./vector-studio-context";

export function StudioToolbar({
  onOpenSettings,
  onReset,
}: {
  onOpenSettings: () => void;
  onReset: () => void;
}) {
  const {
    job,
    preview,
    camera,
    sliderValue,
    viewMode,
    loupeEnabled,
    fullWireframe,
    isDownloading,
    editMode,
    setEditMode,
    selectedPathId,
    deletePath,
    undoPathEdit,
    discardPathEdits,
    savePathEdits,
    hasUnsavedEdits,
    canUndoPathEdit,
    isSavingEdits,
    setViewMode,
    setLoupeEnabled,
    setFullWireframe,
    zoomBy,
    handleSliderZoom,
    zoomToFit,
    zoom1To1,
    handleExport,
  } = useVectorStudio();

  if (!job || !preview) return null;

  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 z-30 flex flex-wrap items-start justify-between gap-2">
      <div className="pointer-events-auto flex items-center gap-1.5 rounded-xl border border-studio-border bg-studio-panel/90 p-1.5 shadow-lg backdrop-blur">
        <Button
          variant="secondary"
          size="icon"
          aria-label="Back to site"
          title="Back to site"
          render={<Link href="/" />}
        >
          <ArrowLeft className="size-4" />
        </Button>

        <Badge variant="secondary" className="max-w-40 truncate">
          {job.originalName}
        </Badge>

        <Button variant="secondary" size="default" onClick={onReset}>
          <Plus className="size-4" />
          New
        </Button>
      </div>

      <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-xl border border-studio-border bg-studio-panel/90 p-1.5 shadow-lg backdrop-blur">
        <Button
          variant={viewMode === "curtain" ? "default" : "secondary"}
          size="icon"
          aria-label="Curtain compare view"
          title="Curtain compare view"
          aria-pressed={viewMode === "curtain"}
          disabled={editMode}
          onClick={() => setViewMode("curtain")}
        >
          <Sliders className="size-4" />
        </Button>
        <Button
          variant={viewMode === "single" ? "default" : "secondary"}
          size="icon"
          aria-label="Single vector view"
          title="Single vector view"
          aria-pressed={viewMode === "single"}
          disabled={editMode}
          onClick={() => setViewMode("single")}
        >
          <Square className="size-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-studio-border" aria-hidden="true" />

        <Button
          variant={loupeEnabled ? "default" : "secondary"}
          size="icon"
          aria-label="Toggle wireframe loupe"
          title={`Wireframe loupe (available after ${LOUPE_MIN_ZOOM_PERCENT}% zoom)`}
          aria-pressed={loupeEnabled}
          disabled={editMode || sliderValue < LOUPE_MIN_ZOOM_PERCENT}
          onClick={() => setLoupeEnabled((v) => !v)}
        >
          <ScanSearch className="size-4" />
        </Button>
        <Button
          variant={fullWireframe ? "default" : "secondary"}
          size="icon"
          aria-label="Toggle full wireframe"
          title="Full wireframe"
          aria-pressed={fullWireframe}
          disabled={editMode}
          onClick={() => setFullWireframe((v) => !v)}
        >
          <Eye className="size-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-studio-border" aria-hidden="true" />

        <Button
          variant={editMode ? "default" : "secondary"}
          size="default"
          aria-label="Toggle manual path editing"
          title="Fix lines manually"
          aria-pressed={editMode}
          onClick={() => setEditMode(!editMode)}
        >
          <Pencil className="size-4" />
          Edit lines
        </Button>

        {(editMode || hasUnsavedEdits) && (
          <>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Undo last path edit"
              title="Undo (last path)"
              disabled={!canUndoPathEdit}
              onClick={undoPathEdit}
            >
              <Undo2 className="size-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Delete selected path"
              title="Delete selected path (Del)"
              disabled={!selectedPathId || isSavingEdits}
              onClick={() => selectedPathId && deletePath(selectedPathId)}
            >
              <Trash2 className="size-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Discard all manual edits"
              title="Discard all edits"
              disabled={!hasUnsavedEdits || isSavingEdits}
              onClick={discardPathEdits}
            >
              <RotateCcw className="size-4" />
            </Button>
            <Button
              size="default"
              loading={isSavingEdits}
              loadingText="Saving..."
              disabled={!hasUnsavedEdits}
              onClick={() => void savePathEdits()}
            >
              <Check className="size-4" />
              Save edits
            </Button>
          </>
        )}

        <div className="mx-1 h-6 w-px bg-studio-border" aria-hidden="true" />

        <Button
          variant="secondary"
          size="icon"
          aria-label="Zoom out"
          title="Zoom out"
          onClick={() => zoomBy(1 / 1.25)}
        >
          <ZoomOut className="size-4" />
        </Button>

        <div className="w-20 lg:w-28">
          <Slider
            aria-label="Canvas zoom level"
            min={0}
            max={100}
            step={0.5}
            value={sliderValue}
            onValueChange={handleSliderZoom}
          />
        </div>

        <Button
          variant="secondary"
          size="icon"
          aria-label="Zoom in"
          title="Zoom in"
          onClick={() => zoomBy(1.25)}
        >
          <ZoomIn className="size-4" />
        </Button>

        <span
          aria-live="polite"
          className="w-12 text-center font-mono text-xs text-studio-muted"
        >
          {Math.round(camera.scale * 100)}%
        </span>

        <Button
          variant="secondary"
          size="icon"
          aria-label="Zoom to fit"
          title="Zoom to fit"
          onClick={zoomToFit}
        >
          <Maximize2 className="size-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          aria-label="Zoom to 100%"
          title="Zoom to 100%"
          onClick={zoom1To1}
        >
          1:1
        </Button>

        <div className="mx-1 h-6 w-px bg-studio-border" aria-hidden="true" />

        <Button
          variant="secondary"
          size="icon"
          aria-label="Open vector settings"
          title="Vector tuning"
          onClick={onOpenSettings}
        >
          <SlidersHorizontal className="size-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                size="lg"
                loading={isDownloading}
                loadingText="Exporting..."
                disabled={hasUnsavedEdits}
                title={
                  hasUnsavedEdits
                    ? "Save your manual edits before exporting"
                    : "Export vector file"
                }
              />
            }
          >
            <Download className="size-4" />
            Export
            <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Vector Formats</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleExport("svg")}>
                <FileCode2 className="size-4" />
                SVG (Scalable Vector)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FileText className="size-4" />
                PDF (Print-Ready Vector)
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Transparent Raster</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleExport("png", 2)}>
                <ImageIcon className="size-4" />
                PNG 2× ({preview.width * 2} × {preview.height * 2})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("png", 4)}>
                <ImageIcon className="size-4" />
                PNG 4× ({preview.width * 4} × {preview.height * 4})
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
