import {
  ChevronRight,
  Download,
  ImageUp,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import AnimationWrapper from "@/components/common/animation-wrapper";
import { SectionHeading } from "@/components/common/section-heading";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";

interface Step {
  icon: LucideIcon;
  step: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    icon: ImageUp,
    step: "01",
    title: "Upload your artwork",
    description:
      "Drop a PNG, JPG, or WebP up to 5 MB — or paste straight from the clipboard.",
  },
  {
    icon: SlidersHorizontal,
    step: "02",
    title: "Tune the trace",
    description:
      "Balance detail, colors, and smoothing while the raster and vector canvases stay in sync.",
  },
  {
    icon: Download,
    step: "03",
    title: "Export anywhere",
    description:
      "Send production-ready SVG, PDF, EPS, or DXF files to your design or print workflow.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-16 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/3 size-80 rounded-full bg-trace/5 blur-3xl"
      />

      <div
        className={cn(
          "relative mx-auto w-full",
          CONTAINER_MAX_WIDTH,
          CONTAINER_GUTTER,
        )}
      >
        <SectionHeading
          badge="How it works"
          title="From raster to vector in three steps"
          description="No design software required — the heavy lifting happens in the studio."
          descriptionClassName="mt-3"
        />

        <div className="relative mt-12 grid gap-5 md:grid-cols-3">
          <div
            aria-hidden="true"
            className="absolute inset-x-[16%] top-11 hidden border-t border-dashed border-border md:block"
          />
          <ChevronRight
            aria-hidden="true"
            className="absolute top-[2.1rem] left-1/3 hidden size-4 -translate-x-1/2 text-border md:block"
          />
          <ChevronRight
            aria-hidden="true"
            className="absolute top-[2.1rem] left-2/3 hidden size-4 -translate-x-1/2 text-border md:block"
          />

          {STEPS.map((item, index) => (
            <AnimationWrapper
              key={item.step}
              delay={index * 0.08}
              className="relative h-full"
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border/70 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_24px_60px_-30px_color-mix(in_oklch,var(--primary),transparent_60%)]">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 bottom-0 font-heading text-7xl font-bold tracking-tight text-primary/[0.05] select-none"
                >
                  {item.step}
                </span>

                <div className="relative flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                    <item.icon className="size-4.5" />
                  </span>
                  <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
                    Step {item.step}
                  </span>
                </div>

                <h3 className="relative mt-5 font-heading text-base font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="relative mt-1.5 max-w-[34ch] text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </AnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
