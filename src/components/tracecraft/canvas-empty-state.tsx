"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardPaste,
  ImageUp,
  Sparkles,
} from "lucide-react";
// import { Logo } from "@/components/common/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { createImage } from "@/lib/cropImage";
import { errorToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { PreCropDialog } from "./pre-crop-dialog";
import { StudioUserMenu } from "./studio-user-menu";
import {
  createSampleImageFile,
  CROPPABLE_MIME_TYPES,
  drawSamplePreset,
  MAX_SOURCE_BYTES,
  MAX_SOURCE_MEGAPIXELS,
  MAX_UPLOAD_BYTES,
  MAX_VECTOR_DIMENSION,
  SAMPLE_PRESETS,
  type SamplePreset,
} from "./types";
import { useVectorStudio } from "./trace-studio-context";

function SampleThumbnail({ presetId }: { presetId: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) drawSamplePreset(ctx, 512, presetId);
  }, [presetId]);

  return (
    <canvas
      ref={canvasRef}
      width={512}
      height={512}
      aria-hidden="true"
      className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
    />
  );
}

function ProgressRow({
  label,
  state,
}: {
  label: string;
  state: "done" | "active" | "pending";
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "w-16 shrink-0 text-xs font-medium",
          state === "pending" ? "text-studio-muted" : "text-studio-foreground",
        )}
      >
        {label}
      </span>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-studio-surface">
        {state === "done" && (
          <div className="size-full rounded-full bg-primary/70" />
        )}
        {state === "active" && (
          <div className="vk-progress-indeterminate absolute inset-y-0 left-0 w-2/5 rounded-full bg-primary" />
        )}
      </div>
    </div>
  );
}

