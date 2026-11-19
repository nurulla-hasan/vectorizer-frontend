"use client";

import * as React from "react";
import { Check, Copy, KeyRound, Layers, Lock, ShieldCheck } from "lucide-react";
import { ChangePasswordModal } from "@/components/auth/change-password-modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { AuthUser } from "@/services";

interface ProfileSecurityTabProps {
  user: AuthUser;
}

function CopyTextButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="default"
      onClick={handleCopy}
      aria-label={label}
    >
      {copied ? (
        <>
          <Check className="size-4 text-dot-max" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="size-4" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
}

export function ProfileSecurityTab({ user }: ProfileSecurityTabProps) {
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
              04 / CREDENTIALS
            </span>
            <span className="rounded bg-studio-surface px-2 py-0.5 text-xs text-studio-muted">
              AUTH & KEYS
            </span>
          </div>
          <span className="text-xs text-dot-max">
            {"//"} tls 1.3 encrypted
          </span>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-studio-foreground flex items-center gap-2">
            <Lock className="size-5 text-primary" />
            <span>Security & Authentication</span>
          </h3>
          <p className="text-xs text-studio-muted mt-1">
            Manage your session credentials, account password, and reference tokens.
          </p>
        </div>

        <Separator className="bg-studio-border" />

        {/* Password card with self-contained modal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-studio-border bg-studio-surface/60 p-5">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-studio-foreground flex items-center gap-2">
              <KeyRound className="size-4 text-primary" />
              <span>Account Password</span>
            </p>
            <p className="text-xs text-studio-muted max-w-md">
              Update your account password to protect your vectorizer presets, exports, and credits.
            </p>
          </div>
          <ChangePasswordModal
            trigger={
              <Button type="button" variant="outline" size="default">
                <span>Change Password</span>
              </Button>
            }
          />
        </div>

        {/* User reference identifier */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-studio-border bg-studio-surface/60 p-5">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-studio-foreground flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <span>Unique Account Reference (CUID)</span>
            </p>
            <p className="text-xs font-mono text-studio-muted">{user.id}</p>
          </div>
          <CopyTextButton text={user.id} label="Copy ID" />
        </div>

        {/* Authentication Provider Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-studio-border bg-studio-surface/60 p-5">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-studio-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-dot-max" />
              <span>Authentication Provider</span>
            </p>
            <p className="text-xs text-studio-muted">
              {user.authProvider === "GOOGLE"
                ? "Signed in via Google Workspace OAuth SSO."
                : "Signed in with email and Argon2-hashed password credentials."}
            </p>
          </div>
          <span className="font-mono text-xs text-studio-muted rounded border border-studio-border bg-studio-panel px-2.5 py-1">
            {user.authProvider}
          </span>
        </div>
      </div>
    </div>
  );
}
