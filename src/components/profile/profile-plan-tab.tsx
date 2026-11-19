"use client";

import Link from "next/link";
import { CheckCircle2, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/services";

interface ProfilePlanTabProps {
  user: AuthUser;
}

export function ProfilePlanTab({ user }: ProfilePlanTabProps) {
  const isPro = user.plan === "PRO";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-studio-border bg-studio-panel p-6 sm:p-8 shadow-xl">
      {/* Background dot grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 vk-dot-grid opacity-30"
      />

      {/* Blueprint registration marks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-2.5 left-2.5 size-1.5 rounded-xs bg-primary/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-2.5 right-2.5 size-1.5 rounded-xs bg-primary/60"
      />

      <div className="relative space-y-6">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-studio-border/70 pb-3 font-mono text-xs text-studio-muted">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-studio-foreground">
              03 / CAPABILITIES
            </span>
            <span className="rounded bg-studio-surface px-2 py-0.5 text-xs text-studio-muted">
              {isPro ? "PRO ENGINE" : "FREE STARTER"}
            </span>
          </div>
          <span className="text-xs text-studio-muted">{"//"} spec matrix</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-studio-foreground flex items-center gap-2">
              <Wand2 className="size-5 text-primary" />
              <span>{isPro ? "TraceCraft Pro Engine Active" : "Starter Quota & Free Tier"}</span>
            </h3>
            <p className="text-xs text-studio-muted mt-1">
              {isPro
                ? "Full sub-pixel Bezier curve fitting, color tuning, and unlimited vector exports."
                : "Basic vector conversions. Upgrade to remove credit caps and unlock all CAD formats."}
            </p>
          </div>
          <Button size="default" render={<Link href="/plans" />}>
            <Sparkles className="size-4" />
            <span>{isPro ? "Manage Subscription" : "Upgrade Plan"}</span>
          </Button>
        </div>

        <Separator className="bg-studio-border" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3.5 rounded-xl border border-studio-border bg-studio-surface/60 p-4">
            <CheckCircle2 className="size-5 text-dot-max shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-studio-foreground">
                Sub-Pixel Bezier Vector Engine
              </p>
              <p className="text-xs text-studio-muted">
                Mathematical curve reconstruction with zero jagged pixel artifacts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-xl border border-studio-border bg-studio-surface/60 p-4">
            <CheckCircle2 className="size-5 text-dot-max shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-studio-foreground">
                Multi-Format Export Matrix
              </p>
              <p className="text-xs text-studio-muted">
                Export to clean SVG, high-res PNG (up to 4x), PDF, EPS, and CAD DXF.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-xl border border-studio-border bg-studio-surface/60 p-4">
            <CheckCircle2
              className={cn(
                "size-5 shrink-0 mt-0.5",
                isPro ? "text-dot-max" : "text-studio-muted/40",
              )}
            />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-studio-foreground">
                Unlimited Production Exports
              </p>
              <p className="text-xs text-studio-muted">
                {isPro
                  ? "Export as many vector files as your workflow demands with zero credit consumption."
                  : "Locked to 5 initial starter credits on the free tier."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-xl border border-studio-border bg-studio-surface/60 p-4">
            <CheckCircle2
              className={cn(
                "size-5 shrink-0 mt-0.5",
                isPro ? "text-dot-max" : "text-studio-muted/40",
              )}
            />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-studio-foreground">
                Priority Dedicated Worker Queue
              </p>
              <p className="text-xs text-studio-muted">
                {isPro
                  ? "Instant trace processing bypassing public queues for sub-second tracing."
                  : "Standard queue processing on free starter accounts."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
