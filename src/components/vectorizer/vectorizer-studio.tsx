"use client";

import { getOriginalImageUrl } from "@/lib/vectorizer-api";
import { ComparisonStage } from "./comparison-stage";
import { ExportAuthDialog } from "./export-auth-dialog";
import { HeroDropzone } from "./hero-dropzone";
import { StudioToolbar } from "./studio-toolbar";
import { TuningSidebar } from "./tuning-sidebar";
import { MAX_ZOOM_SCALE, useVectorStudio } from "./use-vector-studio";

export function VectorizerStudio() {
  const studio = useVectorStudio();

  if (!studio.job || !studio.preview) {
    return (
      <HeroDropzone
        isProcessing={studio.isProcessing}
        onFileSelected={studio.handleFileSelected}
      />
    );
  }

  return (
    <div className="space-y-4 pt-20">
      <h1 className="sr-only">
        Vectorization Studio — {studio.job.originalName}
      </h1>

      <StudioToolbar
        originalName={studio.job.originalName}
        dimensions={{
          width: studio.preview.width,
          height: studio.preview.height,
        }}
        scale={studio.camera.scale}
        sliderValue={studio.sliderValue}
        viewMode={studio.viewMode}
        loupeEnabled={studio.loupeEnabled}
        fullWireframe={studio.fullWireframe}
        isDownloading={studio.isDownloading}
        onReset={studio.resetStudio}
        onViewModeChange={studio.setViewMode}
        onToggleLoupe={() => studio.setLoupeEnabled((v) => !v)}
        onToggleWireframe={() => studio.setFullWireframe((v) => !v)}
        onZoomOut={() => studio.zoomBy(1 / 1.25)}
        onZoomIn={() => studio.zoomBy(1.25)}
        onSliderZoom={studio.handleSliderZoom}
        onZoomFit={studio.zoomToFit}
        onZoom1To1={studio.zoom1To1}
        onExport={studio.handleExport}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <ComparisonStage
            originalUrl={getOriginalImageUrl(studio.job.id)}
            preview={studio.preview}
            camera={studio.camera}
            minScale={studio.minScale}
            maxScale={MAX_ZOOM_SCALE}
            viewMode={studio.viewMode}
            loupeEnabled={studio.loupeEnabled}
            fullWireframe={studio.fullWireframe}
            onCameraChange={studio.setCamera}
            onStageResize={studio.setStageSize}
          />
        </div>

        <TuningSidebar
          settings={studio.settings}
          palette={studio.preview.palette}
          pathCount={studio.preview.pathCount}
          processingMs={studio.job.processingMs}
          engine={studio.job.engine}
          dimensions={{
            width: studio.preview.width,
            height: studio.preview.height,
          }}
          isReprocessing={studio.isReprocessing}
          onSettingsChange={studio.setSettings}
          onReprocess={studio.handleReprocess}
        />
      </div>

      <ExportAuthDialog
        mode={studio.downloadModal}
        loginEmail={studio.loginEmail}
        loginPassword={studio.loginPassword}
        isLoggingIn={studio.isLoggingIn}
        onEmailChange={studio.setLoginEmail}
        onPasswordChange={studio.setLoginPassword}
        onSubmitLogin={studio.handleLoginAndRetryDownload}
        onClose={() => studio.setDownloadModal(null)}
      />
    </div>
  );
}
