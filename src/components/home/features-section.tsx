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
import { SectionWrapper } from "@/components/common/section-wrapper";
import { Card, CardContent } from "@/components/ui/card";

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
    <SectionWrapper id="features" bg="muted" padding="lg">
      <SectionHeading
        badge="Why Vectorizer"
        title="Everything you need to ship clean vectors"
        description="A complete tracing workspace — not just a converter. Compare, tune, and export without leaving the canvas."
        descriptionClassName="mt-3"
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <AnimationWrapper
            key={feature.title}
            delay={index * 0.06}
            className="h-full"
          >
            <Card className="h-full">
              <CardContent className="flex h-full flex-col gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
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
    </SectionWrapper>
  );
}
