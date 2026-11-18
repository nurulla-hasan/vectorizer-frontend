"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Clock3,
  CreditCard,
  Gauge,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { PageHero, TitleAccent } from "@/components/common/page-hero";
import AnimationWrapper from "@/components/common/animation-wrapper";
import { CtaSection } from "@/components/home/cta-section";
import { UpgradePlanDialog } from "@/components/subscription/upgrade-plan-dialog";
import { Button } from "@/components/ui/button";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";
import {
  useGetMe,
  useMyPaymentRequests,
  usePlans,
  type PlanDefinition,
  type UserPlan,
} from "@/services";

const PLAN_COPY: Record<
  UserPlan,
  {
    code: string;
    description: string;
    badge: string | null;
    highlighted: boolean;
    features: string[];
  }
> = {
  FREE: {
    code: "PLAN 01",
    description: "Try AI-assisted vectorization and inspect paths in the Studio.",
    badge: null,
    highlighted: false,
    features: [
      "Full Studio preview & magnifier loupe",
      "Manual anchor & path editing",
      "Clean SVG, PNG, PDF, EPS, and DXF downloads",
    ],
  },
  PRO: {
    code: "PLAN 02",
    description: "Unlimited high-precision vector exports for designers & teams.",
    badge: "Most popular",
    highlighted: true,
    features: [
      "Unlimited SVG, PNG (up to 4x), PDF, EPS, and DXF exports",
      "AI 4x Super-Resolution + Potrace / Rust VTracer",
      "Full color palette & curve tuning controls",
      "Priority processing queue",
    ],
  },
};

const PLAN_ORDER: UserPlan[] = ["FREE", "PRO"];

const formatBdt = (amount: number) => `৳${amount.toLocaleString("en-US")}`;

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
      "Each export costs one credit. Free accounts start with starter credits — no card required.",
  },
  {
    icon: Gauge,
    title: "Scale without limits",
    description:
      "Pro removes credit counts and adds priority processing for teams and high-volume work.",
  },
];

