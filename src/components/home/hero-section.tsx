import Link from "next/link";
import { ArrowRight, Layers, Sparkles, Wand2 } from "lucide-react";
import AnimationWrapper from "@/components/common/animation-wrapper";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";

const PIPELINE_STEPS = [
  { label: "PNG / JPG", color: "border-sky-400 text-sky-400" },
  { label: "Trace", color: "border-violet-400 text-violet-400" },
  { label: "Bezier", color: "border-pink-400 text-pink-400" },
  { label: "SVG", color: "border-amber-400 text-amber-400" },
  { label: "PDF", color: "border-emerald-400 text-emerald-400" },
  { label: "DXF", color: "border-cyan-400 text-cyan-400" },
];

const PALETTE_SWATCHES = [
  { hex: "#F6D55C", name: "Yellow" },
  { hex: "#FB923C", name: "Amber" },
  { hex: "#38BDF8", name: "Sky" },
  { hex: "#4ADE80", name: "Mint" },
  { hex: "#F472B6", name: "Rose" },
];

const CARD_TABS = [
  { num: "01", label: "Split Compare", active: false },
  { num: "02", label: "Bezier Curves", active: true },
  { num: "03", label: "Wireframe Loupe", active: false },
  { num: "04", label: "Path Editor", active: false },
];

const AVATAR_COLORS = [
  "bg-amber-400 text-[#1e1f22]",
  "bg-sky-400 text-[#1e1f22]",
  "bg-emerald-400 text-[#1e1f22]",
  "bg-pink-400 text-[#1e1f22]",
  "bg-violet-400 text-[#1e1f22]",
];

