"use client";

import { ComparisonStage } from "./comparison-stage";
import { ExportAuthDialog } from "./export-auth-dialog";
import { HeroDropzone } from "./hero-dropzone";
import { StudioToolbar } from "./studio-toolbar";
import { TuningSidebar } from "./tuning-sidebar";
import {
  VectorStudioProvider,
  useVectorStudio,
} from "./vector-studio-context";

function VectorStudioWorkspace() {
  const { job, preview } = useVectorStudio();

  if (!job || !preview) {
    return <HeroDropzone />;
  }

  return (
    <div className="space-y-4 pt-20">
      <h1 className="sr-only">Vectorization Studio — {job.originalName}</h1>

      <StudioToolbar />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <ComparisonStage />
        </div>

        <TuningSidebar />
      </div>

      <ExportAuthDialog />
    </div>
  );
}

export function VectorizerStudio() {
  return (
    <VectorStudioProvider>
      <VectorStudioWorkspace />
    </VectorStudioProvider>
  );
}
