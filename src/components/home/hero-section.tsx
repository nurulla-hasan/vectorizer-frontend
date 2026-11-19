"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Layers, Wand2 } from "lucide-react";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";
import {
  AVATAR_COLORS,
  BOTTOM_HIGHLIGHTS,
  EASE_OUT_EXPO,
  PIPELINE_STEPS,
  fadeUpItem,
  leftContainerVariants,
  pipelineContainerVariants,
  pipelineItemVariants,
} from "./hero-animations";
import { HeroWorkbench } from "./hero-workbench";

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const initialState = shouldReduceMotion ? "visible" : "hidden";

  return (
    <section className="relative flex min-h-dvh lg:h-dvh flex-col justify-between overflow-hidden bg-studio-surface pt-20 pb-6">
      {/* Dot-grid notebook background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 vk-dot-grid opacity-40"
      />

      {/* Main Hero Grid */}
      <div
        className={cn(
          "relative mx-auto my-auto w-full",
          CONTAINER_MAX_WIDTH,
          CONTAINER_GUTTER,
        )}
      >
        <div className="grid items-center gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14 xl:gap-20">
          {/* Left Column */}
          <motion.div
            variants={leftContainerVariants}
            initial={initialState}
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div
              variants={fadeUpItem}
              className="flex flex-wrap items-center gap-3"
            >
              <p className="font-mono text-xs tracking-wider text-studio-muted sm:text-sm">
                <span className="text-studio-muted/60">{"//"}</span> Raster to
                vector · Vectorizer API
              </p>
              <motion.span
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-medium text-primary"
              >
                <motion.span
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { rotate: [0, 14, -10, 0] }
                  }
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-flex"
                >
                  <Wand2 className="size-3" />
                </motion.span>
                SUB-PIXEL BEZIER
              </motion.span>
            </motion.div>

            <motion.div
              variants={fadeUpItem}
              className="mt-5 flex items-start gap-5"
            >
              {/* Sketchy stamped mode badge */}
              <motion.div
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, rotate: -8, scale: 0.9 }
                }
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                  delay: 0.15,
                }}
                whileHover={
                  shouldReduceMotion ? undefined : { rotate: -3, scale: 1.05 }
                }
                className="hidden shrink-0 cursor-default flex-col items-center justify-center rounded-xl border-2 border-dashed border-studio-border bg-studio-panel px-3.5 py-3 text-center shadow-md sm:flex"
              >
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Layers className="size-6" />
                </div>
                <span className="mt-1.5 font-mono text-xs font-bold tracking-wider text-studio-foreground uppercase">
                  1:1 Trace
                </span>
                <span className="font-hand text-sm text-studio-muted">
                  lossless
                </span>
              </motion.div>

              <h1 className="font-heading text-4xl font-bold tracking-tight text-studio-foreground sm:text-5xl lg:text-6xl xl:text-7xl xl:leading-none">
                Turn pixels into{" "}
                <span className="whitespace-nowrap">
                  <motion.span
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, scale: 0.85, rotate: -6 }
                    }
                    animate={{ opacity: 1, scale: 1, rotate: -1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                      delay: 0.22,
                    }}
                    whileHover={
                      shouldReduceMotion ? undefined : { rotate: 0, scale: 1.03 }
                    }
                    className="inline-block -rotate-1 bg-primary px-3 py-0.5 text-primary-foreground shadow-md"
                  >
                    vectors
                  </motion.span>
                  <span>.</span>
                </span>
              </h1>
            </motion.div>

            {/* Colored hand-underlined pipeline */}
            <motion.div
              variants={pipelineContainerVariants}
              className="mt-5 flex flex-wrap items-center gap-2 font-mono text-xs sm:text-sm"
            >
              <span className="text-studio-muted/60">↳</span>
              {PIPELINE_STEPS.map((step, i) => (
                <motion.span
                  key={step.label}
                  variants={pipelineItemVariants}
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  className="inline-flex cursor-default items-center gap-2"
                >
                  <span
                    className={cn("border-b border-dashed pb-0.5", step.color)}
                  >
                    {step.label}
                  </span>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <span className="text-studio-muted/50">→</span>
                  )}
                </motion.span>
              ))}
            </motion.div>

            <motion.p
              variants={fadeUpItem}
              className="mt-5 max-w-xl text-base leading-7 text-studio-muted sm:text-lg"
            >
              Drop in any PNG, JPG, or WebP and get crisp, production-ready SVG,
              PDF, EPS, and DXF artwork in seconds — with split-canvas compare,
              wireframe loupe, and manual path editing built right in.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUpItem}
              className="mt-6 flex flex-wrap items-center gap-3.5"
            >
              <motion.div
                whileHover={
                  shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }
                }
                whileTap={
                  shouldReduceMotion ? undefined : { y: 1, scale: 0.98 }
                }
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Link
                  href="/studio"
                  className="inline-flex h-12 items-center gap-2.5 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 sm:text-base"
                >
                  <span className="size-2 rounded-full bg-primary-foreground" />
                  Open the Studio
                  <ArrowRight className="size-4" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={
                  shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }
                }
                whileTap={
                  shouldReduceMotion ? undefined : { y: 1, scale: 0.98 }
                }
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Link
                  href="/plans"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-studio-border bg-studio-panel px-6 text-sm font-medium text-studio-foreground transition-colors hover:border-studio-muted/60 hover:bg-accent sm:text-base"
                >
                  <span className="size-2 rounded-full bg-indigo-400" />
                  View Plans
                </Link>
              </motion.div>

              <motion.span
                initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
                animate={
                  shouldReduceMotion
                    ? { opacity: 1, x: 0 }
                    : {
                        opacity: 1,
                        x: 0,
                        y: [0, -3, 0],
                        rotate: [-2, -0.5, -2],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: {
                          duration: 0.5,
                          delay: 0.55,
                          ease: EASE_OUT_EXPO,
                        },
                        x: {
                          duration: 0.5,
                          delay: 0.55,
                          ease: EASE_OUT_EXPO,
                        },
                        y: {
                          duration: 3.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1.1,
                        },
                        rotate: {
                          duration: 3.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1.1,
                        },
                      }
                }
                className="ml-1 -rotate-2 font-hand text-2xl text-indigo-400"
              >
                every curve editable ↗
              </motion.span>
            </motion.div>

            {/* Code-style spec lines + avatar stack */}
            <motion.div
              variants={fadeUpItem}
              className="mt-6 space-y-2.5 border-t border-dashed border-studio-border/80 pt-5 font-mono text-xs text-studio-muted sm:text-sm"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-studio-foreground">
                  <span className="text-violet-400">trace</span>(raster)
                </span>
                <span className="text-emerald-400/80">──────→</span>
                <div className="flex items-center -space-x-1.5">
                  {AVATAR_COLORS.map((cls, idx) => (
                    <motion.span
                      key={cls}
                      whileHover={
                        shouldReduceMotion ? undefined : { y: -3, scale: 1.15 }
                      }
                      className={cn(
                        "flex size-5 cursor-default items-center justify-center rounded-full border border-studio-surface text-xs font-bold",
                        cls,
                      )}
                    >
                      {["S", "V", "G", "P", "D"][idx]}
                    </motion.span>
                  ))}
                </div>
                <span>[SVG, PDF, EPS, DXF]</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-studio-foreground">
                  <span className="text-sky-400">precision</span>(curves)
                </span>
                <span className="text-emerald-400/80">──→</span>
                <span className="inline-flex items-center gap-1.5">
                  [0.1px fit,
                  <span className="rounded bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                    clean paths
                  </span>
                  ]
                </span>
              </div>
            </motion.div>

            {/* Bottom sketchy oval badge + mini stats */}
            <motion.div
              variants={fadeUpItem}
              className="mt-5 flex flex-wrap items-center gap-6"
            >
              <div className="relative inline-flex flex-col items-center justify-center px-7 py-2.5">
                <svg
                  viewBox="0 0 150 64"
                  fill="none"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full text-studio-muted/60"
                >
                  <motion.path
                    d="M12 34C10 15 38 5 76 6C116 7 142 18 140 34C138 50 110 59 72 58C35 57 14 48 12 34Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    initial={
                      shouldReduceMotion
                        ? false
                        : { pathLength: 0, opacity: 0 }
                    }
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 0.9,
                      delay: 0.55,
                      ease: EASE_OUT_EXPO,
                    }}
                  />
                  <motion.path
                    d="M18 30C19 14 46 8 78 9C113 10 137 21 135 35"
                    stroke="currentColor"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    strokeDasharray="3 4"
                    initial={
                      shouldReduceMotion
                        ? false
                        : { pathLength: 0, opacity: 0 }
                    }
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.8,
                      ease: EASE_OUT_EXPO,
                    }}
                  />
                </svg>
                <span className="font-heading text-base font-bold text-studio-foreground">
                  <span className="text-primary">★</span> 5 free
                </span>
                <span className="font-mono text-xs text-studio-muted">
                  export credits
                </span>
              </div>

              <div className="flex items-center gap-5 font-mono text-xs text-studio-muted">
                <div>
                  <span className="block font-heading text-lg font-bold text-studio-foreground">
                    4×
                  </span>
                  <span className="text-xs">PNG scale</span>
                </div>
                <span className="h-7 w-px bg-studio-border" />
                <div>
                  <span className="block font-heading text-lg font-bold text-studio-foreground">
                    0.1px
                  </span>
                  <span className="text-xs">curve fit</span>
                </div>
                <span className="h-7 w-px bg-studio-border" />
                <div>
                  <span className="block font-heading text-lg font-bold text-studio-foreground">
                    No card
                  </span>
                  <span className="text-xs">to start</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Large Sketchbook Vector Workbench */}
          <HeroWorkbench shouldReduceMotion={shouldReduceMotion} />
        </div>
      </div>

      {/* Bottom 4-step drafting strip to anchor the full screen */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.45, ease: EASE_OUT_EXPO }}
        className={cn(
          "relative mx-auto hidden w-full lg:block",
          CONTAINER_MAX_WIDTH,
          CONTAINER_GUTTER,
        )}
      >
        <div className="grid grid-cols-4 gap-6 border-t border-dashed border-studio-border/80 pt-4">
          {BOTTOM_HIGHLIGHTS.map((item) => (
            <div key={item.num} className="flex items-baseline gap-2.5">
              <span className={cn("font-mono text-xs font-bold", item.accent)}>
                {item.num}
              </span>
              <div className="min-w-0">
                <p className="font-heading text-sm font-semibold text-studio-foreground">
                  {item.title}
                </p>
                <p className="truncate font-mono text-xs text-studio-muted">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
