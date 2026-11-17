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
import { getGoogleLoginUrl } from "@/services";
import { useVectorStudio } from "./vector-studio-context";

export function ExportAuthDialog() {
  const {
    downloadModal,
    setDownloadModal,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    isLoggingIn,
    handleLoginAndRetryDownload,
  } = useVectorStudio();

  const closeModal = () => setDownloadModal(null);

  return (
    <Dialog
      open={downloadModal !== null}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      <DialogContent>
        {downloadModal === "AUTH_REQUIRED" ? (
          <form onSubmit={handleLoginAndRetryDownload} className="space-y-4">
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
                  onChange={(e) => setLoginEmail(e.target.value)}
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
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              New here?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-primary hover:underline"
              >
                Create a free account (5 credits)
              </Link>
            </p>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>
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
              <Button variant="outline" onClick={closeModal}>
                Continue Previewing
              </Button>
              <Button onClick={closeModal}>Upgrade Plan</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
