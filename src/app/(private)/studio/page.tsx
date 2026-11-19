"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Check,
  Copy,
  Crown,
  Download,
  FileImage,
  ImagePlus,
  Loader2,
  Sparkles,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import apiClient from "@/lib/api-client";

type TraceMode = "auto" | "color" | "binary";
type CanvasBg = "white" | "dark" | "checker";

interface VectorizeStats {
  mode: string;
  width: number;
  height: number;
  regions: number;
  paths: number;
  bytes: number;
  duration_ms?: number;
}

interface QuotaInfo {
  unlimited: boolean;
  remainingCredits: number | null;
}

interface VectorizeApiResponse {
  success: boolean;
  message: string;
  data: {
    svg: string;
    stats: VectorizeStats;
    quota?: QuotaInfo;
  };
}

export default function StudioPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<TraceMode>("auto");
  const [transparentBg, setTransparentBg] = useState<boolean>(false);
  const [canvasBg, setCanvasBg] = useState<CanvasBg>("white");
  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [svgOutput, setSvgOutput] = useState<string | null>(null);
  const [stats, setStats] = useState<VectorizeStats | null>(null);
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const svgDataUrl = useMemo(() => {
    if (!svgOutput) return null;
    const blob = new Blob([svgOutput], { type: "image/svg+xml;charset=utf-8" });
    return URL.createObjectURL(blob);
  }, [svgOutput]);

  const handleFileSelect = useCallback((selected: File | null) => {
    if (!selected) return;
    setError(null);
    setSvgOutput(null);
    setStats(null);
    setFile(selected);
    setOriginalUrl(URL.createObjectURL(selected));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) handleFileSelect(dropped);
    },
    [handleFileSelect],
  );

  const handleVectorize = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("mode", mode);
      formData.append("includeBg", transparentBg ? "false" : "true");

      const res = await apiClient<VectorizeApiResponse>("/vectorize", {
        method: "POST",
        body: formData,
      });

      setSvgOutput(res.data.svg);
      setStats(res.data.stats);
      if (res.data.quota) {
        setQuota(res.data.quota);
      }
    } catch (err: unknown) {
      const anyErr = err as { data?: { message?: string }; message?: string };
      const msg =
        anyErr?.data?.message ||
        anyErr?.message ||
        "Vectorization failed. Please check that the engine service is running.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [file, mode, transparentBg]);

  const handleDownloadSvg = useCallback(() => {
    if (!svgOutput) return;
    const blob = new Blob([svgOutput], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const baseName = file?.name?.replace(/\.[^.]+$/, "") || "vectorized";
    a.href = url;
    a.download = `${baseName}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [svgOutput, file]);

  const handleDownloadPng4x = useCallback(() => {
    if (!svgOutput || !stats) return;
    const scale = 4;
    const img = new Image();
    const blob = new Blob([svgOutput], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = stats.width * scale;
      canvas.height = stats.height * scale;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((pngBlob) => {
          if (!pngBlob) return;
          const pngUrl = URL.createObjectURL(pngBlob);
          const a = document.createElement("a");
          const baseName = file?.name?.replace(/\.[^.]+$/, "") || "vectorized";
          a.href = pngUrl;
          a.download = `${baseName}-4x.png`;
          a.click();
          URL.revokeObjectURL(pngUrl);
        }, "image/png");
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [svgOutput, stats, file]);

  const handleCopy = useCallback(async () => {
    if (!svgOutput) return;
    await navigator.clipboard.writeText(svgOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [svgOutput]);

  const previewBgClass =
    canvasBg === "dark"
      ? "bg-[#2b2e33]"
      : canvasBg === "checker"
        ? "bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#ffffff_0%_50%)] bg-[length:16px_16px]"
        : "bg-white";

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">Vector Studio</h1>
            <Badge variant="secondary">Shared-Edge Bezier v2</Badge>
            {quota &&
              (quota.unlimited ? (
                <Badge variant="default" className="gap-1">
                  <Crown className="size-3" /> Pro Unlimited
                </Badge>
              ) : quota.remainingCredits !== null ? (
                <Badge variant="outline">
                  Credits Left: {quota.remainingCredits}
                </Badge>
              ) : null)}
          </div>
          <p className="text-muted-foreground text-sm">
            1× pure-pixel color separation &amp; sub-pixel unmixing — clean, halo-free SVG curves.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="default"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <Upload className="mr-1.5 size-4" />
            {file ? "Change Image" : "Upload Image"}
          </Button>
          <Button size="default" onClick={handleVectorize} disabled={!file || loading}>
            {loading ? (
              <Loader2 className="mr-1.5 size-4 animate-spin" />
            ) : (
              <Sparkles className="mr-1.5 size-4" />
            )}
            {loading ? "Vectorizing..." : "Vectorize"}
          </Button>
          {svgOutput && (
            <>
              <Button variant="outline" size="default" onClick={handleCopy}>
                {copied ? (
                  <Check className="mr-1.5 size-4 text-dot-max" />
                ) : (
                  <Copy className="mr-1.5 size-4" />
                )}
                {copied ? "Copied" : "Copy SVG"}
              </Button>
              <Button variant="outline" size="default" onClick={handleDownloadPng4x}>
                <FileImage className="mr-1.5 size-4" />
                PNG (4×)
              </Button>
              <Button size="default" variant="default" onClick={handleDownloadSvg}>
                <Download className="mr-1.5 size-4" />
                Download SVG
              </Button>
            </>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/bmp,image/tiff"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
      />

      {/* Controls Bar */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium uppercase">Mode:</span>
            {(["auto", "color", "binary"] as TraceMode[]).map((m) => (
              <Button
                key={m}
                size="default"
                variant={mode === m ? "default" : "outline"}
                onClick={() => setMode(m)}
                disabled={loading}
              >
                {m === "auto" ? "Auto" : m === "color" ? "Flat Color" : "B&W Outline"}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="transparent-bg"
              checked={transparentBg}
              onCheckedChange={setTransparentBg}
              disabled={loading}
            />
            <Label htmlFor="transparent-bg" className="cursor-pointer text-sm">
              Transparent SVG background
            </Label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground mr-1 text-xs font-medium uppercase">
                Canvas:
              </span>
              {(["white", "dark", "checker"] as CanvasBg[]).map((bg) => (
                <Button
                  key={bg}
                  size="default"
                  variant={canvasBg === bg ? "secondary" : "ghost"}
                  onClick={() => setCanvasBg(bg)}
                >
                  {bg === "white" ? "White" : bg === "dark" ? "Dark" : "Grid"}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setZoom((z) => Math.max(1, z / 2))}
                disabled={zoom <= 1}
              >
                <ZoomOut className="size-4" />
              </Button>
              <span className="w-12 text-center text-xs font-medium">{zoom * 100}%</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setZoom((z) => Math.min(4, z * 2))}
                disabled={zoom >= 4}
              >
                <ZoomIn className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
          {error.toLowerCase().includes("credit") && (
            <Button size="default" variant="default" render={<Link href="/plans" />}>
              <span>Upgrade to Pro</span>
            </Button>
          )}
        </div>
      )}

      {/* Stats Strip */}
      {stats && (
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <Badge variant="outline">Mode: {stats.mode}</Badge>
          <Badge variant="outline">
            Size: {stats.width} × {stats.height}px
          </Badge>
          <Badge variant="outline">Regions: {stats.regions}</Badge>
          <Badge variant="outline">Paths: {stats.paths}</Badge>
          <Badge variant="outline">SVG: {(stats.bytes / 1024).toFixed(1)} KB</Badge>
          {stats.duration_ms !== undefined && (
            <Badge variant="outline">Time: {(stats.duration_ms / 1000).toFixed(2)}s</Badge>
          )}
        </div>
      )}

      {/* Upload Dropzone or Side-by-Side Comparison */}
      {!originalUrl ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex min-h-95 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/60"
          }`}
        >
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
            <ImagePlus className="size-7 text-muted-foreground" />
          </div>
          <p className="text-base font-medium">Drop a raster image here, or click to browse</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Supports PNG, JPG, WebP, GIF, BMP, TIFF (up to 5 MB)
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">
                Original Raster {file ? `(${file.name})` : ""}
              </CardTitle>
            </CardHeader>
            <CardContent className={`h-115 overflow-auto p-4 ${previewBgClass}`}>
              <div className="flex min-h-full items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalUrl}
                  alt="Original raster"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "center",
                    imageRendering: zoom > 1 ? "pixelated" : "auto",
                  }}
                  className="max-h-105 max-w-full object-contain transition-transform"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Vectorized SVG Output</CardTitle>
            </CardHeader>
            <CardContent className={`h-115 overflow-auto p-4 ${previewBgClass}`}>
              <div className="flex min-h-full items-center justify-center">
                {loading ? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="size-8 animate-spin" />
                    <span className="text-sm">Separating colors &amp; fitting Bezier curves...</span>
                  </div>
                ) : svgDataUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={svgDataUrl}
                    alt="Vectorized SVG"
                    style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
                    className="max-h-105 max-w-full object-contain transition-transform"
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Click <strong>Vectorize</strong> to generate your SVG.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageWrapper>
  );
}
