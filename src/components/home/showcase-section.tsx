import Link from "next/link";
import { ArrowRight, MousePointerClick, Pencil, ScanSearch, ZoomIn } from "lucide-react";
import AnimationWrapper from "@/components/common/animation-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { BeforeAfterSlider } from "./before-after-slider";

const HIGHLIGHTS = [
  {
    icon: MousePointerClick,
    text: "Drag the divider to wipe between the raster and its traced vector.",
  },
  {
    icon: ZoomIn,
    text: "Zoom stays synced across both panes, so corners line up exactly.",
  },
  {
    icon: ScanSearch,
    text: "Flip on the cyan wireframe to see every contour the engine drew.",
  },
  {
    icon: Pencil,
    text: "Nudge a path by hand, delete stray fragments, then save it to the SVG.",
  },
];

export function ShowcaseSection() {
  return (
    <section id="showcase" className="relative overflow-hidden py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-muted/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 size-[26rem] rounded-full bg-primary/10 blur-[110px]"
      />

      <div
        className={cn(
          "relative mx-auto w-full",
          CONTAINER_MAX_WIDTH,
          CONTAINER_GUTTER,
        )}
      >
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <AnimationWrapper direction="right" className="max-w-lg">
            <Badge variant="secondary">Inside the studio</Badge>

            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              See every path{" "}
              <span className="text-primary">before you export</span>.
            </h2>

            <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
              The canvas starts split: your original raster on one side, the
              traced vector on the other. Wipe, zoom, and inspect — then export
              only when it is right.
            </p>

            <ul className="mt-7 space-y-4">
              {HIGHLIGHTS.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
                    <item.icon className="size-4" />
                  </span>
                  <span className="text-sm leading-6 text-muted-foreground">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              size="xl"
              className="mt-8"
              render={<Link href="/studio" />}
            >
              Try it with your own image
              <ArrowRight className="size-4" />
            </Button>
          </AnimationWrapper>

          <AnimationWrapper direction="left" delay={0.1}>
            <BeforeAfterSlider />
          </AnimationWrapper>
        </div>
      </div>
    </section>
  );
}
