import { API_BASE_URL, apiClient } from "@/lib/api-client";

export type VectorMode = "spline" | "polygon" | "pixel";
export type VectorHierarchical = "stacked" | "cutout";
export type VectorEngine =
  | "tracecraft-ai"
  | "ai-vtracer-native"
  | "ai-potrace-bezier"
  | "vtracer-native"
  | "subpixel-bezier"
  | "potrace-bezier"
  | "imagetracerjs";
export type ExportFormat = "svg" | "png" | "pdf" | "eps" | "dxf";
export type VectorExportPreset = "general" | "editing" | "cutting";

export const EXPORT_PRESET_LABELS: Record<
  VectorExportPreset,
  { label: string; description: string }
> = {
  general: {
    label: "General use",
    description: "Filled shapes with gap filler for screen and web",
  },
  editing: {
    label: "Editing",
    description: "Filled shapes without gap filler for design tools",
  },
  cutting: {
    label: "Cutting",
    description: "Open outlines for CNC, laser, and plotting",
  },
};

export interface VectorSettings {
  maxColors: number;
  filterSpeckle: number;
  mode: VectorMode;
  hierarchical: VectorHierarchical;
  removeBackground: boolean;
  backgroundTolerance: number;
}

export const DEFAULT_VECTOR_SETTINGS: VectorSettings = {
  maxColors: 24,
  filterSpeckle: 12,
  mode: "spline",
  hierarchical: "cutout",
  removeBackground: false,
  backgroundTolerance: 64,
};

export interface VectorJobMetadata {
  id: string;
  originalName: string;
  width: number;
  height: number;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  settings: VectorSettings;
  processingMs: number | null;
  engine?: VectorEngine;
  createdAt?: string;
}

export interface VectorPathItem {
  id: string;
  fill: string;
  fillRule?: "nonzero" | "evenodd";
  d: string;
  transform?: string;
}

export interface VectorPreviewData {
  viewBox: string;
  width: number;
  height: number;
  pathCount: number;
  palette: string[];
  paths: VectorPathItem[];
  svg: string;
}

export interface VectorPreviewResponse {
  id: string;
  width: number;
  height: number;
  processingMs: number | null;
  engine?: VectorEngine;
  settings: VectorSettings;
  preview: VectorPreviewData;
}

export interface ReprocessVectorResponse extends VectorJobMetadata {
  preview: VectorPreviewData;
}

interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export type DownloadErrorReason =
  | "AUTH_REQUIRED"
  | "INSUFFICIENT_CREDITS"
  | "FAILED";

export class TraceCraftDownloadError extends Error {
  readonly reason: DownloadErrorReason;
  readonly statusCode: number;

  constructor(reason: DownloadErrorReason, message: string, statusCode: number) {
    super(message);
    this.name = "TraceCraftDownloadError";
    this.reason = reason;
    this.statusCode = statusCode;
  }
}

export async function uploadAndProcessImage(
  file: File,
  settings: Partial<VectorSettings> = {},
): Promise<VectorJobMetadata> {
  const formData = new FormData();
  formData.append("image", file);

  const merged = { ...DEFAULT_VECTOR_SETTINGS, ...settings };
  formData.append("maxColors", String(merged.maxColors));
  formData.append("filterSpeckle", String(merged.filterSpeckle));
  formData.append("mode", merged.mode);
  formData.append("hierarchical", merged.hierarchical);
  formData.append("removeBackground", String(merged.removeBackground));
  formData.append("backgroundTolerance", String(merged.backgroundTolerance));

  const response = await apiClient<ApiEnvelope<VectorJobMetadata>>(
    "/tracecraft/process",
    {
      method: "POST",
      body: formData,
    },
  );

  return response.data;
}

export async function importImageFromUrl(
  url: string,
  settings: Partial<VectorSettings> = {},
): Promise<VectorJobMetadata> {
  const response = await apiClient<ApiEnvelope<VectorJobMetadata>>(
    "/tracecraft/import-url",
    {
      method: "POST",
      body: { url, ...settings },
    },
  );

  return response.data;
}

export async function reprocessVectorJob(
  jobId: string,
  settings: Partial<VectorSettings>,
): Promise<ReprocessVectorResponse> {
  const response = await apiClient<ApiEnvelope<ReprocessVectorResponse>>(
    `/tracecraft/${jobId}/reprocess`,
    {
      method: "POST",
      body: settings,
    },
  );

  return response.data;
}

export function getOriginalImageUrl(jobId: string): string {
  return `${API_BASE_URL}/tracecraft/${jobId}/original`;
}

export async function getVectorPreview(
  jobId: string,
): Promise<VectorPreviewResponse> {
  const response = await apiClient<ApiEnvelope<VectorPreviewResponse>>(
    `/tracecraft/${jobId}/preview`,
  );

  return response.data;
}

export async function saveSvgEdits(
  jobId: string,
  svg: string,
): Promise<void> {
  await apiClient(`/tracecraft/${jobId}/svg`, {
    method: "PUT",
    body: { svg },
  });
}

export interface ExportOptions {
  format?: ExportFormat;
  scale?: 1 | 2 | 4;
  suggestedName?: string;
  preset?: VectorExportPreset;
}

export async function downloadVectorFile(
  jobId: string,
  options: ExportOptions = {},
): Promise<void> {
  const format = options.format ?? "svg";
  const scale = options.scale ?? 2;
  const preset = options.preset ?? "general";
  const baseSuggested = (options.suggestedName || "vectorized").replace(
    /\.[^.]+$/,
    "",
  );
  const fallbackName =
    format === "png"
      ? `${baseSuggested}-${scale}x.png`
      : `${baseSuggested}.${format}`;

  const params = new URLSearchParams({
    format,
    scale: String(scale),
    preset,
  });

  const response = await fetch(
    `${API_BASE_URL}/tracecraft/${jobId}/download?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    let serverMessage = `Unable to export ${format.toUpperCase()}.`;
    let errorCode: string | undefined;
    try {
      const json = (await response.json()) as {
        message?: string;
        error?: { code?: string; message?: string };
      };
      if (json?.message) serverMessage = json.message;
      errorCode = json?.error?.code;
    } catch {
      // Ignore non-JSON error bodies
    }

    if (response.status === 401) {
      throw new TraceCraftDownloadError(
        "AUTH_REQUIRED",
        serverMessage,
        response.status,
      );
    }

    if (
      response.status === 403 &&
      (errorCode === "INSUFFICIENT_CREDITS" ||
        serverMessage.toLowerCase().includes("credit"))
    ) {
      throw new TraceCraftDownloadError(
        "INSUFFICIENT_CREDITS",
        serverMessage,
        response.status,
      );
    }

    throw new TraceCraftDownloadError(
      "FAILED",
      serverMessage,
      response.status,
    );
  }

  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") ?? "";
  const filenameMatch = disposition.match(/filename="?([^"]+)"?/i);
  const filename = filenameMatch?.[1] || fallbackName;

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

export async function downloadSvg(
  jobId: string,
  suggestedName = "vectorized.svg",
): Promise<void> {
  return downloadVectorFile(jobId, { format: "svg", suggestedName });
}
