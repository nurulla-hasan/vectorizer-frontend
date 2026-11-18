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
} from "./trace-studio-context";

function VectorStudioWorkspace() {
  const {
    job,
    preview,
    resetStudio,
    zoomBy,
    zoomToFit,
    zoom1To1,
    undoPathEdit,
    redoPathEdit,
    deletePath,
    selectedPathId,
  } = useVectorStudio();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const hasJob = Boolean(job && preview);

  React.useEffect(() => {
    if (!hasJob) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        (target &&
          /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      ) {
        return;
      }

      const mod = event.ctrlKey || event.metaKey;
      if (mod && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redoPathEdit();
        else undoPathEdit();
        return;
      }
      if (mod && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redoPathEdit();
        return;
      }
      if (mod) return;

      switch (event.key) {
        case "PageUp":
          event.preventDefault();
          zoomBy(1.25);
          break;
        case "PageDown":
          event.preventDefault();
          zoomBy(1 / 1.25);
          break;
        case "Home":
          event.preventDefault();
          zoomToFit();
          break;
        case "End":
          event.preventDefault();
          zoom1To1();
          break;
        case "Delete":
        case "Backspace":
          if (selectedPathId) {
            event.preventDefault();
            deletePath(selectedPathId);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    deletePath,
    hasJob,
    redoPathEdit,
    selectedPathId,
    undoPathEdit,
    zoom1To1,
    zoomBy,
    zoomToFit,
  ]);

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

export function TraceCraftStudio() {
  return (
    <VectorStudioProvider>
      <VectorStudioWorkspace />
    </VectorStudioProvider>
  );
}
