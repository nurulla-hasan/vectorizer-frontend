"use client";

import { CreditCard, Shield, Sparkles, Zap } from "lucide-react";
import type { AuthUser } from "@/services";

interface ProfileMetricsProps {
  user: AuthUser;
}

export function ProfileMetrics({ user }: ProfileMetricsProps) {
  const isPro = user.plan === "PRO";
  const creditsLimit = user.creditsLimit ?? 5;
  const creditsAvailable = user.unlimited ? "Unlimited" : user.credits;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Metric 1: Credits */}
      <div className="relative overflow-hidden rounded-xl border border-studio-border bg-studio-panel/90 p-5 shadow-sm">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2 right-2 size-1 rounded-xs bg-primary/40"
        />
        <div className="flex items-center justify-between font-mono text-xs text-studio-muted mb-2">
          <span>{"//"} 01 · VECTOR CREDITS</span>
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-3.5" />
          </span>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-extrabold font-heading text-studio-foreground tracking-tight">
            {creditsAvailable}
          </div>
          <p className="text-xs text-studio-muted">
            {isPro
              ? "Unlimited high-precision vectorization runs active."
              : `${user.credits} of ${creditsLimit} starter credits remaining.`}
          </p>
        </div>
      </div>

      {/* Metric 2: Plan */}
      <div className="relative overflow-hidden rounded-xl border border-studio-border bg-studio-panel/90 p-5 shadow-sm">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2 right-2 size-1 rounded-xs bg-primary/40"
        />
        <div className="flex items-center justify-between font-mono text-xs text-studio-muted mb-2">
          <span>{"//"} 02 · CURRENT TIER</span>
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCard className="size-3.5" />
          </span>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-extrabold font-heading text-studio-foreground tracking-tight">
            {isPro ? "TraceCraft Pro" : "Free Starter"}
          </div>
          <p className="text-xs text-studio-muted">
            {isPro
              ? "Sub-pixel Bezier curve fitting & priority queue enabled."
              : "Basic SVG & standard resolution exports."}
          </p>
        </div>
      </div>

      {/* Metric 3: Security */}
      <div className="relative overflow-hidden rounded-xl border border-studio-border bg-studio-panel/90 p-5 shadow-sm">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2 right-2 size-1 rounded-xs bg-primary/40"
        />
        <div className="flex items-center justify-between font-mono text-xs text-studio-muted mb-2">
          <span>{"//"} 03 · ACCOUNT SECURITY</span>
          <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-dot-max">
            <Shield className="size-3.5" />
          </span>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-extrabold font-heading text-studio-foreground tracking-tight flex items-center gap-2">
            <span>Secured</span>
            <Zap className="size-4 text-dot-max inline-block" />
          </div>
          <p className="text-xs text-studio-muted">
            {user.authProvider === "GOOGLE"
              ? "Secured with Google OAuth single sign-on."
              : "Secured with verified email & password credentials."}
          </p>
        </div>
      </div>
    </div>
  );
}
