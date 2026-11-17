import Link from "next/link";
import {
  ArrowRight,
  Check,
  CreditCard,
  Gauge,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import AnimationWrapper from "@/components/common/animation-wrapper";
import { PageHero, TitleAccent } from "@/components/common/page-hero";
import { Button } from "@/components/ui/button";
import { CtaSection } from "@/components/home/cta-section";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    code: "PLAN 01",
    price: "$0",
    period: "starter credits",
    description: "Try AI-assisted vectorization and inspect paths in the Studio.",
    badge: null,
    features: [
      "5 free export credits on sign-up",
      "Full Studio preview & magnifier loupe",
      "Manual anchor & path editing",
      "Clean SVG, PNG, and PDF downloads",
    ],
    ctaLabel: "Get Started Free",
    href: "/auth/register",
    highlighted: false,
  },
  {
    name: "Pro",
    code: "PLAN 02",
    price: "$12",
    period: "per month",
    description: "Unlimited high-precision vector exports for designers & teams.",
    badge: "Most popular",
    features: [
      "Unlimited SVG, PNG (up to 4x), and PDF exports",
      "AI 4x Super-Resolution + Potrace / Rust VTracer",
      "Full color palette & curve tuning controls",
      "Priority processing queue",
    ],
    ctaLabel: "Launch Studio",
    href: "/studio",
    highlighted: true,
  },
  {
    name: "API",
    code: "PLAN 03",
    price: "$39",
    period: "per month",
    description: "Automated raster-to-vector pipelines for apps and workflows.",
    badge: null,
    features: [
      "REST API access for batch processing",
      "Deterministic SVGO path optimization",
      "Custom tuning presets per request",
      "Dedicated support channel",
    ],
    ctaLabel: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

const CREDIT_STEPS = [
  {
    icon: Sparkles,
    title: "Preview for free",
    description:
      "Tune colors, smoothing, and corners with a live split-canvas preview. Previews never spend credits.",
  },
  {
    icon: CreditCard,
    title: "Export with credits",
    description:
      "Each export costs one credit. Free accounts start with five — no card required.",
  },
  {
    icon: Gauge,
    title: "Scale without limits",
    description:
      "Pro removes credit counts and adds priority processing for teams and high-volume work.",
  },
];

function CreditsCard() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="vk-float relative rounded-2xl border border-studio-border bg-studio-surface/95 shadow-[0_40px_120px_-30px_rgba(2,6,23,0.85)] backdrop-blur"
      >
        <div className="flex items-center gap-2 border-b border-studio-border/70 px-3 py-2.5">
          <span className="size-2 rounded-full bg-[#ff5f57]/80" />
          <span className="size-2 rounded-full bg-[#febc2e]/80" />
          <span className="size-2 rounded-full bg-[#28c840]/80" />
          <span className="mx-2 h-4 w-px bg-studio-border/70" />
          <span className="truncate font-mono text-[11px] text-studio-muted">
            vectorizer / credits
          </span>
          <span className="ml-auto rounded-full border border-trace/30 bg-trace/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-trace">
            FREE
          </span>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <span className="font-mono text-[10px] tracking-[0.2em] text-studio-muted uppercase">
              Available credits
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-heading text-5xl font-bold tracking-tight text-studio-foreground">
                5
              </span>
              <span className="text-sm text-studio-muted">exports on sign-up</span>
            </div>
            <div className="mt-4 flex gap-1.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-trace/80 to-primary/80"
                />
              ))}
            </div>
          </div>

          <ul className="space-y-2.5 border-t border-studio-border/70 pt-4 text-sm">
            <li className="flex items-center justify-between gap-3">
              <span className="text-studio-muted">Preview &amp; tuning</span>
              <span className="font-mono text-[11px] tracking-wider text-trace uppercase">
                Free
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-studio-muted">Each export</span>
              <span className="font-mono text-[11px] tracking-wider text-studio-foreground uppercase">
                1 credit
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-studio-muted">Formats</span>
              <span className="font-mono text-[11px] tracking-wider text-studio-muted uppercase">
                SVG · PDF · EPS · DXF
              </span>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-2 border-t border-studio-border/70 px-4 py-2.5 text-[11px] text-studio-muted">
          <ShieldCheck className="size-3.5 text-trace" />
          Credits are only spent when you export.
        </div>
      </div>
    </div>
  );
}

