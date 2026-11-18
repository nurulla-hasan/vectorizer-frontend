"use client";

import * as React from "react";
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
  Palette,
  Pencil,
  PenTool,
  Plus,
  Redo2,
  RotateCcw,
  Ruler,
  ScanSearch,
  Scissors,
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
import { StudioUserMenu } from "./studio-user-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { EXPORT_PRESET_LABELS, type VectorExportPreset } from "@/services";
import {
  LOUPE_MIN_ZOOM_PERCENT,
  useVectorStudio,
} from "./trace-studio-context";

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
    exportPreset,
    setExportPreset,
    editMode,
    setEditMode,
    selectedPathId,
    deletePath,
    removeFragments,
    recolorPath,
    getPathFill,
    undoPathEdit,
    redoPathEdit,
    discardPathEdits,
    savePathEdits,
    hasUnsavedEdits,
    canUndoPathEdit,
    canRedoPathEdit,
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
  const [recolorScope, setRecolorScope] = React.useState<"path" | "color">(
    "path",
  );

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
              title="Undo (Ctrl+Z)"
              disabled={!canUndoPathEdit}
              onClick={undoPathEdit}
            >
              <Undo2 className="size-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Redo last path edit"
              title="Redo (Ctrl+Shift+Z)"
              disabled={!canRedoPathEdit}
              onClick={redoPathEdit}
            >
              <Redo2 className="size-4" />
            </Button>
            {selectedPathId && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="secondary"
                      size="icon"
                      aria-label="Recolor selected path"
                      title="Recolor path"
                      disabled={isSavingEdits}
                    />
                  }
                >
                  <Palette className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Apply to</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={recolorScope}
                      onValueChange={(value) =>
                        setRecolorScope(value as "path" | "color")
                      }
                    >
                      <DropdownMenuRadioItem value="path" closeOnClick={false}>
                        Selected path
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="color" closeOnClick={false}>
                        All paths with this color
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>New color</DropdownMenuLabel>
                    <div className="grid grid-cols-6 gap-1 p-1.5">
                      {preview.palette.slice(0, 18).map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          title={hex}
                          aria-label={`Recolor to ${hex}`}
                          onClick={() =>
                            recolorPath(selectedPathId, hex, recolorScope)
                          }
                          style={{ backgroundColor: hex }}
                          className="size-6 rounded border border-studio-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        />
                      ))}
                    </div>
                    <p className="px-2 py-1.5 text-xs text-muted-foreground">
                      Current: {getPathFill(selectedPathId)}
                    </p>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="secondary"
                    size="icon"
                    aria-label="Remove tiny fragments"
                    title="Remove tiny fragments in bulk"
                    disabled={isSavingEdits}
                  />
                }
              >
                <Scissors className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    Remove paths up to
                  </DropdownMenuLabel>
                  {[8, 16, 32, 64].map((px) => (
                    <DropdownMenuItem
                      key={px}
                      onClick={() => removeFragments(px)}
                    >
                      <Scissors className="size-4" />
                      {px} px bits
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  Selected path is kept · one Undo restores all
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <DropdownMenuLabel>Export Preset</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={exportPreset}
                onValueChange={(value) =>
                  setExportPreset(value as VectorExportPreset)
                }
              >
                {(Object.keys(EXPORT_PRESET_LABELS) as VectorExportPreset[]).map(
                  (preset) => (
                    <DropdownMenuRadioItem key={preset} value={preset} closeOnClick={false}>
                      <span className="flex flex-col">
                        <span>{EXPORT_PRESET_LABELS[preset].label}</span>
                        <span className="text-xs text-muted-foreground">
                          {EXPORT_PRESET_LABELS[preset].description}
                        </span>
                      </span>
                    </DropdownMenuRadioItem>
                  ),
                )}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
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
              <DropdownMenuItem onClick={() => handleExport("eps")}>
                <PenTool className="size-4" />
                EPS (Legacy Print)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("dxf")}>
                <Ruler className="size-4" />
                DXF (CAD &amp; CNC)
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

        <div className="mx-1 h-6 w-px bg-studio-border" aria-hidden="true" />

        <StudioUserMenu />
      </div>
    </div>
  );
}
