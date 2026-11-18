import {
  ClipboardPaste,
  Download,
  LayoutDashboard,
  SlidersHorizontal,
  Sparkles,
  ZoomIn,
  type LucideIcon,
} from "lucide-react";
import AnimationWrapper from "@/components/common/animation-wrapper";
import { SectionHeading } from "@/components/common/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Sparkles,
    title: "AI-assisted tracing",
    description:
      "A hybrid pipeline cleans up noise and reconstructs detail before tracing, so edges stay sharp and colors stay true.",
  },
  {
    icon: LayoutDashboard,
    title: "Dual-canvas comparison",
    description:
      "Raster and vector sit side by side, synced while you zoom — spot every missed corner before you export.",
  },
  {
    icon: ZoomIn,
    title: "Cyan wireframe loupe",
    description:
      "Inspect paths at sub-pixel precision with an overlay that reveals exactly how contours were traced.",
  },
  {
    icon: SlidersHorizontal,
    title: "Fine-grained tuning",
    description:
      "Adjust color count, smoothing, corner sharpening, and engine settings with a live preview after every change.",
  },
  {
    icon: Download,
    title: "Production-ready exports",
    description:
      "Download SVG, PDF, EPS, and DXF files that drop straight into Illustrator, Figma, or your print workflow.",
  },
  {
    icon: ClipboardPaste,
    title: "Drop, paste, done",
    description:
      "Drag an image in or hit Ctrl + V — samples included, so you can try the full studio without hunting for files.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="vk-dot-grid vk-dot-fade pointer-events-none absolute inset-0 opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -left-40 size-96 rounded-full bg-primary/5 blur-3xl"
      />

      <div
        className={cn(
          "relative mx-auto w-full",
          CONTAINER_MAX_WIDTH,
          CONTAINER_GUTTER,
        )}
      >
        <SectionHeading
          badge="Why TraceCraft"
          title="Everything you need to ship clean vectors"
          description="A complete tracing workspace — not just a converter. Compare, tune, and export without leaving the canvas."
          descriptionClassName="mt-3"
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <AnimationWrapper
              key={feature.title}
              delay={index * 0.06}
              className="h-full"
            >
              <Card className="group relative h-full overflow-hidden rounded-2xl border-border/70 bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_60px_-28px_color-mix(in_oklch,var(--primary),transparent_55%)]">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <div
                  aria-hidden="true"
                  className="absolute -top-10 -right-10 size-32 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                <CardContent className="relative flex h-full flex-col gap-4 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl border border-primary/15 bg-gradient-to-br from-primary/15 via-primary/5 to-trace/10 text-primary shadow-sm">
                      <feature.icon className="size-5" />
                    </div>
                    <span className="font-mono text-[11px] tracking-widest text-muted-foreground/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
