"use client";

import JSZip from "jszip";
import {
  Check,
  Download,
  FileArchive,
  ImagePlus,
  Layers,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type PaddingMode = "auto" | "white" | "transparent";

interface ShiftSpec {
  filename: string;
  dx: number;
  dy: number;
}

interface DetectedPixel {
  r: number;
  g: number;
  b: number;
  a: number;
  isTransparent: boolean;
  hex: string;
}

interface SourceImageInfo {
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
  element: HTMLImageElement;
  detectedCorner: DetectedPixel;
}

const CANVAS_PADDING = 50;

const SHIFT_MATRIX: readonly ShiftSpec[] = [
  { filename: "v1.png", dx: 0, dy: 0 },
  { filename: "v2.png", dx: 0, dy: 20 },
  { filename: "v3.png", dx: 0, dy: 40 },
  { filename: "v4.png", dx: 35, dy: 15 },
  { filename: "v5.png", dx: 35, dy: 45 },
] as const;

const ACCEPTED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);

function toHexByte(value: number): string {
  return value.toString(16).padStart(2, "0");
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function sampleTopLeftPixel(img: HTMLImageElement): DetectedPixel {
  const probeCanvas = document.createElement("canvas");
  probeCanvas.width = 1;
  probeCanvas.height = 1;
  const ctx = probeCanvas.getContext("2d");
  if (!ctx) {
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
      isTransparent: true,
      hex: "transparent",
    };
  }
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, 1, 1, 0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  const isTransparent = a < 255;
  const hex =
    a === 0
      ? "transparent"
      : `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;

  return { r, g, b, a, isTransparent, hex };
}

function renderShiftedCanvas(
  canvas: HTMLCanvasElement,
  source: SourceImageInfo,
  shift: ShiftSpec,
  fillColor: string | null,
): void {
  const outWidth = source.width + CANVAS_PADDING;
  const outHeight = source.height + CANVAS_PADDING;

  if (canvas.width !== outWidth) canvas.width = outWidth;
  if (canvas.height !== outHeight) canvas.height = outHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, outWidth, outHeight);

  if (fillColor !== null) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, outWidth, outHeight);
  }

  ctx.drawImage(source.element, shift.dx, shift.dy, source.width, source.height);
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to encode canvas to PNG"));
      }
    }, "image/png");
  });
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ImageShifter() {
  const [source, setSource] = useState<SourceImageInfo | null>(null);
  const [paddingMode, setPaddingMode] = useState<PaddingMode>("auto");
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [batchStatus, setBatchStatus] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [downloadedCard, setDownloadedCard] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewCanvasRefs = useRef<Record<string, HTMLCanvasElement | null>>(
    {},
  );

  const resolvedFillColor = useMemo<string | null>(() => {
    if (!source) return null;
    if (paddingMode === "white") return "#ffffff";
    if (paddingMode === "transparent") return null;
    if (source.detectedCorner.isTransparent) return null;
    return source.detectedCorner.hex;
  }, [source, paddingMode]);

  const resolvedFillLabel = useMemo(() => {
    if (!source) return "—";
    if (resolvedFillColor === null) return "Transparent (RGBA)";
    return `Solid ${resolvedFillColor}`;
  }, [source, resolvedFillColor]);

  const loadImageFile = useCallback((file: File) => {
    setErrorMsg(null);

    if (!ACCEPTED_MIME_TYPES.has(file.type)) {
      const msg = "Unsupported file type. Please upload a PNG, JPG, or WebP image.";
      setErrorMsg(msg);
      errorToast(msg);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const detectedCorner = sampleTopLeftPixel(img);
      setSource({
        fileName: file.name,
        fileSize: file.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
        element: img,
        detectedCorner,
      });
      setPaddingMode("auto");
      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const msg = "Could not decode the selected image. Please try another file.";
      setErrorMsg(msg);
      errorToast(msg);
    };

    img.src = objectUrl;
  }, []);

  useEffect(() => {
    if (!source) return;
    for (const shift of SHIFT_MATRIX) {
      const canvas = previewCanvasRefs.current[shift.filename];
      if (canvas) {
        renderShiftedCanvas(canvas, source, shift, resolvedFillColor);
      }
    }
  }, [source, resolvedFillColor]);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) {
        loadImageFile(file);
      }
    },
    [loadImageFile],
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        loadImageFile(file);
      }
      event.target.value = "";
    },
    [loadImageFile],
  );

  const generateOffscreenBlob = useCallback(
    async (shift: ShiftSpec): Promise<Blob> => {
      if (!source) {
        throw new Error("No source image loaded");
      }
      const offscreen = document.createElement("canvas");
      renderShiftedCanvas(offscreen, source, shift, resolvedFillColor);
      return canvasToPngBlob(offscreen);
    },
    [source, resolvedFillColor],
  );

  const handleDownloadSingle = useCallback(
    async (shift: ShiftSpec) => {
      if (!source) return;
      try {
        const blob = await generateOffscreenBlob(shift);
        triggerBlobDownload(blob, shift.filename);
        setDownloadedCard(shift.filename);
        window.setTimeout(() => {
          setDownloadedCard((prev) => (prev === shift.filename ? null : prev));
        }, 1500);
      } catch (err: unknown) {
        const msg = getErrorMessage(err, `Failed to export ${shift.filename}.`);
        setErrorMsg(msg);
        errorToast(msg);
      }
    },
    [source, generateOffscreenBlob],
  );

  const handleDownloadAllDirect = useCallback(async () => {
    if (!source || batchStatus !== null) return;
    try {
      for (let i = 0; i < SHIFT_MATRIX.length; i += 1) {
        const shift = SHIFT_MATRIX[i];
        setBatchStatus(`Downloading ${i + 1}/${SHIFT_MATRIX.length}...`);
        const blob = await generateOffscreenBlob(shift);
        triggerBlobDownload(blob, shift.filename);
        if (i < SHIFT_MATRIX.length - 1) {
          await new Promise((resolve) => window.setTimeout(resolve, 250));
        }
      }
      successToast("All 5 shifted PNGs queued for download.");
      setBatchStatus(null);
    } catch (err: unknown) {
      setBatchStatus(null);
      const msg = getErrorMessage(err, "Batch download failed while generating PNGs.");
      setErrorMsg(msg);
      errorToast(msg);
    }
  }, [source, batchStatus, generateOffscreenBlob]);

  const handleDownloadZip = useCallback(async () => {
    if (!source || isZipping) return;
    setIsZipping(true);
    setErrorMsg(null);
    try {
      const zip = new JSZip();

      for (const shift of SHIFT_MATRIX) {
        const blob = await generateOffscreenBlob(shift);
        zip.file(shift.filename, blob);
      }

      const metadata = {
        sourceFile: source.fileName,
        originalDimensions: {
          width: source.width,
          height: source.height,
        },
        outputDimensions: {
          width: source.width + CANVAS_PADDING,
          height: source.height + CANVAS_PADDING,
        },
        canvasPaddingPx: CANVAS_PADDING,
        paddingMode,
        resolvedFill: resolvedFillColor ?? "transparent",
        detectedTopLeftPixel: source.detectedCorner,
        variations: SHIFT_MATRIX.map((s) => ({
          filename: s.filename,
          dx: s.dx,
          dy: s.dy,
        })),
        generatedAt: new Date().toISOString(),
      };

      zip.file("shifts.json", JSON.stringify(metadata, null, 2));

      const zipBlob = await zip.generateAsync({ type: "blob" });
      triggerBlobDownload(zipBlob, "shifted_variations.zip");
      successToast("Downloaded shifted_variations.zip");
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Failed to build shifted_variations.zip.");
      setErrorMsg(msg);
      errorToast(msg);
    } finally {
      setIsZipping(false);
    }
  }, [source, isZipping, generateOffscreenBlob, paddingMode, resolvedFillColor]);

  const outputWidth = source ? source.width + CANVAS_PADDING : 0;
  const outputHeight = source ? source.height + CANVAS_PADDING : 0;

  return (
    <PageWrapper>
      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Badge variant="info">
            <Layers className="h-3.5 w-3.5" />
            <span>1:1 Lossless Pixel Shifter · +{CANVAS_PADDING}px Uniform Canvas</span>
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Raster Shift Matrix Generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Upload one raster image to generate 5 zero-interpolation, pixel-shifted PNG variations
            with uniform{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
              (W+{CANVAS_PADDING}) × (H+{CANVAS_PADDING})
            </code>{" "}
            bounds.
          </p>
        </div>

        {source && (
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={() => {
              setSource(null);
              setErrorMsg(null);
              setBatchStatus(null);
            }}
          >
            <Trash2 className="h-4 w-4" />
            Clear Image
          </Button>
        )}
      </header>

      {/* Error Banner */}
      {errorMsg && (
        <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMsg}
        </div>
      )}

      {/* Upload Dropzone */}
      {!source ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={cn(
            "group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-20 text-center transition-all",
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border bg-studio-surface hover:border-primary/50 hover:bg-muted/50",
          )}
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm transition group-hover:scale-105 group-hover:border-primary/40">
            <ImagePlus className="h-7 w-7" />
          </div>
          <p className="text-base font-medium text-foreground">
            Drag &amp; drop your source image here, or{" "}
            <span className="text-primary underline decoration-primary/40 underline-offset-4">
              browse files
            </span>
          </p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            Supports PNG, JPG, WebP · Processed 100% locally in your browser
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Control & Metadata Bar */}
          <Card>
            <CardContent className="grid gap-4 p-5 lg:grid-cols-12 lg:items-center">
              {/* Source Specs */}
              <div className="space-y-2 lg:col-span-5">
                <div className="flex items-center gap-2">
                  <span className="truncate font-mono text-sm font-medium text-foreground">
                    {source.fileName}
                  </span>
                  <Badge variant="secondary">{formatBytes(source.fileSize)}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <Badge variant="outline">
                    Original: {source.width} × {source.height}
                  </Badge>
                  <Badge variant="success">
                    Output: {outputWidth} × {outputHeight}
                  </Badge>
                  <Badge variant="outline">
                    <span
                      className="inline-block h-3 w-3 rounded-sm border border-border"
                      style={{
                        backgroundColor: source.detectedCorner.isTransparent
                          ? "transparent"
                          : source.detectedCorner.hex,
                        backgroundImage: source.detectedCorner.isTransparent
                          ? "linear-gradient(45deg, var(--studio-grid) 25%, transparent 25%), linear-gradient(-45deg, var(--studio-grid) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--studio-grid) 75%), linear-gradient(-45deg, transparent 75%, var(--studio-grid) 75%)"
                          : undefined,
                        backgroundSize: "6px 6px",
                      }}
                    />
                    (0,0):{" "}
                    {source.detectedCorner.isTransparent
                      ? `Transparent (α=${source.detectedCorner.a})`
                      : source.detectedCorner.hex}
                  </Badge>
                </div>
              </div>

              {/* Padding Toggle */}
              <div className="lg:col-span-4">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground">Padding Background</span>
                  <span className="font-mono text-muted-foreground">{resolvedFillLabel}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-muted p-1">
                  {(
                    [
                      { id: "auto", label: "Auto-Detect" },
                      { id: "white", label: "Solid #fff" },
                      { id: "transparent", label: "Transparent" },
                    ] as const
                  ).map((option) => {
                    const active = paddingMode === option.id;
                    return (
                      <Button
                        key={option.id}
                        type="button"
                        variant={active ? "default" : "ghost"}
                        size="default"
                        onClick={() => setPaddingMode(option.id)}
                        className="w-full"
                      >
                        {option.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Replace File Button */}
              <div className="flex justify-start lg:col-span-3 lg:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full lg:w-auto"
                >
                  <RefreshCw className="h-4 w-4" />
                  Replace Image
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Batch Action Bar */}
          <Card>
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>
                  Ready to export 5 lossless PNGs with{" "}
                  <code className="font-mono text-foreground">imageSmoothingEnabled = false</code>
                </span>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleDownloadZip}
                  loading={isZipping}
                  loadingText="Packing ZIP..."
                >
                  <FileArchive className="h-4 w-4" />
                  Download as ZIP
                </Button>

                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  onClick={handleDownloadAllDirect}
                  loading={batchStatus !== null}
                  loadingText={batchStatus ?? "Downloading..."}
                >
                  <Download className="h-4 w-4" />
                  Download All 5 PNGs Directly
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 5-Card Visual Preview Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {SHIFT_MATRIX.map((shift) => {
              const isDownloaded = downloadedCard === shift.filename;
              return (
                <Card key={shift.filename} className="flex flex-col overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-border px-3.5 py-2.5">
                    <span className="font-mono text-xs font-semibold text-foreground">
                      {shift.filename}
                    </span>
                    <Badge variant="success">
                      dx:{shift.dx}, dy:{shift.dy}
                    </Badge>
                  </CardHeader>

                  {/* Canvas Preview with Checkerboard */}
                  <CardContent
                    className="relative flex aspect-square items-center justify-center overflow-hidden p-3"
                    style={{
                      backgroundColor: "var(--studio-surface)",
                      backgroundImage:
                        "linear-gradient(45deg, var(--studio-grid) 25%, transparent 25%), linear-gradient(-45deg, var(--studio-grid) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--studio-grid) 75%), linear-gradient(-45deg, transparent 75%, var(--studio-grid) 75%)",
                      backgroundSize: "16px 16px",
                      backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
                    }}
                  >
                    <canvas
                      ref={(el) => {
                        previewCanvasRefs.current[shift.filename] = el;
                      }}
                      className="max-h-full max-w-full rounded border border-border object-contain shadow-sm"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </CardContent>

                  <CardFooter className="mt-auto flex items-center justify-between border-t border-border bg-studio-panel px-3.5 py-2.5">
                    <span className="font-mono text-xs text-muted-foreground">
                      {outputWidth} × {outputHeight}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      onClick={() => handleDownloadSingle(shift)}
                    >
                      {isDownloaded ? (
                        <>
                          <Check className="h-4 w-4 text-primary" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          <span>PNG</span>
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </PageWrapper>
  );
}
