import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  MoveHorizontal,
  ScanSearch,
  Sparkles,
} from "lucide-react";
import AnimationWrapper from "@/components/common/animation-wrapper";
import { Button } from "@/components/ui/button";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { RasterGem, VectorGem } from "./gem-art";

const HERO_POINTS = [
  "5 free export credits",
  "No card required",
  "SVG · PDF · EPS · DXF",
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-dvh lg:h-dvh items-center overflow-hidden bg-studio-surface pt-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="vk-blueprint-grid absolute inset-0 opacity-30" />
        <div className="absolute top-[-14rem] right-[-8%] size-[38rem] rounded-full bg-primary/25 blur-[130px]" />
        <div className="absolute bottom-[-12rem] left-[-10%] size-[32rem] rounded-full bg-trace/10 blur-[120px]" />
      </div>

      <div
        className={cn(
          "relative mx-auto w-full py-4 sm:py-6",
          CONTAINER_MAX_WIDTH,
          CONTAINER_GUTTER,
        )}
      >
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <AnimationWrapper direction="up" className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-studio-muted">
              <Sparkles className="size-3.5 text-trace" />
              Raster → vector studio
            </span>

            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-studio-foreground sm:text-5xl lg:text-6xl">
              Turn pixels into{" "}
              <span className="relative inline-block">
                <span className="bg-[linear-gradient(90deg,var(--trace),var(--title-gradient-2)_48%,var(--title-gradient-3))] bg-clip-text text-transparent">
                  perfect vectors
                </span>
                <svg
                  viewBox="0 0 300 14"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-2 h-3 w-full"
                >
                  <defs>
                    <linearGradient id="hero-underline" x1="0" x2="1">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M3 10C58 3 118 2 175 7S268 12 297 5"
                    fill="none"
                    stroke="url(#hero-underline)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="vk-draw-line"
                  />
                </svg>
              </span>
              .
            </h1>

            <p className="mt-6 text-base leading-7 text-studio-muted sm:text-lg">
              Drop in a PNG, JPG, or WebP and get clean, editable SVG, PDF, EPS,
              and DXF artwork in seconds — with synced split-canvas comparison, a
              cyan wireframe loupe, and manual path fixes built in.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="xl" render={<Link href="/studio" />}>
                Open the Studio
                <ArrowRight className="size-4" />
              </Button>
            </div>

            <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
              {HERO_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-1.5 text-sm text-studio-muted"
                >
                  <CheckCircle2 className="size-4 text-trace" />
                  {point}
                </li>
              ))}
            </ul>
          </AnimationWrapper>

          <AnimationWrapper direction="left" delay={0.15} className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/20 blur-3xl"
            />

            <div
              aria-hidden="true"
              className="vk-float relative rounded-2xl border border-studio-border bg-studio-surface/95 shadow-[0_40px_120px_-30px_color-mix(in_oklch,var(--shadow-color),transparent_80%)] backdrop-blur"
            >
              <div className="flex items-center gap-2 border-b border-studio-border/70 px-3 py-2.5">
                <span className="size-2 rounded-full bg-dot-close/80" />
                <span className="size-2 rounded-full bg-dot-min/80" />
                <span className="size-2 rounded-full bg-dot-max/80" />
                <span className="mx-2 h-4 w-px bg-studio-border/70" />
                <span className="truncate font-mono text-[11px] text-studio-muted">
                  tracecraft / studio / compare.svg
                </span>
                <span className="ml-auto rounded-full border border-trace/30 bg-trace/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-trace">
                  LIVE
                </span>
              </div>

              <div className="relative grid grid-cols-2">
                <div className="vk-checkerboard relative flex aspect-[5/4] items-center justify-center border-r border-studio-border/70">
                  <span className="absolute top-2.5 left-3 font-mono text-[10px] tracking-[0.18em] text-studio-muted uppercase">
                    Raster
                  </span>
                  <RasterGem className="w-3/5 max-w-52" />
                </div>
                <div className="vk-blueprint-grid relative flex aspect-[5/4] items-center justify-center">
                  <span className="absolute top-2.5 right-3 font-mono text-[10px] tracking-[0.18em] text-trace/80 uppercase">
                    Vector
                  </span>
                  <VectorGem idPrefix="hero-gem" className="w-3/5 max-w-52" />
                </div>
                <div className="absolute top-1/2 left-1/2 z-10 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-trace/40 bg-studio-surface text-trace shadow-[0_0_22px_color-mix(in_oklch,var(--trace),transparent_65%)]">
                  <MoveHorizontal className="size-4" />
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-trace/40"
                />
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-studio-border/70 px-3 py-2.5">
                <span className="flex items-center gap-1.5 text-[11px] text-studio-muted">
                  <Cpu className="size-3.5 text-trace" />
                  Vectorizer API
                </span>
                <span className="font-mono text-[10px] tracking-wider text-studio-muted">
                  SVG · PDF · EPS · DXF
                </span>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="vk-float-slow absolute -top-5 right-4 hidden items-center gap-1.5 rounded-full border border-studio-border bg-studio-panel px-3 py-1.5 text-xs text-studio-foreground shadow-lg sm:flex"
            >
              <ScanSearch className="size-3.5 text-trace" />
              Wireframe loupe
            </div>
          </AnimationWrapper>
        </div>
      </div>
    </section>
  );
}
