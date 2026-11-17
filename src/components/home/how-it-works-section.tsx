import { Download, ImageUp, SlidersHorizontal, type LucideIcon } from "lucide-react";
import AnimationWrapper from "@/components/common/animation-wrapper";
import { SectionHeading } from "@/components/common/section-heading";
import { SectionWrapper } from "@/components/common/section-wrapper";

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
    <SectionWrapper id="how-it-works" padding="lg">
      <SectionHeading
        badge="How it works"
        title="From raster to vector in three steps"
        description="No design software required — the heavy lifting happens in the studio."
        descriptionClassName="mt-3"
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {STEPS.map((item, index) => (
          <AnimationWrapper
            key={item.step}
            delay={index * 0.08}
            className="h-full"
          >
            <div className="relative h-full rounded-xl border border-border bg-card p-6">
              <span className="font-mono text-xs font-semibold tracking-widest text-primary">
                {item.step}
              </span>
              <div className="mt-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          </AnimationWrapper>
        ))}
      </div>
    </SectionWrapper>
  );
}
