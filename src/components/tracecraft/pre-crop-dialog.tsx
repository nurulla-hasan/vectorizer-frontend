"use client";

import * as React from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { Crop, ZoomIn, ZoomOut } from "lucide-react";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getCroppedRasterFile } from "@/lib/cropImage";
import { errorToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { MAX_UPLOAD_BYTES, MAX_VECTOR_DIMENSION } from "./types";

const ASPECT_PRESETS = [
  { id: "original", label: "Original", ratio: null },
  { id: "square", label: "1:1", ratio: 1 },
  { id: "landscape", label: "4:3", ratio: 4 / 3 },
  { id: "wide", label: "16:9", ratio: 16 / 9 },
] as const;

type AspectPresetId = (typeof ASPECT_PRESETS)[number]["id"];

function formatAspect(width: number, height: number): string {
  if (!width || !height) return "—";
  const ratio = width / height;
  const common: Array<[number, number]> = [
    [1, 1],
    [4, 3],
    [3, 2],
    [16, 9],
    [21, 9],
    [3, 4],
    [2, 3],
    [9, 16],
  ];
  for (const [rw, rh] of common) {
    if (Math.abs(ratio - rw / rh) < 0.02) return `${rw}:${rh}`;
  }
  return ratio >= 1
    ? `${ratio.toFixed(2)}:1`
    : `1:${(1 / ratio).toFixed(2)}`;
}

function formatMegapixels(width: number, height: number): string {
  return `${((width * height) / 1_000_000).toFixed(1)} MP`;
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono text-foreground">{value}</dd>
    </div>
  );
}

interface CropWorkspaceProps {
  imageSrc: string;
  fileName: string;
  onCancel: () => void;
  onConfirm: (file: File) => void;
}

function CropWorkspace({
  imageSrc,
  fileName,
  onCancel,
  onConfirm,
}: CropWorkspaceProps) {
  const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [aspectId, setAspectId] = React.useState<AspectPresetId>("original");
  const [natural, setNatural] = React.useState<{
    width: number;
    height: number;
  } | null>(null);
  const [croppedArea, setCroppedArea] = React.useState<Area | null>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  const aspect = React.useMemo(() => {
    if (aspectId === "original") {
      return natural ? natural.width / natural.height : 1;
    }
    return ASPECT_PRESETS.find((preset) => preset.id === aspectId)?.ratio ?? 1;
  }, [aspectId, natural]);

  const outputScale = croppedArea
    ? Math.min(
        1,
        MAX_VECTOR_DIMENSION /
          Math.max(1, croppedArea.width, croppedArea.height),
      )
    : 1;
  const outputWidth = croppedArea
    ? Math.max(1, Math.round(croppedArea.width * outputScale))
    : 0;
  const outputHeight = croppedArea
    ? Math.max(1, Math.round(croppedArea.height * outputScale))
    : 0;
  const needsDownscale = croppedArea != null && outputScale < 1;

  const handleAspectChange = (nextId: AspectPresetId) => {
    setAspectId(nextId);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleConfirm = async () => {
    if (!croppedArea) return;
    setIsExporting(true);
    try {
      const cropped = await getCroppedRasterFile(imageSrc, croppedArea, {
        fileName,
        maxDimension: MAX_VECTOR_DIMENSION,
        maxBytes: MAX_UPLOAD_BYTES,
        preferTransparent: /\.(png|webp|gif|bmp)$/i.test(fileName),
      });
      if (!cropped) {
        errorToast("Crop failed", "Could not render the cropped image.");
        return;
      }
      onConfirm(cropped);
    } catch {
      errorToast("Crop failed", "Could not render the cropped image.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-medium text-muted-foreground">
          Aspect
        </span>
        {ASPECT_PRESETS.map((preset) => (
          <Button
            key={preset.id}
            type="button"
            variant={aspectId === preset.id ? "default" : "secondary"}
            aria-pressed={aspectId === preset.id}
            onClick={() => handleAspectChange(preset.id)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="relative h-[min(38vh,300px)] w-full overflow-hidden rounded-xl bg-black/90 shadow-inner">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          cropShape="rect"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_area, areaPixels) => setCroppedArea(areaPixels)}
          onMediaLoaded={(media) =>
            setNatural({ width: media.naturalWidth, height: media.naturalHeight })
          }
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          aria-label="Zoom out"
          onClick={() => setZoom((value) => Math.max(1, value - 0.2))}
        >
          <ZoomOut className="size-4" />
        </Button>
        <Slider
          aria-label="Crop zoom"
          min={1}
          max={4}
          step={0.05}
          value={zoom}
          onValueChange={(value) =>
            setZoom(Array.isArray(value) ? value[0] : value)
          }
        />
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          aria-label="Zoom in"
          onClick={() => setZoom((value) => Math.min(4, value + 0.2))}
        >
          <ZoomIn className="size-4" />
        </Button>
        <span className="w-12 text-right font-mono text-xs text-muted-foreground">
          {zoom.toFixed(1)}x
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-muted/40 p-3">
          <p className="text-xs font-semibold text-foreground">Original image</p>
          <dl className="mt-2 space-y-1 text-xs">
            <StatRow
              label="Size"
              value={natural ? `${natural.width} × ${natural.height} px` : "—"}
            />
            <StatRow
              label="Aspect ratio"
              value={natural ? formatAspect(natural.width, natural.height) : "—"}
            />
            <StatRow
              label="Megapixels"
              value={natural ? formatMegapixels(natural.width, natural.height) : "—"}
            />
          </dl>
        </div>

        <div
          className={cn(
            "rounded-xl border p-3",
            needsDownscale
              ? "border-amber-500/40 bg-amber-500/10"
              : "border-border bg-muted/40",
          )}
        >
          <p className="text-xs font-semibold text-foreground">
            Cropped selection
          </p>
          <dl className="mt-2 space-y-1 text-xs">
            <StatRow
              label="Size"
              value={
                croppedArea
                  ? `${croppedArea.width} × ${croppedArea.height} px`
                  : "—"
              }
            />
            <StatRow
              label="Aspect ratio"
              value={
                croppedArea
                  ? formatAspect(croppedArea.width, croppedArea.height)
                  : "—"
              }
            />
            <StatRow
              label="Megapixels"
              value={
                croppedArea
                  ? formatMegapixels(croppedArea.width, croppedArea.height)
                  : "—"
              }
            />
          </dl>
        </div>
      </div>

      {needsDownscale && (
        <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
          The crop exceeds {MAX_VECTOR_DIMENSION} px on its longest side and will
          be scaled to {outputWidth} × {outputHeight} px.
        </p>
      )}

      <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-2 border-t border-border bg-popover px-4 py-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isExporting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleConfirm}
          loading={isExporting}
          loadingText="Preparing..."
          disabled={!croppedArea}
        >
          <Crop className="size-4" />
          Vectorize crop
        </Button>
      </div>
    </div>
  );
}

interface PreCropDialogProps {
  open: boolean;
  imageSrc: string | null;
  fileName: string;
  onCancel: () => void;
  onConfirm: (file: File) => void;
}

export function PreCropDialog({
  open,
  imageSrc,
  fileName,
  onCancel,
  onConfirm,
}: PreCropDialogProps) {
  if (!imageSrc) return null;

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel();
      }}
      title="Pre-Crop"
      description={`This image is larger than the ${MAX_VECTOR_DIMENSION} px processing size. Choose the portion to vectorize — larger crops are scaled down automatically.`}
      size="xl"
      bodyClassName="pb-0"
    >
      <CropWorkspace
        key={imageSrc}
        imageSrc={imageSrc}
        fileName={fileName}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </Modal>
  );
}
