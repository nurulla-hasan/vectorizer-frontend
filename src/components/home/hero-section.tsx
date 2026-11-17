import Link from "next/link";
import { ArrowRight, CheckCircle2, PlayCircle, Sparkles } from "lucide-react";
import AnimationWrapper from "@/components/common/animation-wrapper";
import { SectionWrapper } from "@/components/common/section-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const HERO_POINTS = [
  "5 free export credits",
  "No card required",
  "SVG · PDF · EPS · DXF",
];

const PIXEL_MARK = [
  [0, 0], [6, 0],
  [0, 1], [6, 1],
  [1, 2], [5, 2],
  [1, 3], [5, 3],
  [2, 4], [4, 4],
  [2, 5], [4, 5],
  [3, 6],
];

export function HeroSection() {
  return (
    <SectionWrapper padding="xl">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <AnimationWrapper direction="up" className="max-w-xl">
          <Badge variant="secondary">
            <Sparkles className="size-3.5" />
            AI raster-to-vector studio
          </Badge>

          <h1 className="mt-5 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Turn pixels into{" "}
            <span className="text-primary">perfect vectors</span>.
          </h1>

          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
            Upload a PNG, JPG, or WebP and get clean, editable SVG, PDF, EPS,
            and DXF artwork in seconds — with split-canvas comparison and a
            cyan wireframe loupe built in.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="xl" render={<Link href="/studio" />}>
              Open the Studio
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="xl"
              render={<Link href="#how-it-works" />}
            >
              <PlayCircle className="size-4" />
              See how it works
            </Button>
          </div>

          <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            {HERO_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="size-4 text-primary" />
                {point}
              </li>
            ))}
          </ul>
        </AnimationWrapper>

        <AnimationWrapper direction="left" delay={0.15} className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-4 -z-10 rounded-3xl bg-primary/10 blur-2xl"
          />

          <div
            aria-hidden="true"
            className="vk-blueprint-grid overflow-hidden rounded-3xl border border-studio-border p-5 sm:p-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-studio-border bg-studio-panel/80 p-4">
                <p className="font-mono text-xs tracking-wide text-studio-muted uppercase">
                  Raster
                </p>
                <div className="vk-checkerboard mt-3 flex aspect-square items-center justify-center rounded-xl border border-studio-border">
                  <svg
                    viewBox="0 0 7 7"
                    className="h-auto w-3/4 text-studio-foreground/80"
                    shapeRendering="crispEdges"
                  >
                    {PIXEL_MARK.map(([x, y]) => (
                      <rect
                        key={`${x}-${y}`}
                        x={x}
                        y={y}
                        width="1"
                        height="1"
                        fill="currentColor"
                      />
                    ))}
                  </svg>
                </div>
              </div>

              <div className="rounded-2xl border border-studio-border bg-studio-panel/80 p-4">
                <p className="font-mono text-xs tracking-wide text-studio-muted uppercase">
                  Vector
                </p>
                <div className="mt-3 flex aspect-square items-center justify-center rounded-xl border border-studio-border bg-studio-surface">
                  <svg
                    viewBox="0 0 120 120"
                    fill="none"
                    className="size-24 text-trace sm:size-28"
                  >
                    <path
                      d="M60 10 106 35v50L60 110 14 85V35L60 10Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M14 35 60 60l46-25M60 60v50"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      opacity="0.45"
                    />
                    <circle cx="60" cy="60" r="3" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-studio-border bg-studio-panel/80 px-4 py-3">
              <span className="text-xs text-studio-muted">
                Trace complete in 0.8s
              </span>
              <span className="font-mono text-xs text-trace">
                98.4% fidelity
              </span>
            </div>
          </div>
        </AnimationWrapper>
      </div>
    </SectionWrapper>
  );
}
