"use client";

import * as React from "react";
import { ClipboardPaste, ImageUp, Layers, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { errorToast } from "@/lib/toast";
import {
  createSampleImageFile,
  SAMPLE_PRESETS,
  type SamplePreset,
} from "./types";
import { useVectorStudio } from "./vector-studio-context";

const ALLOWED_RASTER_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/tiff",
]);
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function HeroDropzone() {
  const { isProcessing, handleFileSelected: onFileSelected } = useVectorStudio();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [loadingSampleId, setLoadingSampleId] = React.useState<string | null>(
    null,
  );

  const validateAndSelectFile = React.useCallback(
    (file: File) => {
      if (!ALLOWED_RASTER_MIME_TYPES.has(file.type)) {
        errorToast(
          "Unsupported file format",
          "Please choose a PNG, JPG, WebP, GIF, BMP, or TIFF raster image.",
        );
        return;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        errorToast(
          "File too large",
          "Please upload an image up to 5 MB.",
        );
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected],
  );

  // Global Ctrl + V / Cmd + V clipboard image paste
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
            validateAndSelectFile(file);
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
      validateAndSelectFile(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSelectFile(file);
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

  return (
    <div className="space-y-10">
      <section
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "vk-blueprint-grid relative overflow-hidden rounded-3xl border p-8 text-center transition-colors sm:p-14",
          isDragging
            ? "border-trace ring-4 ring-trace/20"
            : "border-studio-border",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
          <Badge variant="secondary">
            <Sparkles className="size-3.5" />
            AI Raster-to-Vector Studio
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight text-studio-foreground sm:text-5xl">
            Trace Pixels into Crisp Scalable Vectors
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-studio-muted sm:text-base">
            Drop any PNG, JPG, or WebP artwork here — or paste directly with{" "}
            <kbd className="rounded border border-studio-border bg-studio-panel px-1.5 py-0.5 font-mono text-xs text-studio-foreground">
              Ctrl + V
            </kbd>{" "}
            — then inspect every path with our split canvas and cyan wireframe
            loupe.
          </p>

          <div
            className={cn(
              "mt-2 flex w-full max-w-lg flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed bg-studio-panel/80 p-8 backdrop-blur-sm transition-colors",
              isDragging ? "border-trace" : "border-studio-border",
            )}
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <ImageUp className="size-7" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-studio-foreground">
                {isDragging
                  ? "Release image to start vectorizing"
                  : "Drag & drop an image to vectorize"}
              </p>
              <p className="text-xs text-studio-muted">
                PNG, JPG, WebP, GIF up to 5 MB • Free interactive preview
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                size="xl"
                loading={isProcessing && loadingSampleId === null}
                loadingText="Vectorizing..."
                onClick={() => inputRef.current?.click()}
              >
                <ImageUp className="size-4" />
                Choose Image File
              </Button>
              <Button
                variant="outline"
                size="xl"
                disabled={isProcessing}
                onClick={() => inputRef.current?.click()}
              >
                <ClipboardPaste className="size-4" />
                Paste with Ctrl + V
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Quick Sample Images
            </h2>
            <p className="text-sm text-muted-foreground">
              Test the dual-canvas comparison and wireframe loupe immediately.
            </p>
          </div>
          <Badge variant="outline">
            <Layers className="size-3.5" />3 Presets
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {SAMPLE_PRESETS.map((preset) => (
            <Card key={preset.id}>
              <CardHeader>
                <CardTitle>{preset.label}</CardTitle>
                <CardDescription>{preset.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  loading={loadingSampleId === preset.id}
                  loadingText="Vectorizing sample..."
                  disabled={isProcessing && loadingSampleId !== preset.id}
                  onClick={() => handleSampleClick(preset)}
                >
                  Vectorize this example
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
