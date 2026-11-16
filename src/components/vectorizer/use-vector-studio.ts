"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";
import {
  DEFAULT_VECTOR_SETTINGS,
  downloadVectorFile,
  type ExportFormat,
  getVectorPreview,
  loginAccount,
  reprocessVectorJob,
  uploadAndProcessImage,
  VectorizerDownloadError,
  type VectorJobMetadata,
  type VectorPreviewData,
  type VectorSettings,
} from "@/lib/vectorizer-api";
import type { CameraState, ViewMode } from "./types";

export const MAX_ZOOM_SCALE = 64;

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export interface PendingExportRequest {
  format: ExportFormat;
  scale: 1 | 2 | 4;
}

export function useVectorStudio() {
  const queryClient = useQueryClient();

  const [job, setJob] = React.useState<VectorJobMetadata | null>(null);
  const [preview, setPreview] = React.useState<VectorPreviewData | null>(null);
  const [settings, setSettings] = React.useState<VectorSettings>(
    DEFAULT_VECTOR_SETTINGS,
  );

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isReprocessing, setIsReprocessing] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const [viewMode, setViewMode] = React.useState<ViewMode>("split");
  const [loupeEnabled, setLoupeEnabled] = React.useState(true);
  const [fullWireframe, setFullWireframe] = React.useState(false);

  const [stageSize, setStageSize] = React.useState({ width: 900, height: 560 });
  const [camera, setCamera] = React.useState<CameraState>({
    scale: 1,
    dx: 0,
    dy: 0,
  });

  const [downloadModal, setDownloadModal] = React.useState<
    "AUTH_REQUIRED" | "INSUFFICIENT_CREDITS" | null
  >(null);
  const [pendingExport, setPendingExport] =
    React.useState<PendingExportRequest>({ format: "svg", scale: 2 });
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const paneWidth =
    viewMode === "split" ? Math.max(1, stageSize.width / 2) : stageSize.width;
  const paneHeight = Math.max(1, stageSize.height);

  const computeFitCamera = React.useCallback(
    (
      imgW: number,
      imgH: number,
      pWidth: number,
      pHeight: number,
    ): CameraState => {
      const pad = 32;
      const availW = Math.max(1, pWidth - pad);
      const availH = Math.max(1, pHeight - pad);
      const fitScale = clamp(
        Math.min(availW / imgW, availH / imgH),
        0.1,
        MAX_ZOOM_SCALE,
      );
      return {
        scale: fitScale,
        dx: (pWidth - imgW * fitScale) / 2,
        dy: (pHeight - imgH * fitScale) / 2,
      };
    },
    [],
  );

  const fitScale = React.useMemo(() => {
    if (!preview) return 1;
    const pad = 32;
    return clamp(
      Math.min(
        Math.max(1, paneWidth - pad) / preview.width,
        Math.max(1, paneHeight - pad) / preview.height,
      ),
      0.1,
      1,
    );
  }, [paneHeight, paneWidth, preview]);

  const minScale = Math.min(1, fitScale);

  const zoomToFit = React.useCallback(() => {
    if (!preview) return;
    setCamera(
      computeFitCamera(preview.width, preview.height, paneWidth, paneHeight),
    );
  }, [computeFitCamera, paneHeight, paneWidth, preview]);

  const zoom1To1 = React.useCallback(() => {
    if (!preview) return;
    setCamera({
      scale: 1,
      dx: (paneWidth - preview.width) / 2,
      dy: (paneHeight - preview.height) / 2,
    });
  }, [paneHeight, paneWidth, preview]);

  const zoomBy = (factor: number) => {
    const cx = paneWidth / 2;
    const cy = paneHeight / 2;
    setCamera((prev) => {
      const nextScale = clamp(prev.scale * factor, minScale, MAX_ZOOM_SCALE);
      const ratio = nextScale / prev.scale;
      return {
        scale: nextScale,
        dx: cx - (cx - prev.dx) * ratio,
        dy: cy - (cy - prev.dy) * ratio,
      };
    });
  };

  const sliderValue = React.useMemo(() => {
    const span = Math.log(MAX_ZOOM_SCALE / minScale);
    if (span <= 0) return 0;
    return clamp((100 * Math.log(camera.scale / minScale)) / span, 0, 100);
  }, [camera.scale, minScale]);

  const handleSliderZoom = (val: number | readonly number[]) => {
    const nextPct = Array.isArray(val) ? val[0] : val;
    const nextScale = clamp(
      minScale * Math.pow(MAX_ZOOM_SCALE / minScale, nextPct / 100),
      minScale,
      MAX_ZOOM_SCALE,
    );
    const cx = paneWidth / 2;
    const cy = paneHeight / 2;
    setCamera((prev) => {
      const ratio = nextScale / prev.scale;
      return {
        scale: nextScale,
        dx: cx - (cx - prev.dx) * ratio,
        dy: cy - (cy - prev.dy) * ratio,
      };
    });
  };

  const handleFileSelected = async (file: File) => {
    setIsProcessing(true);
    try {
      const createdJob = await uploadAndProcessImage(file, settings);
      const previewRes = await getVectorPreview(createdJob.id);

      setJob({
        ...createdJob,
        engine: previewRes.engine ?? createdJob.engine,
      });
      setPreview(previewRes.preview);
      setSettings(createdJob.settings);

      const initialPaneW =
        viewMode === "split"
          ? Math.max(1, stageSize.width / 2)
          : stageSize.width;
      setCamera(
        computeFitCamera(
          previewRes.preview.width,
          previewRes.preview.height,
          initialPaneW,
          stageSize.height,
        ),
      );

      successToast(
        "Vectorized successfully",
        `${previewRes.preview.pathCount} paths traced in ${createdJob.processingMs ?? 0} ms`,
      );
    } catch (error: unknown) {
      errorToast(
        "Vectorization failed",
        getErrorMessage(error, "Could not process the uploaded image."),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReprocess = async () => {
    if (!job) return;
    setIsReprocessing(true);
    try {
      const updated = await reprocessVectorJob(job.id, settings);
      setJob(updated);
      setPreview(updated.preview);
      successToast(
        "Re-vectorized",
        `${updated.preview.pathCount} paths updated in ${updated.processingMs ?? 0} ms`,
      );
    } catch (error: unknown) {
      errorToast(
        "Reprocess failed",
        getErrorMessage(error, "Could not re-vectorize this image."),
      );
    } finally {
      setIsReprocessing(false);
    }
  };

  const handleExport = async (
    format: ExportFormat,
    scale: 1 | 2 | 4 = 2,
  ) => {
    if (!job) return;
    setPendingExport({ format, scale });
    setIsDownloading(true);
    try {
      await downloadVectorFile(job.id, {
        format,
        scale,
        suggestedName: job.originalName,
      });
      await queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      const label =
        format === "png" ? `PNG (${scale}×)` : format.toUpperCase();
      successToast("Export complete", `${label} downloaded successfully.`);
    } catch (error: unknown) {
      if (error instanceof VectorizerDownloadError) {
        if (
          error.reason === "AUTH_REQUIRED" ||
          error.reason === "INSUFFICIENT_CREDITS"
        ) {
          setDownloadModal(error.reason);
          return;
        }
      }
      errorToast(
        "Export failed",
        getErrorMessage(error, `Unable to export ${format.toUpperCase()}.`),
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleLoginAndRetryDownload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loginEmail || !loginPassword) return;

    setIsLoggingIn(true);
    try {
      await loginAccount(loginEmail, loginPassword);
      await queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      setDownloadModal(null);
      successToast(
        "Signed in",
        `Exporting ${pendingExport.format.toUpperCase()}...`,
      );
      await handleExport(pendingExport.format, pendingExport.scale);
    } catch (error: unknown) {
      errorToast(
        "Sign in failed",
        getErrorMessage(error, "Invalid email or password."),
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const resetStudio = () => {
    setJob(null);
    setPreview(null);
  };

  return {
    job,
    preview,
    settings,
    setSettings,
    isProcessing,
    isReprocessing,
    isDownloading,
    viewMode,
    setViewMode,
    loupeEnabled,
    setLoupeEnabled,
    fullWireframe,
    setFullWireframe,
    camera,
    setCamera,
    minScale,
    sliderValue,
    setStageSize,
    zoomToFit,
    zoom1To1,
    zoomBy,
    handleSliderZoom,
    handleFileSelected,
    handleReprocess,
    handleExport,
    downloadModal,
    setDownloadModal,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    isLoggingIn,
    handleLoginAndRetryDownload,
    resetStudio,
  };
}
