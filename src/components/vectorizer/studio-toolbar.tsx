"use client";

import * as React from "react";
import {
  ChevronDown,
  Columns2,
  Download,
  Eye,
  FileCode2,
  FileText,
  Image as ImageIcon,
  Maximize2,
  Plus,
  ScanSearch,
  Sliders,
  Square,
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
import type { ExportFormat } from "@/lib/vectorizer-api";
import type { ViewMode } from "./types";

interface StudioToolbarProps {
  originalName: string;
  dimensions: { width: number; height: number };
  scale: number;
  sliderValue: number;
  viewMode: ViewMode;
  loupeEnabled: boolean;
  fullWireframe: boolean;
  isDownloading: boolean;
  onReset: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleLoupe: () => void;
  onToggleWireframe: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onSliderZoom: (val: number | readonly number[]) => void;
  onZoomFit: () => void;
  onZoom1To1: () => void;
  onExport: (format: ExportFormat, scale?: 1 | 2 | 4) => void;
}

export function StudioToolbar({
  originalName,
  dimensions,
  scale,
  sliderValue,
  viewMode,
  loupeEnabled,
  fullWireframe,
  isDownloading,
  onReset,
  onViewModeChange,
  onToggleLoupe,
  onToggleWireframe,
  onZoomOut,
  onZoomIn,
  onSliderZoom,
  onZoomFit,
  onZoom1To1,
  onExport,
}: StudioToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Vector workspace controls"
      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-studio-border bg-studio-panel px-4 py-3 text-studio-foreground shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="default" onClick={onReset}>
          <Plus className="size-4" />
          New Image
        </Button>

        <Badge variant="secondary" className="max-w-48 truncate">
          {originalName}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Comparison view modes">
        <Button
          variant={viewMode === "split" ? "default" : "ghost"}
          size="default"
          aria-pressed={viewMode === "split"}
          onClick={() => onViewModeChange("split")}
        >
          <Columns2 className="size-4" />
          Side-by-Side
        </Button>
        <Button
          variant={viewMode === "curtain" ? "default" : "ghost"}
          size="default"
          aria-pressed={viewMode === "curtain"}
          onClick={() => onViewModeChange("curtain")}
        >
          <Sliders className="size-4" />
          Curtain
        </Button>
        <Button
          variant={viewMode === "single" ? "default" : "ghost"}
          size="default"
          aria-pressed={viewMode === "single"}
          onClick={() => onViewModeChange("single")}
        >
          <Square className="size-4" />
          Single
        </Button>

        <Button
          variant={loupeEnabled ? "secondary" : "ghost"}
          size="default"
          aria-pressed={loupeEnabled}
          onClick={onToggleLoupe}
        >
          <ScanSearch className="size-4" />
          Wireframe Loupe
        </Button>

        <Button
          variant={fullWireframe ? "secondary" : "ghost"}
          size="default"
          aria-pressed={fullWireframe}
          onClick={onToggleWireframe}
        >
          <Eye className="size-4" />
          Full Wireframe
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Zoom out"
          onClick={onZoomOut}
        >
          <ZoomOut className="size-4" />
        </Button>

        <div className="w-28">
          <Slider
            aria-label="Canvas zoom level"
            min={0}
            max={100}
            step={0.5}
            value={sliderValue}
            onValueChange={onSliderZoom}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Zoom in"
          onClick={onZoomIn}
        >
          <ZoomIn className="size-4" />
        </Button>

        <span
          aria-live="polite"
          className="w-14 text-center font-mono text-xs text-studio-muted"
        >
          {scale.toFixed(1)}x
        </span>

        <Button variant="outline" size="default" onClick={onZoomFit}>
          <Maximize2 className="size-4" />
          Fit
        </Button>

        <Button variant="outline" size="default" onClick={onZoom1To1}>
          1:1
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                size="lg"
                loading={isDownloading}
                loadingText="Exporting..."
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
              <DropdownMenuItem onClick={() => onExport("svg")}>
                <FileCode2 className="size-4" />
                SVG (Scalable Vector)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport("pdf")}>
                <FileText className="size-4" />
                PDF (Print-Ready Vector)
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Transparent Raster</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onExport("png", 2)}>
                <ImageIcon className="size-4" />
                PNG 2× ({dimensions.width * 2} × {dimensions.height * 2})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport("png", 4)}>
                <ImageIcon className="size-4" />
                PNG 4× ({dimensions.width * 4} × {dimensions.height * 4})
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
