"use client";

import { RefreshCw, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import type {
  VectorEngine,
  VectorHierarchical,
  VectorMode,
  VectorSettings,
} from "@/lib/vectorizer-api";
import { useVectorStudio } from "./vector-studio-context";

const ENGINE_LABELS: Record<VectorEngine, string> = {
  "ai-vtracer-native": "AI + Rust VTracer",
  "ai-potrace-bezier": "AI + Potrace Bézier",
  "vtracer-native": "Rust VTracer 0.6.4",
  "subpixel-bezier": "Subpixel Bézier",
  "potrace-bezier": "Potrace Bézier",
  imagetracerjs: "ImageTracer",
};

const MODE_LABELS: Record<VectorMode, string> = {
  spline: "Spline (Smooth Curves)",
  polygon: "Polygon (Straight Edges)",
  pixel: "Pixel (Crisp Grid)",
};

const HIERARCHICAL_LABELS: Record<VectorHierarchical, string> = {
  stacked: "Stacked Shapes",
  cutout: "Cutout Layers",
};

export function TuningSidebar() {
  const {
    job,
    preview,
    settings,
    setSettings: onSettingsChange,
    isReprocessing,
    handleReprocess: onReprocess,
  } = useVectorStudio();

  if (!job || !preview) return null;

  const { engine, processingMs } = job;
  const { palette, pathCount, width, height } = preview;
  const dimensions = { width, height };

  const updateField = <K extends keyof VectorSettings>(
    key: K,
    value: VectorSettings[K],
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <aside className="flex w-full shrink-0 flex-col gap-5 rounded-2xl border border-studio-border bg-studio-panel p-5 text-studio-foreground lg:w-80">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Vector Tuning</h2>
        </div>
        <div className="flex items-center gap-1.5">
          {engine && (
            <Badge
              variant={engine === "imagetracerjs" ? "outline" : "default"}
            >
              {ENGINE_LABELS[engine] ?? "ImageTracer"}
            </Badge>
          )}
          {processingMs !== null && (
            <Badge variant="secondary">{processingMs} ms</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl border border-studio-border bg-studio-surface p-3 text-xs">
        <div>
          <p className="text-studio-muted">Resolution</p>
          <p className="font-mono font-medium text-studio-foreground">
            {dimensions.width} × {dimensions.height}
          </p>
        </div>
        <div>
          <p className="text-studio-muted">Vector Paths</p>
          <p className="font-mono font-medium text-studio-foreground">
            {pathCount}
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vector-mode">Curve Fitting Mode</Label>
          <Select
            value={settings.mode}
            onValueChange={(value) => {
              if (value) updateField("mode", value as VectorMode);
            }}
          >
            <SelectTrigger id="vector-mode" className="w-full">
              <SelectValue>
                {(val) => MODE_LABELS[val as VectorMode] ?? MODE_LABELS.spline}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spline">{MODE_LABELS.spline}</SelectItem>
              <SelectItem value="polygon">{MODE_LABELS.polygon}</SelectItem>
              <SelectItem value="pixel">{MODE_LABELS.pixel}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vector-hierarchical">Layer Stacking</Label>
          <Select
            value={settings.hierarchical}
            onValueChange={(value) => {
              if (value)
                updateField("hierarchical", value as VectorHierarchical);
            }}
          >
            <SelectTrigger id="vector-hierarchical" className="w-full">
              <SelectValue>
                {(val) =>
                  HIERARCHICAL_LABELS[val as VectorHierarchical] ??
                  HIERARCHICAL_LABELS.stacked
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stacked">
                {HIERARCHICAL_LABELS.stacked}
              </SelectItem>
              <SelectItem value="cutout">
                {HIERARCHICAL_LABELS.cutout}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <Label htmlFor="color-precision-slider">Color Precision</Label>
            <span className="font-mono text-studio-muted">
              {settings.colorPrecision}
            </span>
          </div>
          <Slider
            id="color-precision-slider"
            aria-label="Color precision"
            min={1}
            max={8}
            step={1}
            value={settings.colorPrecision}
            onValueChange={(val) =>
              updateField(
                "colorPrecision",
                Array.isArray(val) ? val[0] : val,
              )
            }
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <Label htmlFor="max-colors-slider">Max Palette Colors</Label>
            <span className="font-mono text-studio-muted">
              {settings.maxColors}
            </span>
          </div>
          <Slider
            id="max-colors-slider"
            aria-label="Max palette colors"
            min={2}
            max={64}
            step={1}
            value={settings.maxColors}
            onValueChange={(val) =>
              updateField("maxColors", Array.isArray(val) ? val[0] : val)
            }
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <Label htmlFor="filter-speckle-slider">Filter Speckle</Label>
            <span className="font-mono text-studio-muted">
              {settings.filterSpeckle} px
            </span>
          </div>
          <Slider
            id="filter-speckle-slider"
            aria-label="Filter speckle"
            min={0}
            max={16}
            step={1}
            value={settings.filterSpeckle}
            onValueChange={(val) =>
              updateField("filterSpeckle", Array.isArray(val) ? val[0] : val)
            }
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <Label htmlFor="corner-threshold-slider">Corner Threshold</Label>
            <span className="font-mono text-studio-muted">
              {settings.cornerThreshold}°
            </span>
          </div>
          <Slider
            id="corner-threshold-slider"
            aria-label="Corner threshold"
            min={0}
            max={180}
            step={5}
            value={settings.cornerThreshold}
            onValueChange={(val) =>
              updateField(
                "cornerThreshold",
                Array.isArray(val) ? val[0] : val,
              )
            }
          />
        </div>
      </div>

      <Button
        size="lg"
        className="w-full"
        loading={isReprocessing}
        loadingText="Re-Vectorizing..."
        onClick={onReprocess}
      >
        <RefreshCw className="size-4" />
        Re-Vectorize
      </Button>

      {palette.length > 0 && (
        <div className="space-y-2 border-t border-studio-border pt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-studio-foreground">
              Detected Palette
            </span>
            <span className="font-mono text-studio-muted">
              {palette.length} colors
            </span>
          </div>
          <ul className="flex flex-wrap gap-1.5" aria-label="Detected SVG colors">
            {palette.slice(0, 24).map((hex) => (
              <li
                key={hex}
                title={hex}
                aria-label={`Color ${hex}`}
                style={{ backgroundColor: hex }}
                className="size-5 rounded border border-studio-border"
              />
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