export default function PlansPage() {
  return (
    <>
      <PageHero
        badge="Plans & credits"
        badgeIcon={CreditCard}
        title={
          <>
            Simple pricing,{" "}
            <TitleAccent id="plans-underline">studio-grade output.</TitleAccent>
          </>
        }
        description="Preview and fine-tune every image for free in the Studio. Use credits or upgrade when you are ready to export production-ready artwork."
        points={[
          "5 free exports on sign-up",
          "No card required",
          "SVG · PDF · EPS · DXF",
        ]}
      >
        <CreditsCard />
      </PageHero>

      <section id="pricing" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="vk-dot-grid vk-dot-fade pointer-events-none absolute inset-0 opacity-40"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/4 -right-40 size-96 rounded-full bg-primary/5 blur-3xl"
        />

        <div
          className={cn(
            "relative mx-auto w-full py-16 sm:py-20",
            CONTAINER_MAX_WIDTH,
            CONTAINER_GUTTER,
          )}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-trace" />
                Compare plans
              </p>
              <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Three ways to vectorize.
              </h2>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              A credit is used only when you export — never for previews.
            </p>
          </div>

          <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
            {PLANS.map((plan, index) => (
              <AnimationWrapper key={plan.name} delay={index * 0.08} className="h-full">
                <article
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300",
                    plan.highlighted
                      ? "border-studio-border bg-studio-surface text-studio-foreground shadow-[0_30px_90px_-30px_rgba(2,6,23,0.6)]"
                      : "border-border/70 bg-card/80 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_60px_-28px_color-mix(in_oklch,var(--primary),transparent_55%)]",
                  )}
                >
                  {plan.highlighted && (
                    <>
                      <div
                        aria-hidden="true"
                        className="vk-blueprint-grid absolute inset-0 opacity-50"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute -top-16 -right-16 size-48 rounded-full bg-primary/25 blur-3xl"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute -bottom-20 -left-16 size-48 rounded-full bg-trace/10 blur-3xl"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-trace/60 to-transparent"
                      />
                    </>
                  )}

                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <span
                        className={cn(
                          "font-mono text-[10px] tracking-[0.2em] uppercase",
                          plan.highlighted
                            ? "text-studio-muted"
                            : "text-muted-foreground/60",
                        )}
                      >
                        {plan.code}
                      </span>
                      <h3
                        className={cn(
                          "mt-1 font-heading text-lg font-semibold tracking-tight",
                          plan.highlighted
                            ? "text-studio-foreground"
                            : "text-foreground",
                        )}
                      >
                        {plan.name}
                      </h3>
                    </div>
                    {plan.badge && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-trace/30 bg-trace/10 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-trace uppercase">
                        <Zap className="size-3" />
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="relative mt-5 flex items-baseline gap-1.5">
                    <span
                      className={cn(
                        "font-heading text-4xl font-bold tracking-tight",
                        plan.highlighted
                          ? "text-studio-foreground"
                          : "text-foreground",
                      )}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[11px] tracking-wider uppercase",
                        plan.highlighted
                          ? "text-studio-muted"
                          : "text-muted-foreground",
                      )}
                    >
                      {plan.period}
                    </span>
                  </div>

                  <p
                    className={cn(
                      "relative mt-2 text-sm leading-6",
                      plan.highlighted
                        ? "text-studio-muted"
                        : "text-muted-foreground",
                    )}
                  >
                    {plan.description}
                  </p>

                  <div
                    aria-hidden="true"
                    className={cn(
                      "relative my-5 h-px w-full",
                      plan.highlighted
                        ? "bg-studio-border/70"
                        : "bg-border/70",
                    )}
                  />

                  <ul className="relative flex-1 space-y-2.5 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <span
                          className={cn(
                            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                            plan.highlighted
                              ? "bg-trace/15 text-trace"
                              : "bg-primary/10 text-primary",
                          )}
                        >
                          <Check className="size-2.5" strokeWidth={3} />
                        </span>
                        <span
                          className={
                            plan.highlighted
                              ? "text-studio-muted"
                              : "text-muted-foreground"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.highlighted ? "default" : "outline"}
                    size="lg"
                    className="relative mt-7 w-full"
                    render={<Link href={plan.href} />}
                  >
                    <span>{plan.ctaLabel}</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </article>
              </AnimationWrapper>
            ))}
          </div>

          <div className="mt-12 grid gap-6 rounded-2xl border border-border/70 bg-card/60 p-6 sm:p-8 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-border/70 lg:p-0">
            {CREDIT_STEPS.map((step, index) => (
              <div
                key={step.title}
                className="flex items-start gap-4 lg:px-8 lg:py-8"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-gradient-to-br from-primary/15 via-primary/5 to-trace/10 text-primary">
                  <step.icon className="size-4.5" />
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 font-heading text-sm font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
