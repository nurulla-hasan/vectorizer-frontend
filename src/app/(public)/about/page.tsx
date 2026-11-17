import { Cpu, Layers, ScanSearch, Sparkles, type LucideIcon } from "lucide-react";
import AnimationWrapper from "@/components/common/animation-wrapper";
import { PageHero, TitleAccent } from "@/components/common/page-hero";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CtaSection } from "@/components/home/cta-section";
import { VectorGem } from "@/components/home/gem-art";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";

const HIGHLIGHTS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Sparkles,
    title: "AI 4x Reconstruction",
    description:
      "Blurry anti-aliased raster edges and narrow crevices are reconstructed at 4x resolution before tracing for razor-sharp contours.",
  },
  {
    icon: Cpu,
    title: "Dual Bézier & Rust Engines",
    description:
      "Monochrome line art routes to precision cubic Bézier tracing while multi-color illustrations run through native Rust VTracer.",
  },
  {
    icon: Layers,
    title: "Interactive Studio Editing",
    description:
      "Inspect paths under the magnifier loupe, toggle wireframe overlays, tweak anchor points directly, and export clean SVG, PNG, or PDF.",
  },
];

const PRINCIPLES = [
  {
    title: "Real paths, not approximations",
    description:
      "Every contour becomes editable Bézier geometry you can inspect, tune, and fix.",
  },
  {
    title: "Your edits, exactly as made",
    description:
      "Nudge anchors, delete stray fragments, save — no silent re-tracing on top of your work.",
  },
  {
    title: "Exports that drop in anywhere",
    description:
      "SVG, PDF, EPS, and DXF files ready for design tools, print production, and CAD.",
  },
];

const STATS = [
  { value: "3", label: "tracing engines" },
  { value: "4", label: "export formats" },
  { value: "100%", label: "editable paths" },
  { value: "0", label: "design software" },
];

function PrinciplesPanel() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="relative overflow-hidden rounded-2xl border border-studio-border bg-studio-surface/95 shadow-[0_40px_120px_-30px_color-mix(in_oklch,var(--shadow-color),transparent_80%)] backdrop-blur"
      >
        <VectorGem
          idPrefix="about-gem"
          className="pointer-events-none absolute -right-10 -bottom-12 w-52 opacity-20"
        />

        <div className="flex items-center gap-2 border-b border-studio-border/70 px-3 py-2.5">
          <span className="size-2 rounded-full bg-dot-close/80" />
          <span className="size-2 rounded-full bg-dot-min/80" />
          <span className="size-2 rounded-full bg-dot-max/80" />
          <span className="mx-2 h-4 w-px bg-studio-border/70" />
          <span className="truncate font-mono text-[11px] text-studio-muted">
            vectorizer / principles.txt
          </span>
          <span className="ml-auto rounded-full border border-trace/30 bg-trace/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-trace">
            FYI
          </span>
        </div>

        <ol className="relative space-y-5 p-5">
          {PRINCIPLES.map((principle, index) => (
            <li key={principle.title} className="flex gap-4">
              <span className="mt-0.5 font-mono text-[11px] tracking-widest text-trace/80">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="font-heading text-sm font-semibold text-studio-foreground">
                  {principle.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-studio-muted">
                  {principle.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="relative flex items-center gap-2 border-t border-studio-border/70 px-4 py-2.5 text-[11px] text-studio-muted">
          <ScanSearch className="size-3.5 text-trace" />
          No gray halos · No jagged staircases · No guesswork
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        badge="About Vectorizer"
        badgeIcon={Sparkles}
        title={
          <>
            Built for clean,{" "}
            <TitleAccent id="about-underline">
              production-ready vectors.
            </TitleAccent>
          </>
        }
        description="Vectorizer turns PNG, JPG, and WebP artwork into crisp, editable SVG paths without concentric gray halos or jagged staircases."
        contentClassName="max-w-2xl"
        points={[
          "AI-assisted reconstruction",
          "Dual tracing engines",
          "100% editable exports",
        ]}
      >
        <PrinciplesPanel />
      </PageHero>

      <section className="border-b border-border/70">
        <div
          className={cn(
            "mx-auto w-full py-10",
            CONTAINER_MAX_WIDTH,
            CONTAINER_GUTTER,
          )}
        >
          <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dd className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-muted/40"
        />
        <div
          aria-hidden="true"
          className="vk-dot-grid vk-dot-fade pointer-events-none absolute inset-0 opacity-30"
        />

        <div
          className={cn(
            "relative mx-auto w-full",
            CONTAINER_MAX_WIDTH,
            CONTAINER_GUTTER,
          )}
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-trace" />
              Under the hood
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Engineered for crisp contours
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Reconstruction, tracing, and editing work together — so the vector
              you export is the vector you saw in the loupe.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {HIGHLIGHTS.map((item, index) => (
              <AnimationWrapper key={item.title} delay={index * 0.08} className="h-full">
                <Card className="group relative h-full overflow-hidden rounded-2xl border-border/70 bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_60px_-28px_color-mix(in_oklch,var(--primary),transparent_55%)]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <CardHeader className="relative gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex size-11 items-center justify-center rounded-xl border border-primary/15 bg-gradient-to-br from-primary/15 via-primary/5 to-trace/10 text-primary shadow-sm">
                        <item.icon className="size-5" />
                      </div>
                      <span className="font-mono text-[11px] tracking-widest text-muted-foreground/50">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <CardTitle className="font-heading text-base font-semibold tracking-tight">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-6">
                        {item.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </AnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
