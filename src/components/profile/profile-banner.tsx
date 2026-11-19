"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, getInitials } from "@/lib/utils";
import type { AuthUser } from "@/services";

interface ProfileBannerProps {
  user: AuthUser;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function ProfileBanner({ user }: ProfileBannerProps) {
  const shouldReduceMotion = useReducedMotion();
  const isPro = user.plan === "PRO";

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
      className="relative"
    >
      {/* Stacked notebook sheet behind */}
      <motion.div
        aria-hidden="true"
        initial={
          shouldReduceMotion ? false : { opacity: 0, rotate: 0, x: 0, y: 0 }
        }
        animate={{ opacity: 1, rotate: 1, x: 8, y: 8 }}
        transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT_EXPO }}
        className="absolute inset-0 rounded-2xl border border-studio-border bg-studio-panel/60"
      />

      {/* Craft masking tape strip at top */}
      <motion.div
        aria-hidden="true"
        initial={
          shouldReduceMotion ? false : { opacity: 0, y: -10, rotate: -6 }
        }
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 20,
          delay: 0.25,
        }}
        className="absolute -top-3 left-12 z-20 h-6 w-28 -translate-x-2 rounded-xs bg-dot-min/80 shadow-xs"
      />

      {/* Main Studio Profile Card */}
      <div className="relative overflow-hidden rounded-2xl border border-studio-border bg-studio-panel p-6 sm:p-8 shadow-xl">
        {/* Subtle dot-grid canvas inside card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 vk-dot-grid opacity-35"
        />

        {/* Blueprint corner registration marks */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2.5 left-2.5 size-1.5 rounded-xs bg-primary/60"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2.5 right-2.5 size-1.5 rounded-xs bg-primary/60"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2.5 left-2.5 size-1.5 rounded-xs bg-primary/60"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2.5 bottom-2.5 size-1.5 rounded-xs bg-primary/60"
        />

        {/* Top Technical Metadata Bar */}
        <div className="relative mb-5 flex items-center justify-between border-b border-studio-border/70 pb-3 font-mono text-xs text-studio-muted">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-studio-foreground">
              01 / IDENTITY
            </span>
            <span className="rounded bg-studio-surface px-2 py-0.5 text-xs text-studio-muted">
              cuid · {user.id.slice(0, 8)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-dot-max">
              <motion.span
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: [1, 0.4, 1], scale: [1, 0.88, 1] }
                }
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-block"
              >
                ●
              </motion.span>
              SESSION ACTIVE
            </span>
          </div>
        </div>

        {/* Content Row */}
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar frame */}
            <div className="relative shrink-0">
              <Avatar size="2xl">
                <AvatarImage src={user.imageUrl} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-studio-panel border border-studio-border text-dot-max shadow-xs">
                <ShieldCheck className="size-3.5" />
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-studio-foreground">
                  {user.name || "Vectorizer User"}
                </h2>
                {isPro ? (
                  <Badge variant="success">Pro Plan</Badge>
                ) : (
                  <Badge variant="secondary">Free Plan</Badge>
                )}
                {user.role === "ADMIN" && (
                  <Badge variant="default">Admin</Badge>
                )}
                <Badge variant="active">{user.status || "ACTIVE"}</Badge>
              </div>

              <p className="text-sm text-studio-muted flex items-center gap-2 font-mono">
                <Mail className="size-4 shrink-0 text-studio-muted" />
                <span>{user.email}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-studio-muted pt-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-studio-muted" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </span>
                <span className="inline-block size-1 rounded-full bg-studio-border" />
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-dot-max" />
                  <span>
                    {user.authProvider === "GOOGLE"
                      ? "Google SSO"
                      : "Email & Password"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Button
              variant="outline"
              size="default"
              render={<Link href="/studio" />}
              className="flex-1 sm:flex-none"
            >
              <span>Open Studio</span>
              <ArrowRight className="size-4" />
            </Button>
            {!isPro && (
              <Button
                size="default"
                render={<Link href="/plans" />}
                className="flex-1 sm:flex-none"
              >
                <Sparkles className="size-4" />
                <span>Upgrade to Pro</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
