import Link from "next/link";
import { ArrowRight, CheckCircle2, UserPlus } from "lucide-react";
import AnimationWrapper from "@/components/common/animation-wrapper";
import { SectionWrapper } from "@/components/common/section-wrapper";
import { Button } from "@/components/ui/button";
import { RasterGem, VectorGem } from "./gem-art";

const CTA_POINTS = ["5 free exports", "No card required", "SVG · PDF · EPS · DXF"];

export function CtaSection() {
  return (
    <SectionWrapper padding="lg">
      <AnimationWrapper direction="none">
        <div className="relative overflow-hidden rounded-3xl border border-studio-border bg-studio-surface px-6 py-14 sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="vk-blueprint-grid absolute inset-0 opacity-60"
          />
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-16 size-72 rounded-full bg-primary/30 blur-[90px]"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -left-16 size-72 rounded-full bg-trace/10 blur-[90px]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-trace/50 to-transparent"
          />

          <span aria-hidden="true" className="absolute top-4 left-5 font-mono text-sm text-studio-muted/40">+</span>
          <span aria-hidden="true" className="absolute top-4 right-5 font-mono text-sm text-studio-muted/40">+</span>
          <span aria-hidden="true" className="absolute bottom-4 left-5 font-mono text-sm text-studio-muted/40">+</span>
          <span aria-hidden="true" className="absolute right-5 bottom-4 font-mono text-sm text-studio-muted/40">+</span>

          <VectorGem
            idPrefix="cta-gem"
            className="vk-float-slow pointer-events-none absolute -right-4 -bottom-6 hidden w-48 rotate-12 opacity-50 lg:block"
          />
          <RasterGem className="pointer-events-none absolute top-8 -left-3 hidden w-32 -rotate-6 opacity-30 lg:block" />

          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-trace/25 bg-trace/10 px-3 py-1 text-xs font-medium text-trace">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-trace" />
              5 free exports — no card
            </span>

            <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight text-studio-foreground sm:text-4xl">
              Ready to vectorize?
            </h2>
            <p className="mt-3 text-sm leading-6 text-studio-muted sm:text-base">
              Open the studio, drop an image, and export your first clean vector
              in under a minute.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="xl" render={<Link href="/studio" />}>
                Start vectorizing
                <ArrowRight className="size-4" />
              </Button>
              <Link
                href="/auth/register"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card/70 px-4 text-base font-medium text-studio-foreground transition-colors hover:bg-muted"
              >
                <UserPlus className="size-4" />
                Create free account
              </Link>
            </div>

            <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {CTA_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-1.5 text-xs text-studio-muted sm:text-sm"
                >
                  <CheckCircle2 className="size-3.5 text-trace" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnimationWrapper>
    </SectionWrapper>
  );
}