const BOTTOM_HIGHLIGHTS = [
  {
    num: "01",
    title: "Drop any raster",
    desc: "PNG, JPG, WebP up to 50MP",
    accent: "text-sky-400",
  },
  {
    num: "02",
    title: "Vectorizer API trace",
    desc: "Sub-pixel cubic Bezier fitting",
    accent: "text-[#f6d55c]",
  },
  {
    num: "03",
    title: "Loupe & path editor",
    desc: "Inspect nodes & tweak colors live",
    accent: "text-pink-400",
  },
  {
    num: "04",
    title: "Production exports",
    desc: "Clean SVG, PNG 4×, PDF, EPS, DXF",
    accent: "text-emerald-400",
  },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-dvh lg:h-dvh flex-col justify-between overflow-hidden bg-studio-surface pt-20 pb-6">
      {/* Dot-grid notebook background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 vk-dot-grid opacity-40"
      />

      {/* Subtle drafting corner ticks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-20 hidden justify-between font-mono text-[10px] text-studio-muted/35 lg:flex"
      >
        <span>+ 00,00 · DRAFTING SHEET</span>
        <span>SCALE 1:1 · VECTORIZER API</span>
      </div>

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
          <AnimationWrapper direction="up" className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-xs tracking-wider text-studio-muted sm:text-sm">
                <span className="text-studio-muted/60">{"//"}</span> Raster to
                vector · Vectorizer API
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[#f6d55c]/40 bg-[#f6d55c]/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#f6d55c]">
                <Wand2 className="size-3" />
                SUB-PIXEL BEZIER
              </span>
            </div>

            <div className="mt-5 flex items-start gap-5">
              {/* Sketchy stamped mode badge */}
              <div className="hidden shrink-0 flex-col items-center justify-center rounded-xl border-2 border-dashed border-studio-border bg-studio-panel px-3.5 py-3 text-center shadow-[4px_4px_0_0_rgba(0,0,0,0.28)] sm:flex">
                <div className="flex size-11 items-center justify-center rounded-lg bg-[#f6d55c]/15 text-[#f6d55c]">
                  <Layers className="size-6" />
                </div>
                <span className="mt-1.5 font-mono text-[10px] font-bold tracking-wider text-studio-foreground uppercase">
                  1:1 Trace
                </span>
                <span className="font-hand text-sm text-studio-muted">
                  lossless
                </span>
              </div>

              <h1 className="font-heading text-4xl font-bold tracking-tight text-studio-foreground sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] xl:leading-[1.05]">
                Turn pixels into{" "}
                <span className="whitespace-nowrap">
                  <span className="inline-block -rotate-1 bg-[#f6d55c] px-3 py-0.5 text-[#1e1f22] shadow-[4px_4px_0_0_rgba(0,0,0,0.35)]">
                    vectors
                  </span>
                  <span>.</span>
                </span>
              </h1>
            </div>

            {/* Colored hand-underlined pipeline */}
            <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-xs sm:text-sm">
              <span className="text-studio-muted/60">↳</span>
              {PIPELINE_STEPS.map((step, i) => (
                <span
                  key={step.label}
                  className="inline-flex items-center gap-2"
                >
                  <span
                    className={cn("border-b border-dashed pb-0.5", step.color)}
                  >
                    {step.label}
                  </span>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <span className="text-studio-muted/50">→</span>
                  )}
                </span>
              ))}
            </div>

            <p className="mt-5 max-w-xl text-base leading-7 text-studio-muted sm:text-[17px]">
              Drop in any PNG, JPG, or WebP and get crisp, production-ready SVG,
              PDF, EPS, and DXF artwork in seconds — with split-canvas compare,
              wireframe loupe, and manual path editing built right in.
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3.5">
              <Link
                href="/studio"
                className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#f6d55c] px-7 text-sm font-semibold text-[#1e1f22] shadow-[0_3px_0_0_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-[#f8dc72] active:translate-y-0 sm:text-base"
              >
                <span className="size-2 rounded-full bg-[#1e1f22]" />
                Open the Studio
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/plans"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-studio-border bg-studio-panel px-6 text-sm font-medium text-studio-foreground transition-colors hover:border-studio-muted/60 hover:bg-accent sm:text-base"
              >
                <span className="size-2 rounded-full bg-indigo-400" />
                View Plans
              </Link>

              <span className="ml-1 -rotate-2 font-hand text-2xl text-indigo-400">
                every curve editable ↗
              </span>
            </div>

            {/* Code-style spec lines + avatar stack */}
            <div className="mt-6 space-y-2.5 border-t border-dashed border-studio-border/80 pt-5 font-mono text-xs text-studio-muted sm:text-[13px]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-studio-foreground">
                  <span className="text-violet-400">trace</span>(raster)
                </span>
                <span className="text-emerald-400/80">──────→</span>
                <div className="flex items-center -space-x-1.5">
                  {AVATAR_COLORS.map((cls, idx) => (
                    <span
                      key={cls}
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full border border-studio-surface text-[9px] font-bold",
                        cls,
                      )}
                    >
                      {["S", "V", "G", "P", "D"][idx]}
                    </span>
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
                  <span className="rounded bg-[#f6d55c] px-2 py-0.5 text-[11px] font-semibold text-[#1e1f22]">
                    clean paths
                  </span>
                  ]
                </span>
              </div>
            </div>

            {/* Bottom sketchy oval badge + mini stats */}
            <div className="mt-5 flex flex-wrap items-center gap-6">
              <div className="relative inline-flex flex-col items-center justify-center px-7 py-2.5">
                <svg
                  viewBox="0 0 150 64"
                  fill="none"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full text-studio-muted/60"
                >
                  <path
                    d="M12 34C10 15 38 5 76 6C116 7 142 18 140 34C138 50 110 59 72 58C35 57 14 48 12 34Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18 30C19 14 46 8 78 9C113 10 137 21 135 35"
                    stroke="currentColor"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    strokeDasharray="3 4"
                  />
                </svg>
                <span className="font-heading text-base font-bold text-studio-foreground">
                  <span className="text-[#f6d55c]">★</span> 5 free
                </span>
                <span className="font-mono text-[10px] text-studio-muted">
                  export credits
                </span>
              </div>

              <div className="flex items-center gap-5 font-mono text-xs text-studio-muted">
                <div>
                  <span className="block font-heading text-lg font-bold text-studio-foreground">
                    4×
                  </span>
                  <span className="text-[11px]">PNG scale</span>
                </div>
                <span className="h-7 w-px bg-studio-border" />
                <div>
                  <span className="block font-heading text-lg font-bold text-studio-foreground">
                    0.1px
                  </span>
                  <span className="text-[11px]">curve fit</span>
                </div>
                <span className="h-7 w-px bg-studio-border" />
                <div>
                  <span className="block font-heading text-lg font-bold text-studio-foreground">
                    No card
                  </span>
                  <span className="text-[11px]">to start</span>
                </div>
              </div>
            </div>
          </AnimationWrapper>

          {/* Right Column: Large Sketchbook Vector Workbench */}
          <AnimationWrapper direction="left" delay={0.15} className="relative">
            <div className="mb-2 flex items-center justify-between font-mono text-xs text-studio-muted">
              <span>{"//"} live studio workbench</span>
              <span className="text-emerald-400">● ready</span>
            </div>

            <div className="relative">
              {/* Stacked paper sheets behind */}
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-3 translate-y-3 rotate-1 rounded-2xl border border-studio-border bg-studio-panel/70"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -translate-x-1.5 translate-y-2 -rotate-1 rounded-2xl border border-studio-border bg-studio-panel/40"
              />

              {/* Masking tape strip */}
              <div
                aria-hidden="true"
                className="absolute -top-3.5 left-1/2 z-20 h-7 w-32 -translate-x-1/2 -rotate-2 bg-[#d4b84a]/85 shadow-sm"
              />

              {/* Main notebook card */}
              <div className="relative rounded-2xl border border-studio-border bg-studio-panel p-5 shadow-2xl sm:p-6">
                {/* Card Header */}
                <div className="flex items-center justify-between gap-2 font-mono text-xs text-studio-muted">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-studio-foreground">
                      02 / 04
                    </span>
                    <span className="rounded bg-studio-surface px-2 py-0.5 text-[11px]">
                      artwork.svg
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] text-emerald-400">
                      42 paths
                    </span>
                    <span className="rounded-full border border-[#f6d55c]/50 bg-[#f6d55c]/10 px-2.5 py-0.5 text-[11px] text-[#f6d55c]">
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
                    className="flex h-5 items-end justify-between border-b border-studio-border/60 bg-studio-panel/60 px-9 font-mono text-[9px] text-studio-muted/65"
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
                      <circle
                        cx="286"
                        cy="66"
                        r="28"
                        fill="#F6D55C"
                        fillOpacity="0.94"
                      />
                      <path
                        d="M84 172 L172 48 L244 134 L282 88 L338 172 Z"
                        fill="#FB923C"
                        fillOpacity="0.9"
                        stroke="#F4F4F5"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M172 48 L200 110 L170 100 L146 120 Z"
                        fill="#F4F4F5"
                        fillOpacity="0.92"
                      />
                      <path
                        d="M84 172 Q210 150 338 172"
                        stroke="#4ADE80"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Bezier control handles on peak */}
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

                      {/* Second Bezier handle on green wave */}
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

                      {/* Dashed Loupe Circle */}
                      <circle
                        cx="172"
                        cy="48"
                        r="40"
                        stroke="#38BDF8"
                        strokeWidth="1.4"
                        strokeDasharray="4 3"
                        fill="#38BDF8"
                        fillOpacity="0.06"
                      />
                    </svg>

                    {/* Handwritten canvas annotations */}
                    <span className="absolute top-6 left-11 -rotate-3 font-hand text-base text-sky-400">
                      anchor node
                    </span>
                    <span className="absolute right-5 bottom-3 -rotate-2 font-hand text-base text-[#f6d55c]">
                      smooth cubic bezier
                    </span>
                  </div>
                </div>

                {/* Color Palette Swatches + Export Chips */}
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-studio-border pt-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="mr-1 font-mono text-[11px] text-studio-muted">
                      Palette:
                    </span>
                    {PALETTE_SWATCHES.map((swatch) => (
                      <span
                        key={swatch.hex}
                        title={swatch.hex}
                        className="size-4.5 rounded-sm border border-black/30 shadow-xs"
                        style={{ backgroundColor: swatch.hex }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
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
                    <Sparkles className="size-3.5 text-[#f6d55c]" />
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
            <div className="mt-4 grid grid-cols-4 gap-3 border-t border-studio-border/60 pt-3 font-mono text-[11px]">
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
                  <span className="block text-[10px] text-studio-muted/60">
                    {tab.num}
                  </span>
                  <span className="block truncate">{tab.label}</span>
                </div>
              ))}
            </div>

            <p className="mt-2 text-right -rotate-2 font-hand text-xl tracking-wide text-emerald-400">
              sharp at any zoom level
            </p>
          </AnimationWrapper>
        </div>
      </div>

      {/* Bottom 4-step drafting strip to anchor the full screen */}
      <div
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
                <p className="truncate font-mono text-[11px] text-studio-muted">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
