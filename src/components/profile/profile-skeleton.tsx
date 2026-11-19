"use client";

import { PageWrapper } from "@/components/common/page-wrapper";
import { Navbar } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function ProfileSkeleton() {
  return (
    <div className="relative min-h-dvh bg-studio-surface">
      <Navbar />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 vk-dot-grid opacity-40"
      />
      <PageWrapper className="relative py-8 md:py-12">
        <div
          className={cn(
            "mx-auto space-y-8",
            CONTAINER_MAX_WIDTH,
            CONTAINER_GUTTER,
          )}
        >
          {/* Header Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Banner Skeleton */}
          <div className="rounded-2xl border border-studio-border bg-studio-panel p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Skeleton className="size-20 rounded-full" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-md" />
                  <Skeleton className="h-6 w-24 rounded-md" />
                </div>
              </div>
            </div>
          </div>

          {/* Metric Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>

          {/* Main Card Skeleton */}
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </PageWrapper>
    </div>
  );
}