function CreditsCard({ credits }: { credits: number }) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="vk-float relative rounded-2xl border border-studio-border bg-studio-surface/95 shadow-[0_40px_120px_-30px_color-mix(in_oklch,var(--shadow-color),transparent_80%)] backdrop-blur"
      >
        <div className="flex items-center gap-2 border-b border-studio-border/70 px-3 py-2.5">
          <span className="size-2 rounded-full bg-dot-close/80" />
          <span className="size-2 rounded-full bg-dot-min/80" />
          <span className="size-2 rounded-full bg-dot-max/80" />
          <span className="mx-2 h-4 w-px bg-studio-border/70" />
          <span className="truncate font-mono text-[11px] text-studio-muted">
            tracecraft / credits
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
                {credits > 0 ? credits : "—"}
              </span>
              <span className="text-sm text-studio-muted">exports on sign-up</span>
            </div>
            <div className="mt-4 flex gap-1.5" aria-hidden="true">
              {Array.from({ length: Math.min(credits, 10) }).map((_, index) => (
                <span
                  key={index}
                  className="h-1.5 flex-1 rounded-full bg-linear-to-r from-trace/80 to-primary/80"
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

function PricingSection() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetMe();
  const { data: plans, isLoading, isError, refetch } = usePlans();
  const { data: myRequests = [] } = useMyPaymentRequests({
    enabled: Boolean(user),
  });
  const [selectedPlan, setSelectedPlan] = React.useState<PlanDefinition | null>(
    null,
  );

  const pendingRequest = user
    ? myRequests.find((request) => request.status === "PENDING")
    : undefined;

  const planByCode = React.useMemo(
    () => new Map((plans ?? []).map((plan) => [plan.code, plan])),
    [plans],
  );

  const handlePaidPlanClick = (plan: PlanDefinition) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setSelectedPlan(plan);
  };

  return (
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
              Two ways to vectorize.
            </h2>
          </div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            A credit is used only when you export — never for previews.
          </p>
        </div>

        {pendingRequest && (
          <div className="mt-8 flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2">
              <Clock3 className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                Your <strong>{pendingRequest.plan}</strong> payment (
                {formatBdt(pendingRequest.amount)}) is under review. We will
                activate the plan as soon as an admin verifies it.
              </span>
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const requestedPlan = planByCode.get(pendingRequest.plan);
                if (requestedPlan) setSelectedPlan(requestedPlan);
              }}
            >
              View status
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="mx-auto mt-10 grid max-w-4xl items-stretch gap-5 lg:grid-cols-2">
            {PLAN_ORDER.map((code) => (
              <div
                key={code}
                className="h-125 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        ) : isError || !plans ? (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Pricing could not be loaded right now.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="size-4" />
              Try again
            </Button>
          </div>
        ) : (
          <div className="mx-auto mt-10 grid max-w-4xl items-stretch gap-5 lg:grid-cols-2">
            {PLAN_ORDER.map((code, index) => {
              const plan = planByCode.get(code);
              if (!plan) return null;

              const copy = PLAN_COPY[code];
              const isCurrentPlan = user?.plan === code;
              const isFree = code === "FREE";
              const freeHref = user ? "/studio" : "/auth/register";
              const features = isFree
                ? [
                    `${plan.creditsLimit ?? 0} free export credits on sign-up`,
                    ...copy.features,
                  ]
                : copy.features;
              const monthlyPrice = plan.prices.find(
                (price) => price.billingCycle === "MONTHLY",
              );
              const yearlyPrice = plan.prices.find(
                (price) => price.billingCycle === "YEARLY",
              );
              const yearlySaving =
                monthlyPrice && yearlyPrice
                  ? monthlyPrice.amountBdt * 12 - yearlyPrice.amountBdt
                  : 0;

              return (
                <AnimationWrapper
                  key={plan.code}
                  delay={index * 0.08}
                  className="h-full"
                >
                  <article
                    className={cn(
                      "group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300",
                      copy.highlighted
                        ? "border-studio-border bg-studio-surface text-studio-foreground shadow-[0_30px_90px_-30px_color-mix(in_oklch,var(--shadow-color),transparent_82%)]"
                        : "border-border/70 bg-card/80 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_60px_-28px_color-mix(in_oklch,var(--primary),transparent_55%)]",
                    )}
                  >
                    {copy.highlighted && (
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
                          className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-trace/60 to-transparent"
                        />
                      </>
                    )}

                    <div className="relative flex items-start justify-between gap-3">
                      <div>
                        <span
                          className={cn(
                            "font-mono text-[10px] tracking-[0.2em] uppercase",
                            copy.highlighted
                              ? "text-studio-muted"
                              : "text-muted-foreground/60",
                          )}
                        >
                          {copy.code}
                        </span>
                        <h3
                          className={cn(
                            "mt-1 font-heading text-lg font-semibold tracking-tight",
                            copy.highlighted
                              ? "text-studio-foreground"
                              : "text-foreground",
                          )}
                        >
                          {plan.label}
                        </h3>
                      </div>
                      {isCurrentPlan ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                          <Check className="size-3" />
                          Current plan
                        </span>
                      ) : (
                        copy.badge && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-trace/30 bg-trace/10 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-trace uppercase">
                            <Zap className="size-3" />
                            {copy.badge}
                          </span>
                        )
                      )}
                    </div>

                    <div className="relative mt-5">
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={cn(
                            "font-heading text-4xl font-bold tracking-tight",
                            copy.highlighted
                              ? "text-studio-foreground"
                              : "text-foreground",
                          )}
                        >
                          {formatBdt(isFree ? 0 : (monthlyPrice?.amountBdt ?? 0))}
                        </span>
                        <span
                          className={cn(
                            "font-mono text-[11px] tracking-wider uppercase",
                            copy.highlighted
                              ? "text-studio-muted"
                              : "text-muted-foreground",
                          )}
                        >
                          {isFree ? "starter credits" : monthlyPrice?.period}
                        </span>
                      </div>
                      {!isFree && yearlyPrice && (
                        <p
                          className={cn(
                            "mt-1 text-xs",
                            copy.highlighted
                              ? "text-studio-muted"
                              : "text-muted-foreground",
                          )}
                        >
                          or {formatBdt(yearlyPrice.amountBdt)}{" "}
                          {yearlyPrice.period}
                          {yearlySaving > 0 && (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              {" "}
                              · save {formatBdt(yearlySaving)}
                            </span>
                          )}
                        </p>
                      )}
                    </div>

                    <p
                      className={cn(
                        "relative mt-2 text-sm leading-6",
                        copy.highlighted
                          ? "text-studio-muted"
                          : "text-muted-foreground",
                      )}
                    >
                      {copy.description}
                    </p>

                    <div
                      aria-hidden="true"
                      className={cn(
                        "relative my-5 h-px w-full",
                        copy.highlighted
                          ? "bg-studio-border/70"
                          : "bg-border/70",
                      )}
                    />

                    <ul className="relative flex-1 space-y-2.5 text-sm">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <span
                            className={cn(
                              "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                              copy.highlighted
                                ? "bg-trace/15 text-trace"
                                : "bg-primary/10 text-primary",
                            )}
                          >
                            <Check className="size-2.5" strokeWidth={3} />
                          </span>
                          <span
                            className={
                              copy.highlighted
                                ? "text-studio-muted"
                                : "text-muted-foreground"
                            }
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {isFree ? (
                      <Button
                        variant={copy.highlighted ? "default" : "outline"}
                        size="lg"
                        className="relative mt-7 w-full"
                        render={<Link href={freeHref} />}
                      >
                        <span>
                          {user ? "Go to Studio" : "Get Started Free"}
                        </span>
                        <ArrowRight className="size-4" />
                      </Button>
                    ) : (
                      <Button
                        variant={
                          isCurrentPlan
                            ? "secondary"
                            : copy.highlighted
                              ? "default"
                              : "outline"
                        }
                        size="lg"
                        className="relative mt-7 w-full disabled:opacity-100"
                        disabled={isCurrentPlan || userLoading}
                        onClick={() => handlePaidPlanClick(plan)}
                      >
                        <span>
                          {isCurrentPlan ? "Current plan" : "Upgrade plan"}
                        </span>
                        {!isCurrentPlan && <ArrowRight className="size-4" />}
                      </Button>
                    )}
                  </article>
                </AnimationWrapper>
              );
            })}
          </div>
        )}

        <div className="mt-12 grid gap-6 rounded-2xl border border-border/70 bg-card/60 p-6 sm:p-8 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-border/70 lg:p-0">
          {CREDIT_STEPS.map((step, index) => (
            <div
              key={step.title}
              className="flex items-start gap-4 lg:px-8 lg:py-8"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-linear-to-br from-primary/15 via-primary/5 to-trace/10 text-primary">
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

      <UpgradePlanDialog
        key={selectedPlan?.code ?? "closed"}
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </section>
  );
}

export default function PlansPage() {
  const { data: plans } = usePlans();
  const freeCredits =
    plans?.find((plan) => plan.code === "FREE")?.creditsLimit ?? 0;

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
          freeCredits > 0
            ? `${freeCredits} free exports on sign-up`
            : "Free starter credits on sign-up",
          "No card required",
          "SVG · PDF · EPS · DXF",
        ]}
      >
        <CreditsCard credits={freeCredits} />
      </PageHero>

      <PricingSection />

      <CtaSection />
    </>
  );
}