export function CanvasEmptyState() {
  const {
    isProcessing,
    processingStage,
    cancelProcessing: onCancelProcessing,
    handleFileSelected: onFileSelected,
    handleUrlImport: onUrlImport,
  } = useVectorStudio();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [urlValue, setUrlValue] = React.useState("");
  const [loadingSampleId, setLoadingSampleId] = React.useState<string | null>(
    null,
  );
  const [pendingCrop, setPendingCrop] = React.useState<{
    file: File;
    src: string;
  } | null>(null);

  React.useEffect(() => {
    return () => {
      if (pendingCrop) URL.revokeObjectURL(pendingCrop.src);
    };
  }, [pendingCrop]);

  const validateAndSelectFile = React.useCallback(
    async (file: File) => {
      if (!CROPPABLE_MIME_TYPES.has(file.type)) {
        errorToast(
          "Unsupported file format",
          "Please choose a PNG, JPG, WebP, GIF, BMP, or TIFF raster image.",
        );
        return;
      }
      if (file.size > MAX_SOURCE_BYTES) {
        errorToast(
          "File too large",
          `Please choose an image up to ${Math.round(MAX_SOURCE_BYTES / (1024 * 1024))} MB.`,
        );
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      try {
        const image = await createImage(objectUrl);
        const width = image.naturalWidth;
        const height = image.naturalHeight;

        if (!width || !height) {
          throw new Error("Invalid image dimensions");
        }
        if ((width * height) / 1_000_000 > MAX_SOURCE_MEGAPIXELS) {
          URL.revokeObjectURL(objectUrl);
          errorToast(
            "Image too large",
            `Please choose an image up to ${MAX_SOURCE_MEGAPIXELS} megapixels.`,
          );
          return;
        }

        const needsCrop =
          width > MAX_VECTOR_DIMENSION ||
          height > MAX_VECTOR_DIMENSION ||
          file.size > MAX_UPLOAD_BYTES;

        if (needsCrop) {
          setPendingCrop({ file, src: objectUrl });
          return;
        }

        URL.revokeObjectURL(objectUrl);
        onFileSelected(file);
      } catch {
        URL.revokeObjectURL(objectUrl);
        errorToast(
          "Could not read image",
          "The selected file could not be opened as an image.",
        );
      }
    },
    [onFileSelected],
  );

  const closeCropDialog = React.useCallback(() => {
    if (pendingCrop) URL.revokeObjectURL(pendingCrop.src);
    setPendingCrop(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [pendingCrop]);

  const confirmCrop = React.useCallback(
    (croppedFile: File) => {
      if (pendingCrop) URL.revokeObjectURL(pendingCrop.src);
      setPendingCrop(null);
      onFileSelected(croppedFile);
    },
    [onFileSelected, pendingCrop],
  );

  React.useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (isProcessing) return;
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            event.preventDefault();
            void validateAndSelectFile(file);
            return;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isProcessing, validateAndSelectFile]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      void validateAndSelectFile(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      void validateAndSelectFile(file);
    }
    event.target.value = "";
  };

  const handleSampleClick = async (preset: SamplePreset) => {
    if (isProcessing) return;
    setLoadingSampleId(preset.id);
    try {
      const sampleFile = await createSampleImageFile(preset.id);
      onFileSelected(sampleFile);
    } finally {
      setLoadingSampleId(null);
    }
  };

  const handleUrlSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = urlValue.trim();
    if (!trimmed || isProcessing) return;
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error("Unsupported protocol");
      }
    } catch {
      errorToast("Invalid URL", "Enter a full http(s) image URL.");
      return;
    }
    onUrlImport(trimmed);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className="relative flex size-full flex-col overflow-y-auto"
    >
      <div className="pointer-events-none absolute top-3 left-3 z-20">
        <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-studio-border bg-studio-panel/90 py-1 pr-3 pl-1 backdrop-blur">
          <Button
            variant="secondary"
            size="icon"
            aria-label="Back to site"
            render={<Link href="/" />}
          >
            <ArrowLeft className="size-4" />
          </Button>
          {/* <Logo size="sm" showText={false} /> */}
          <span className="text-sm font-semibold text-studio-foreground">
            Vector Studio
          </span>
        </div>
      </div>

      <div className="absolute top-3 right-3 z-20">
        <StudioUserMenu />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-8 sm:gap-8 sm:py-10">
        <div className="flex w-full max-w-xl flex-col items-center text-center">
          <Badge variant="secondary">
            <Sparkles className="size-3.5" />
            AI Raster-to-Vector Studio
          </Badge>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-studio-foreground sm:text-4xl">
            Start with an image
          </h1>
          <p className="mt-2 text-sm leading-6 text-studio-muted sm:text-base">
            Drop a raster file onto the canvas or paste it with{" "}
            <kbd className="rounded border border-studio-border bg-studio-panel px-1.5 py-0.5 font-mono text-xs whitespace-nowrap text-studio-foreground">
              Ctrl + V
            </kbd>
          </p>

          <div
            className={cn(
              "mt-6 flex w-full flex-col items-center gap-4 rounded-2xl p-6 transition-colors sm:p-8",
              isProcessing
                ? "border border-studio-border bg-studio-panel shadow-xl"
                : "border-2 border-dashed",
              !isProcessing &&
                (isDragging
                  ? "border-trace bg-trace/5"
                  : "border-studio-border bg-studio-panel/60"),
            )}
          >
            {isProcessing ? (
              <div className="w-full max-w-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-studio-foreground">
                    Preparing your vector
                  </p>
                  <Button variant="secondary" onClick={onCancelProcessing}>
                    Cancel
                  </Button>
                </div>

                <div className="mt-5 space-y-3.5">
                  <ProgressRow label="Upload" state="done" />
                  <ProgressRow
                    label="Process"
                    state={processingStage === "process" ? "active" : "done"}
                  />
                  <ProgressRow
                    label="Preview"
                    state={
                      processingStage === "preview" ? "active" : "pending"
                    }
                  />
                </div>

                <p className="mt-5 text-left text-xs text-studio-muted">
                  VTracer is tracing your artwork — this usually takes a few
                  seconds.
                </p>
              </div>
            ) : (
              <>
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <ImageUp className="size-7" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-studio-foreground">
                    {isDragging
                      ? "Release to start tracing"
                      : "Drop your artwork here"}
                  </p>
                  <p className="text-xs text-studio-muted">
                    PNG, JPG, WebP, GIF · large images can be cropped
                  </p>
                </div>

                <Button size="xl" onClick={() => inputRef.current?.click()}>
                  <ImageUp className="size-4" />
                  Choose image
                </Button>

                <div className="flex w-full max-w-sm flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Separator className="flex-1" />
                    <span className="text-xs text-studio-muted">
                      or import from URL
                    </span>
                    <Separator className="flex-1" />
                  </div>
                  <form
                    className="flex items-center gap-2"
                    onSubmit={handleUrlSubmit}
                  >
                    <Input
                      type="url"
                      inputMode="url"
                      aria-label="Image URL"
                      placeholder="https://example.com/logo.png"
                      value={urlValue}
                      onChange={(event) => setUrlValue(event.target.value)}
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={!urlValue.trim() || isProcessing}
                    >
                      Import
                    </Button>
                  </form>
                </div>

                <p className="flex items-center gap-1.5 text-xs text-studio-muted">
                  <ClipboardPaste className="size-3.5" />
                  or press Ctrl + V to paste
                </p>
              </>
            )}
          </div>
        </div>

        <div className="w-full max-w-3xl">
          <p className="mb-3 text-xs font-semibold tracking-wide text-studio-muted uppercase">
            Or try a sample
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                disabled={isProcessing}
                onClick={() => handleSampleClick(preset)}
                className="group flex flex-col overflow-hidden rounded-xl border border-studio-border bg-studio-panel/80 text-left transition-colors hover:border-primary/60 hover:bg-studio-panel focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="relative h-24 w-full overflow-hidden border-b border-studio-border bg-studio-surface sm:h-28">
                  <SampleThumbnail presetId={preset.id} />
                  {loadingSampleId === preset.id && (
                    <div className="absolute inset-0 grid place-items-center bg-studio-panel/70 backdrop-blur-xs">
                      <Spinner className="size-6 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <p className="text-sm font-medium text-studio-foreground">
                    {preset.label}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-studio-muted">
                    {preset.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-2.5 text-xs font-medium text-primary">
                    Vectorize this
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <PreCropDialog
        open={pendingCrop !== null}
        imageSrc={pendingCrop?.src ?? null}
        fileName={pendingCrop?.file.name ?? ""}
        onCancel={closeCropDialog}
        onConfirm={confirmCrop}
      />
    </div>
  );
}
