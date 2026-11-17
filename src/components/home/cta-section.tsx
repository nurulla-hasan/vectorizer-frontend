import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";
import AnimationWrapper from "@/components/common/animation-wrapper";
import { SectionWrapper } from "@/components/common/section-wrapper";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <SectionWrapper padding="lg">
      <AnimationWrapper direction="none">
        <div className="vk-blueprint-grid relative overflow-hidden rounded-3xl border border-studio-border px-6 py-12 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="absolute -top-16 -right-16 size-64 rounded-full bg-primary/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-20 -left-16 size-64 rounded-full bg-trace/10 blur-3xl"
          />

          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-studio-foreground sm:text-4xl">
              Ready to vectorize?
            </h2>
            <p className="mt-3 text-sm leading-6 text-studio-muted sm:text-base">
              Open the studio, drop an image, and export your first clean vector
              in under a minute. Your first 5 exports are on us.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="xl" render={<Link href="/studio" />}>
                Start vectorizing
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="secondary"
                size="xl"
                render={<Link href="/auth/register" />}
              >
                <UserPlus className="size-4" />
                Create free account
              </Button>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </SectionWrapper>
  );
}
