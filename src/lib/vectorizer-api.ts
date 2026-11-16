import { API_BASE_URL, apiClient } from "@/lib/api-client";

export type VectorMode = "spline" | "polygon" | "pixel";
export type VectorHierarchical = "stacked" | "cutout";
export type VectorEngine = "vtracer-native" | "potrace-bezier" | "imagetracerjs";
export type ExportFormat = "svg" | "png" | "pdf";

export interface VectorSettings {
  colorPrecision: number;
  maxColors: number;
  filterSpeckle: number;
  cornerThreshold: number;
  mode: VectorMode;
  hierarchical: VectorHierarchical;
}

export const DEFAULT_VECTOR_SETTINGS: VectorSettings = {
  colorPrecision: 6,
  maxColors: 6,
  filterSpeckle: 12,
  cornerThreshold: 70,
  mode: "spline",
  hierarchical: "stacked",
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

export class VectorizerDownloadError extends Error {
  readonly reason: DownloadErrorReason;
  readonly statusCode: number;

  constructor(reason: DownloadErrorReason, message: string, statusCode: number) {
    super(message);
    this.name = "VectorizerDownloadError";
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
  formData.append("colorPrecision", String(merged.colorPrecision));
  formData.append("maxColors", String(merged.maxColors));
  formData.append("filterSpeckle", String(merged.filterSpeckle));
  formData.append("cornerThreshold", String(merged.cornerThreshold));
  formData.append("mode", merged.mode);
  formData.append("hierarchical", merged.hierarchical);

  const response = await apiClient<ApiEnvelope<VectorJobMetadata>>(
    "/vectorizer/process",
    {
      method: "POST",
      body: formData,
    },
  );

  return response.data;
}

export async function reprocessVectorJob(
  jobId: string,
  settings: Partial<VectorSettings>,
): Promise<ReprocessVectorResponse> {
  const response = await apiClient<ApiEnvelope<ReprocessVectorResponse>>(
    `/vectorizer/${jobId}/reprocess`,
    {
      method: "POST",
      body: settings,
    },
  );

  return response.data;
}

export function getOriginalImageUrl(jobId: string): string {
  return `${API_BASE_URL}/vectorizer/${jobId}/original`;
}

export async function getVectorPreview(
  jobId: string,
): Promise<VectorPreviewResponse> {
  const response = await apiClient<ApiEnvelope<VectorPreviewResponse>>(
    `/vectorizer/${jobId}/preview`,
  );

  return response.data;
}

export interface ExportOptions {
  format?: ExportFormat;
  scale?: 1 | 2 | 4;
  suggestedName?: string;
}

export async function downloadVectorFile(
  jobId: string,
  options: ExportOptions = {},
): Promise<void> {
  const format = options.format ?? "svg";
  const scale = options.scale ?? 2;
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
  });

  const response = await fetch(
    `${API_BASE_URL}/vectorizer/${jobId}/download?${params.toString()}`,
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
      throw new VectorizerDownloadError(
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
      throw new VectorizerDownloadError(
        "INSUFFICIENT_CREDITS",
        serverMessage,
        response.status,
      );
    }

    throw new VectorizerDownloadError(
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

export async function loginAccount(
  email: string,
  password: string,
): Promise<void> {
  await apiClient("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}
