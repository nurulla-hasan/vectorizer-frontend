"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  downloadVectorFile,
  type ExportOptions,
  getVectorPreview,
  importImageFromUrl,
  reprocessVectorJob,
  saveSvgEdits,
  uploadAndProcessImage,
  type VectorSettings,
} from "../api/vectorizer.api";
import { AUTH_ME_QUERY_KEY } from "./auth.hook";

export const vectorizerKeys = {
  all: ["vectorizer"] as const,
  preview: (jobId: string) => ["vectorizer", "preview", jobId] as const,
};

/**
 * Fetch traced SVG preview data for a processed vectorization job.
 */
export function useVectorPreview(jobId: string | null | undefined) {
  return useQuery({
    queryKey: vectorizerKeys.preview(jobId ?? ""),
    queryFn: () => getVectorPreview(jobId as string),
    enabled: Boolean(jobId),
    retry: false,
  });
}

/**
 * Upload a raster image and run vectorization.
 */
export function useProcessImage() {
  return useMutation({
    mutationFn: ({
      file,
      settings,
    }: {
      file: File;
      settings?: Partial<VectorSettings>;
    }) => uploadAndProcessImage(file, settings),
  });
}

/**
 * Download a remote image by URL and run vectorization on it.
 */
export function useImportImageFromUrl() {
  return useMutation({
    mutationFn: ({
      url,
      settings,
    }: {
      url: string;
      settings?: Partial<VectorSettings>;
    }) => importImageFromUrl(url, settings),
  });
}

/**
 * Re-run vectorization on an existing job with updated tuning settings.
 */
export function useReprocessVectorJob() {
  return useMutation({
    mutationFn: ({
      jobId,
      settings,
    }: {
      jobId: string;
      settings: Partial<VectorSettings>;
    }) => reprocessVectorJob(jobId, settings),
  });
}

/**
 * Persist manual SVG path edits for a vectorization job.
 */
export function useSaveSvgEdits() {
  return useMutation({
    mutationFn: ({ jobId, svg }: { jobId: string; svg: string }) =>
      saveSvgEdits(jobId, svg),
  });
}

/**
 * Export a vectorized artwork file and refresh user credits on completion.
 */
export function useDownloadVectorFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      options,
    }: {
      jobId: string;
      options?: ExportOptions;
    }) => downloadVectorFile(jobId, options),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });
}
