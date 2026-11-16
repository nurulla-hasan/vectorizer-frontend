"use client";

import * as React from "react";
import Link from "next/link";
import { GoogleIcon } from "@/components/common/brand-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getGoogleLoginUrl } from "@/lib/auth-api";

interface ExportAuthDialogProps {
  mode: "AUTH_REQUIRED" | "INSUFFICIENT_CREDITS" | null;
  loginEmail: string;
  loginPassword: string;
  isLoggingIn: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmitLogin: (event: React.FormEvent) => void;
  onClose: () => void;
}

export function ExportAuthDialog({
  mode,
  loginEmail,
  loginPassword,
  isLoggingIn,
  onEmailChange,
  onPasswordChange,
  onSubmitLogin,
  onClose,
}: ExportAuthDialogProps) {
  return (
    <Dialog
      open={mode !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        {mode === "AUTH_REQUIRED" ? (
          <form onSubmit={onSubmitLogin} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Sign in to export</DialogTitle>
              <DialogDescription>
                Interactive previews are free for everyone. Sign in to export
                clean SVG, high-res PNG, and print-ready PDF files (Free
                accounts include 5 starter credits).
              </DialogDescription>
            </DialogHeader>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              render={<a href={getGoogleLoginUrl()} />}
            >
              <GoogleIcon className="size-4" />
              Continue with Google
            </Button>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="studio-login-email">Email</Label>
                <Input
                  id="studio-login-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => onEmailChange(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="studio-login-password">Password</Label>
                <Input
                  id="studio-login-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => onPasswordChange(e.target.value)}
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              New here?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Create a free account (5 credits)
              </Link>
            </p>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isLoggingIn}
                loadingText="Signing in..."
              >
                Sign In &amp; Export
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Out of export credits</DialogTitle>
              <DialogDescription>
                Your Free plan credits have been used. Upgrade to a PRO or API
                plan for unlimited high-precision SVG, PNG, and PDF exports.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Continue Previewing
              </Button>
              <Button onClick={onClose}>Upgrade Plan</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
