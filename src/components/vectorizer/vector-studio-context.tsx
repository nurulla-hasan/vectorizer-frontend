"use client";

import * as React from "react";
import { getErrorMessage } from "@/lib/error";
import { applySvgEdits } from "@/lib/svg-path-edit";
import { errorToast, successToast } from "@/lib/toast";
import {
  DEFAULT_VECTOR_SETTINGS,
  type ExportFormat,
  getOriginalImageUrl,
  getVectorPreview,
  useDownloadVectorFile,
  useLogin,
  useProcessImage,
  useReprocessVectorJob,
  useSaveSvgEdits,
  VectorizerDownloadError,
  type VectorJobMetadata,
  type VectorPreviewData,
  type VectorSettings,
} from "@/services";
import type { CameraState, ViewMode } from "./types";

export const MAX_ZOOM_SCALE = 64;
// Loupe stays hidden until the zoom slider passes this percentage.
export const LOUPE_MIN_ZOOM_PERCENT = 35;

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export interface PendingExportRequest {
  format: ExportFormat;
  scale: 1 | 2 | 4;
}

export type VectorStudioContextValue = ReturnType<
  typeof useVectorStudioController
>;

const VectorStudioContext =
  React.createContext<VectorStudioContextValue | null>(null);

function useVectorStudioController() {
  const { mutateAsync: processImage } = useProcessImage();
  const { mutateAsync: reprocessJob } = useReprocessVectorJob();
  const { mutateAsync: saveEdits } = useSaveSvgEdits();
  const { mutateAsync: downloadFile } = useDownloadVectorFile();
  const { mutateAsync: login } = useLogin();

  const [job, setJob] = React.useState<VectorJobMetadata | null>(null);
  const [preview, setPreview] = React.useState<VectorPreviewData | null>(null);
  const [settings, setSettings] = React.useState<VectorSettings>(
    DEFAULT_VECTOR_SETTINGS,
  );

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processingStage, setProcessingStage] = React.useState<
    "process" | "preview" | null
  >(null);
  const processingTokenRef = React.useRef(0);
  const [isReprocessing, setIsReprocessing] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const [viewMode, setViewMode] = React.useState<ViewMode>("single");
  const [loupeEnabled, setLoupeEnabled] = React.useState(true);
  const [fullWireframe, setFullWireframe] = React.useState(false);

  const [editMode, setEditModeState] = React.useState(false);
  const [selectedPathId, setSelectedPathId] = React.useState<string | null>(
    null,
  );
  const [pathOverrides, setPathOverrides] = React.useState<
    Record<string, string>
  >({});
  const [deletedPathIds, setDeletedPathIds] = React.useState<string[]>([]);
  const [editHistory, setEditHistory] = React.useState<
    { pathId: string; d: string; wasDeleted: boolean }[]
  >([]);
  const [isSavingEdits, setIsSavingEdits] = React.useState(false);

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

  const paneWidth = Math.max(1, stageSize.width);
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

  const zoomBy = React.useCallback(
    (factor: number) => {
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
    },
    [minScale, paneHeight, paneWidth],
  );

  const sliderValue = React.useMemo(() => {
    const span = Math.log(MAX_ZOOM_SCALE / minScale);
    if (span <= 0) return 0;
    return clamp((100 * Math.log(camera.scale / minScale)) / span, 0, 100);
  }, [camera.scale, minScale]);

  const handleSliderZoom = React.useCallback(
    (val: number | readonly number[]) => {
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
    },
    [minScale, paneHeight, paneWidth],
  );

  const handleFileSelected = React.useCallback(
    async (file: File) => {
      const token = ++processingTokenRef.current;
      setIsProcessing(true);
      setProcessingStage("process");
      try {
        const createdJob = await processImage({ file, settings });
        if (processingTokenRef.current !== token) return;

        setProcessingStage("preview");
        const previewRes = await getVectorPreview(createdJob.id);
        if (processingTokenRef.current !== token) return;

        setJob({
          ...createdJob,
          engine: previewRes.engine ?? createdJob.engine,
        });
        setPreview(previewRes.preview);
        setSettings(createdJob.settings);
        setPathOverrides({});
        setDeletedPathIds([]);
        setEditHistory([]);
        setSelectedPathId(null);

        const initialPaneW = Math.max(1, stageSize.width);
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
        if (processingTokenRef.current === token) {
          errorToast(
            "Vectorization failed",
            getErrorMessage(error, "Could not process the uploaded image."),
          );
        }
      } finally {
        if (processingTokenRef.current === token) {
          setIsProcessing(false);
          setProcessingStage(null);
        }
      }
    },
    [computeFitCamera, processImage, settings, stageSize.height, stageSize.width],
  );

  const cancelProcessing = React.useCallback(() => {
    processingTokenRef.current += 1;
    setIsProcessing(false);
    setProcessingStage(null);
  }, []);

  const handleReprocess = React.useCallback(async () => {
    if (!job) return;
    setIsReprocessing(true);
    try {
      const updated = await reprocessJob({ jobId: job.id, settings });
      setJob(updated);
      setPreview(updated.preview);
      setPathOverrides({});
      setDeletedPathIds([]);
      setEditHistory([]);
      setSelectedPathId(null);
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
  }, [job, reprocessJob, settings]);

  const setEditMode = React.useCallback((next: boolean) => {
    setEditModeState(next);
    if (next) {
      setViewMode("single");
      setFullWireframe(false);
    } else {
      setSelectedPathId(null);
    }
  }, []);

  const getPathD = React.useCallback(
    (pathId: string): string => {
      const overridden = pathOverrides[pathId];
      if (overridden !== undefined) return overridden;
      return preview?.paths.find((item) => item.id === pathId)?.d ?? "";
    },
    [pathOverrides, preview],
  );

  const setPathD = React.useCallback(
    (pathId: string, d: string) => {
      const baseD = preview?.paths.find((item) => item.id === pathId)?.d;
      setPathOverrides((prev) => {
        const next = { ...prev };
        if (baseD !== undefined && d === baseD) {
          delete next[pathId];
        } else {
          next[pathId] = d;
        }
        return next;
      });
    },
    [preview],
  );

  const beginPathEdit = React.useCallback(
    (pathId: string) => {
      const current = getPathD(pathId);
      if (!current) return;
      setEditHistory((prev) => [
        ...prev.slice(-49),
        {
          pathId,
          d: current,
          wasDeleted: deletedPathIds.includes(pathId),
        },
      ]);
    },
    [deletedPathIds, getPathD],
  );

  const restoreDeleted = React.useCallback(
    (pathId: string, deleted: boolean) => {
      setDeletedPathIds((prev) => {
        const has = prev.includes(pathId);
        if (deleted === has) return prev;
        return deleted ? [...prev, pathId] : prev.filter((id) => id !== pathId);
      });
    },
    [],
  );

  const undoPathEdit = React.useCallback(() => {
    if (editHistory.length === 0) return;
    const last = editHistory[editHistory.length - 1];
    setEditHistory((prev) => prev.slice(0, -1));
    const baseD = preview?.paths.find((item) => item.id === last.pathId)?.d;
    setPathOverrides((prev) => {
      const next = { ...prev };
      if (baseD !== undefined && last.d === baseD) {
        delete next[last.pathId];
      } else {
        next[last.pathId] = last.d;
      }
      return next;
    });
    restoreDeleted(last.pathId, last.wasDeleted);
    if (last.wasDeleted) {
      setSelectedPathId((current) =>
        current === last.pathId ? null : current,
      );
    }
  }, [editHistory, preview, restoreDeleted]);

  const deletePath = React.useCallback(
    (pathId: string) => {
      const current = getPathD(pathId);
      if (!current) return;
      setEditHistory((prev) => [
        ...prev.slice(-49),
        {
          pathId,
          d: current,
          wasDeleted: deletedPathIds.includes(pathId),
        },
      ]);
      setDeletedPathIds((prev) =>
        prev.includes(pathId) ? prev : [...prev, pathId],
      );
      setSelectedPathId((currentId) =>
        currentId === pathId ? null : currentId,
      );
    },
    [deletedPathIds, getPathD],
  );

  const discardPathEdits = React.useCallback(() => {
    setPathOverrides({});
    setDeletedPathIds([]);
    setEditHistory([]);
    setSelectedPathId(null);
  }, []);

  const buildEditedSvg = React.useCallback(
    (
      overrides: Record<string, string>,
      deleted: readonly string[],
    ): string => {
      if (!preview) return "";
      return applySvgEdits(preview.svg, overrides, deleted);
    },
    [preview],
  );

  const hasUnsavedEdits =
    Object.keys(pathOverrides).length > 0 || deletedPathIds.length > 0;

  const savePathEdits = React.useCallback(async () => {
    if (!job || !preview || !hasUnsavedEdits) return;
    setIsSavingEdits(true);
    try {
      const editedSvg = buildEditedSvg(pathOverrides, deletedPathIds);
      await saveEdits({ jobId: job.id, svg: editedSvg });
      setPreview((prev) => {
        if (!prev) return prev;
        const deleted = new Set(deletedPathIds);
        // Re-index the surviving paths so their ids keep matching the
        // <path> element order of the newly saved SVG.
        const remaining = prev.paths
          .filter((item) => !deleted.has(item.id))
          .map((item, position) => ({
            ...item,
            id: `p_${position}`,
            d: pathOverrides[item.id] ?? item.d,
          }));
        return {
          ...prev,
          svg: editedSvg,
          paths: remaining,
          pathCount: remaining.length,
        };
      });
      setPathOverrides({});
      setDeletedPathIds([]);
      setEditHistory([]);
      setSelectedPathId(null);
      successToast(
        "Edits saved",
        "Your manual path fixes are stored in the vector file.",
      );
    } catch (error: unknown) {
      errorToast(
        "Save failed",
        getErrorMessage(error, "Could not save your path edits."),
      );
    } finally {
      setIsSavingEdits(false);
    }
  }, [
    buildEditedSvg,
    deletedPathIds,
    hasUnsavedEdits,
    job,
    pathOverrides,
    preview,
    saveEdits,
  ]);

  const handleExport = React.useCallback(
    async (format: ExportFormat, scale: 1 | 2 | 4 = 2) => {
      if (!job) return;
      setPendingExport({ format, scale });
      setIsDownloading(true);
      try {
        await downloadFile({
          jobId: job.id,
          options: {
            format,
            scale,
            suggestedName: job.originalName,
          },
        });
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
    },
    [downloadFile, job],
  );

  const handleLoginAndRetryDownload = React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!loginEmail || !loginPassword) return;

      setIsLoggingIn(true);
      try {
        await login({ email: loginEmail, password: loginPassword });
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
    },
    [handleExport, login, loginEmail, loginPassword, pendingExport],
  );

  const resetStudio = React.useCallback(() => {
    setJob(null);
    setPreview(null);
    setEditModeState(false);
    setSelectedPathId(null);
    setPathOverrides({});
    setDeletedPathIds([]);
    setEditHistory([]);
  }, []);

  const originalUrl = job ? getOriginalImageUrl(job.id) : "";

  return {
    job,
    preview,
    originalUrl,
    settings,
    setSettings,
    isProcessing,
    processingStage,
    cancelProcessing,
    isReprocessing,
    isDownloading,
    viewMode,
    setViewMode,
    loupeEnabled,
    setLoupeEnabled,
    fullWireframe,
    setFullWireframe,
    editMode,
    setEditMode,
    selectedPathId,
    setSelectedPathId,
    pathOverrides,
    deletedPathIds,
    getPathD,
    setPathD,
    beginPathEdit,
    deletePath,
    undoPathEdit,
    discardPathEdits,
    savePathEdits,
    hasUnsavedEdits,
    canUndoPathEdit: editHistory.length > 0,
    isSavingEdits,
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

export function VectorStudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useVectorStudioController();
  return (
    <VectorStudioContext.Provider value={value}>
      {children}
    </VectorStudioContext.Provider>
  );
}

export function useVectorStudio(): VectorStudioContextValue {
  const ctx = React.useContext(VectorStudioContext);
  if (!ctx) {
    throw new Error(
      "useVectorStudio must be used inside a VectorStudioProvider",
    );
  }
  return ctx;
}
