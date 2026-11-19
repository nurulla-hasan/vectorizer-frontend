"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CARD_TABS,
  EASE_OUT_EXPO,
  PALETTE_SWATCHES,
} from "./hero-animations";

interface HeroWorkbenchProps {
  shouldReduceMotion: boolean | null;
}

export function HeroWorkbench({ shouldReduceMotion }: HeroWorkbenchProps) {
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, x: 24, y: 12 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.65, delay: 0.15, ease: EASE_OUT_EXPO }}
      className="relative"
    >
      <div className="mb-2 flex items-center justify-between font-mono text-xs text-studio-muted">
        <span>{"//"} live studio workbench</span>
        <span className="inline-flex items-center gap-1.5 text-emerald-400">
          <motion.span
            animate={
              shouldReduceMotion
                ? undefined
                : { opacity: [1, 0.35, 1], scale: [1, 0.85, 1] }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block"
          >
            ●
          </motion.span>
          ready
        </span>
      </div>

      <div className="relative">
        {/* Stacked paper sheets behind */}
        <motion.div
          aria-hidden="true"
          initial={
            shouldReduceMotion ? false : { opacity: 0, rotate: 0, x: 0, y: 0 }
          }
          animate={{ opacity: 1, rotate: 1, x: 12, y: 12 }}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE_OUT_EXPO }}
          className="absolute inset-0 rounded-2xl border border-studio-border bg-studio-panel/70"
        />
        <motion.div
          aria-hidden="true"
          initial={
            shouldReduceMotion ? false : { opacity: 0, rotate: 0, x: 0, y: 0 }
          }
          animate={{ opacity: 1, rotate: -1, x: -6, y: 8 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT_EXPO }}
          className="absolute inset-0 rounded-2xl border border-studio-border bg-studio-panel/40"
        />

        {/* Masking tape strip */}
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
            delay: 0.35,
          }}
          className="absolute -top-3.5 left-1/2 z-20 h-7 w-32 -translate-x-1/2 bg-primary/80 shadow-sm"
        />

        {/* Main notebook card */}
        <div className="relative rounded-2xl border border-studio-border bg-studio-panel p-5 shadow-2xl sm:p-6">
          {/* Card Header */}
          <div className="flex items-center justify-between gap-2 font-mono text-xs text-studio-muted">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-studio-foreground">
                02 / 04
              </span>
              <span className="rounded bg-studio-surface px-2 py-0.5 text-xs">
                artwork.svg
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 text-xs text-emerald-400">
                42 paths
              </span>
              <span className="rounded-full border border-primary/50 bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                Bezier
              </span>
            </div>
          </div>

          {/* Inner Drafting Canvas with ruler ticks & red notebook margin */}
          <div className="relative mt-3.5 overflow-hidden rounded-xl border border-studio-border bg-studio-surface">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 vk-dot-grid opacity-55"
            />
            {/* Red notebook margin line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-7 w-px bg-rose-500/35"
            />
            {/* Top ruler strip */}
            <div
              aria-hidden="true"
              className="flex h-5 items-end justify-between border-b border-studio-border/60 bg-studio-panel/60 px-9 font-mono text-xs text-studio-muted/65"
            >
              <span>0</span>
              <span>128</span>
              <span>256</span>
              <span>384</span>
              <span>512px</span>
            </div>

            {/* Sketchy Vector Illustration with Bezier Anchor Handles */}
            <div className="relative flex items-center justify-center px-8 py-6">
              <svg
                viewBox="0 0 420 220"
                fill="none"
                aria-hidden="true"
                className="h-52 w-full sm:h-60 xl:h-64"
              >
                {/* Bounding box selection frame */}
                <rect
                  x="60"
                  y="18"
                  width="300"
                  height="176"
                  stroke="#38BDF8"
                  strokeWidth="1.2"
                  strokeDasharray="5 4"
                  opacity="0.7"
                />
                {/* Corner resize handles */}
                <rect x="56" y="14" width="8" height="8" fill="#38BDF8" />
                <rect x="356" y="14" width="8" height="8" fill="#38BDF8" />
                <rect x="56" y="190" width="8" height="8" fill="#38BDF8" />
                <rect x="356" y="190" width="8" height="8" fill="#38BDF8" />

                {/* Stylized Vector Mountain + Sun Emblem */}
                <motion.circle
                  cx="286"
                  cy="66"
                  r="28"
                  fill="#F6D55C"
                  fillOpacity="0.94"
                  initial={
                    shouldReduceMotion ? false : { scale: 0, opacity: 0 }
                  }
                  animate={
                    shouldReduceMotion
                      ? { scale: 1, opacity: 1 }
                      : {
                          scale: 1,
                          opacity: 1,
                          y: [0, -3, 0],
                        }
                  }
                  transition={
                    shouldReduceMotion
                      ? undefined
                      : {
                          scale: {
                            duration: 0.5,
                            delay: 0.35,
                            ease: EASE_OUT_EXPO,
                          },
                          opacity: { duration: 0.4, delay: 0.35 },
                          y: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.9,
                          },
                        }
                  }
                />
                <motion.path
                  d="M84 172 L172 48 L244 134 L282 88 L338 172 Z"
                  fill="#FB923C"
                  fillOpacity="0.9"
                  stroke="#F4F4F5"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                  initial={
                    shouldReduceMotion
                      ? false
                      : { pathLength: 0, fillOpacity: 0 }
                  }
                  animate={{ pathLength: 1, fillOpacity: 0.9 }}
                  transition={{
                    pathLength: {
                      duration: 0.9,
                      delay: 0.4,
                      ease: EASE_OUT_EXPO,
                    },
                    fillOpacity: { duration: 0.5, delay: 0.85 },
                  }}
                />
                <motion.path
                  d="M172 48 L200 110 L170 100 L146 120 Z"
                  fill="#F4F4F5"
                  fillOpacity="0.92"
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, y: -4 }
                  }
                  animate={{ opacity: 0.92, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.95,
                    ease: EASE_OUT_EXPO,
                  }}
                />
                <motion.path
                  d="M84 172 Q210 150 338 172"
                  stroke="#4ADE80"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={
                    shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }
                  }
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 0.75,
                    delay: 0.75,
                    ease: EASE_OUT_EXPO,
                  }}
                />

                {/* Bezier control handles on peak */}
                <motion.g
                  style={{ transformOrigin: "172px 48px" }}
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, scale: 0.85 }
                  }
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 1, scale: 1, rotate: [-1.8, 1.8, -1.8] }
                  }
                  transition={
                    shouldReduceMotion
                      ? undefined
                      : {
                          opacity: {
                            duration: 0.45,
                            delay: 1.05,
                            ease: EASE_OUT_EXPO,
                          },
                          scale: {
                            duration: 0.45,
                            delay: 1.05,
                            ease: EASE_OUT_EXPO,
                          },
                          rotate: {
                            duration: 4.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1.5,
                          },
                        }
                  }
                >
                  <line
                    x1="130"
                    y1="34"
                    x2="214"
                    y2="62"
                    stroke="#38BDF8"
                    strokeWidth="1.4"
                  />
                  <circle cx="130" cy="34" r="3.5" fill="#38BDF8" />
                  <circle cx="214" cy="62" r="3.5" fill="#38BDF8" />
                  <rect
                    x="167"
                    y="43"
                    width="10"
                    height="10"
                    fill="#202124"
                    stroke="#F6D55C"
                    strokeWidth="2"
                  />
                </motion.g>

                {/* Second Bezier handle on green wave */}
                <motion.g
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, scale: 0.85 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.45,
                    delay: 1.15,
                    ease: EASE_OUT_EXPO,
                  }}
                >
                  <line
                    x1="156"
                    y1="160"
                    x2="264"
                    y2="160"
                    stroke="#4ADE80"
                    strokeWidth="1.4"
                  />
                  <circle cx="156" cy="160" r="3.5" fill="#4ADE80" />
                  <circle cx="264" cy="160" r="3.5" fill="#4ADE80" />
                  <rect
                    x="205"
                    y="155"
                    width="10"
                    height="10"
                    fill="#202124"
                    stroke="#4ADE80"
                    strokeWidth="2"
                  />
                </motion.g>

                {/* Dashed Loupe Circle */}
                <motion.circle
                  cx="172"
                  cy="48"
                  r="40"
                  stroke="#38BDF8"
                  strokeWidth="1.4"
                  strokeDasharray="4 3"
                  fill="#38BDF8"
                  fillOpacity="0.06"
                  initial={
                    shouldReduceMotion ? false : { scale: 0.7, opacity: 0 }
                  }
                  animate={
                    shouldReduceMotion
                      ? { scale: 1, opacity: 1 }
                      : {
                          scale: [1, 1.05, 1],
                          opacity: [0.85, 1, 0.85],
                        }
                  }
                  transition={
                    shouldReduceMotion
                      ? undefined
                      : {
                          duration: 3.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1.2,
                        }
                  }
                />
              </svg>

              {/* Handwritten canvas annotations */}
              <span className="absolute top-6 left-11 -rotate-3 font-hand text-base text-sky-400">
                anchor node
              </span>
              <span className="absolute right-5 bottom-3 -rotate-2 font-hand text-base text-primary">
                smooth cubic bezier
              </span>
            </div>
          </div>

          {/* Color Palette Swatches + Export Chips */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-studio-border pt-3.5">
            <div className="flex items-center gap-1.5">
              <span className="mr-1 font-mono text-xs text-studio-muted">
                Palette:
              </span>
              {PALETTE_SWATCHES.map((swatch, idx) => (
                <motion.span
                  key={swatch.hex}
                  title={swatch.hex}
                  initial={
                    shouldReduceMotion ? false : { scale: 0, opacity: 0 }
                  }
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 20,
                    delay: 0.5 + idx * 0.05,
                  }}
                  whileHover={
                    shouldReduceMotion ? undefined : { scale: 1.25, y: -2 }
                  }
                  className="size-4.5 cursor-pointer rounded-sm border border-border/50 shadow-xs"
                  style={{ backgroundColor: swatch.hex }}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs">
              {["SVG", "PDF", "EPS", "DXF"].map((fmt) => (
                <span
                  key={fmt}
                  className="rounded border border-studio-border bg-studio-surface px-2 py-0.5 text-studio-muted"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between font-mono text-xs text-studio-muted">
            <span className="inline-flex items-center gap-1.5">
              <motion.span
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { scale: [1, 1.25, 1], rotate: [0, 15, 0] }
                }
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-flex"
              >
                <Sparkles className="size-3.5 text-primary" />
              </motion.span>
              128 nodes · 0.08s trace
            </span>
            <Link
              href="/studio"
              className="text-sky-400 transition-colors hover:text-sky-300"
            >
              Try in Studio →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom card step strip */}
      <div className="mt-4 grid grid-cols-4 gap-3 border-t border-studio-border/60 pt-3 font-mono text-xs">
        {CARD_TABS.map((tab) => (
          <div
            key={tab.num}
            className={cn(
              "border-b-2 pb-1.5 transition-colors",
              tab.active
                ? "border-indigo-400 text-studio-foreground"
                : "border-transparent text-studio-muted/70",
            )}
          >
            <span className="block text-xs text-studio-muted/60">
              {tab.num}
            </span>
            <span className="block truncate">{tab.label}</span>
          </div>
        ))}
      </div>

      <motion.p
        animate={shouldReduceMotion ? undefined : { y: [0, -2.5, 0] }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mt-2 text-right -rotate-2 font-hand text-xl tracking-wide text-emerald-400"
      >
        sharp at any zoom level
      </motion.p>
    </motion.div>
  );
}
