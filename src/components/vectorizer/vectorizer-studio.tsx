"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { CanvasEmptyState } from "./canvas-empty-state";
import { ComparisonStage } from "./comparison-stage";
import { ExportAuthDialog } from "./export-auth-dialog";
import { StudioToolbar } from "./studio-toolbar";
import { TuningSidebar } from "./tuning-sidebar";
import {
  VectorStudioProvider,
  useVectorStudio,
} from "./vector-studio-context";

function VectorStudioWorkspace() {
  const { job, preview, resetStudio } = useVectorStudio();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const hasJob = Boolean(job && preview);

  if (!hasJob) {
    return (
      <div className="relative flex h-dvh w-full flex-col overflow-hidden">
        <div className="vk-blueprint-grid absolute inset-0" aria-hidden="true" />
        <CanvasEmptyState />
        <ExportAuthDialog />
      </div>
    );
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <div className="absolute inset-0">
        <ComparisonStage />
      </div>

      <StudioToolbar
        onOpenSettings={() => setSettingsOpen(true)}
        onReset={() => {
          setSettingsOpen(false);
          resetStudio();
        }}
      />

      <Drawer
        swipeDirection="right"
        modal={false}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      >
        <DrawerContent className="bg-studio-panel text-studio-foreground">
          <DrawerHeader className="flex-row items-center justify-between gap-2 border-b border-studio-border p-4">
            <DrawerTitle className="text-studio-foreground">
              Vector Tuning
            </DrawerTitle>
            <DrawerClose
              render={
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label="Close settings"
                />
              }
            >
              <X className="size-4" />
            </DrawerClose>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
            <TuningSidebar />
          </div>
        </DrawerContent>
      </Drawer>

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
