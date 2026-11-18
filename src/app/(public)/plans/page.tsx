"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Clock3,
  RefreshCw,
  ShieldCheck,
  Zap,
} from "lucide-react";
import AnimationWrapper from "@/components/common/animation-wrapper";
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
    description:
      "Try AI-assisted vectorization and inspect paths in the Studio.",
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
    description:
      "Unlimited high-precision vector exports for designers & teams.",
    badge: "Most popular",
    highlighted: true,
    features: [
      "Unlimited SVG, PNG (up to 4x), PDF, EPS, and DXF exports",
      "Vectorizer AI precision tracing engine",
      "Full color palette & curve tuning controls",
      "Priority processing queue",
    ],
  },
};

const PLAN_ORDER: UserPlan[] = ["FREE", "PRO"];

const formatBdt = (amount: number) => `৳${amount.toLocaleString("en-US")}`;

const BOTTOM_NOTES = [
  {
    num: "01",
    title: "Preview for free",
    desc: "Tune colors & curves — previews never spend credits",
    accent: "text-sky-400",
  },
  {
    num: "02",
    title: "1 credit per export",
    desc: "Starter credits included on sign-up, no card needed",
    accent: "text-[#f6d55c]",
  },
  {
    num: "03",
    title: "Pro = unlimited",
    desc: "Remove credit limits + priority processing queue",
    accent: "text-emerald-400",
  },
];

export default function PlansPage() {
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
    <section className="relative flex min-h-dvh lg:h-dvh flex-col justify-between overflow-hidden bg-studio-surface pt-20 pb-5">
      {/* Dot-grid notebook background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 vk-dot-grid opacity-40"
      />

      <div
        className={cn(
          "relative mx-auto my-auto w-full",
          CONTAINER_MAX_WIDTH,
          CONTAINER_GUTTER,
        )}
      >
        {/* Compact Sketch Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs tracking-wider text-studio-muted">
              <span className="text-studio-muted/60">{"//"}</span> Plans &amp;
              credits · Vectorizer API
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-studio-foreground sm:text-4xl lg:text-[2.75rem]">
              Simple pricing,{" "}
              <span className="inline-block -rotate-1 bg-[#f6d55c] px-2.5 py-0.5 text-[#1e1f22] shadow-[3px_3px_0_0_rgba(0,0,0,0.35)]">
                zero guesswork
              </span>
              .
            </h1>
          </div>

          <div className="flex flex-col items-start gap-1 sm:items-end">
            <span className="-rotate-2 font-[family-name:var(--font-hand)] text-xl text-indigo-400">
              previews are always free ↗
            </span>
            <p className="flex items-center gap-1.5 font-mono text-xs text-studio-muted">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              Credits are only spent when you export.
            </p>
          </div>
        </div>

        {/* Pending Payment Banner */}
        {pendingRequest && (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-studio-foreground">
              <Clock3 className="size-4 shrink-0 text-amber-400" />
              <span>
                Your <strong>{pendingRequest.plan}</strong> payment (
                {formatBdt(pendingRequest.amount)}) is under review.
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

        {/* Plan Cards */}
        {isLoading ? (
          <div className="mx-auto mt-6 grid max-w-5xl items-stretch gap-6 lg:grid-cols-2">
            {PLAN_ORDER.map((code) => (
              <div
                key={code}
                className="h-[380px] animate-pulse rounded-2xl border border-studio-border bg-studio-panel/60"
              />
            ))}
          </div>
        ) : isError || !plans ? (
          <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-dashed border-studio-border bg-studio-panel p-10 text-center">
            <p className="text-sm text-studio-muted">
              Pricing could not be loaded right now.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="size-4" />
              Try again
            </Button>
          </div>
        ) : (
          <div className="mx-auto mt-6 grid max-w-5xl items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
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
                  className="relative h-full"
                >
                  {/* Stacked sheet & masking tape on PRO card */}
                  {copy.highlighted && (
                    <>
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 translate-x-2 translate-y-2 rotate-1 rounded-2xl border border-studio-border bg-studio-panel/60"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute -top-3 left-1/2 z-20 h-6 w-24 -translate-x-1/2 -rotate-2 bg-[#d4b84a]/85 shadow-sm"
                      />
                    </>
                  )}

                  <article
                    className={cn(
                      "relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-transform duration-200",
                      copy.highlighted
                        ? "border-[#f6d55c]/45 bg-studio-panel shadow-2xl"
                        : "border-studio-border bg-studio-panel/85 hover:-translate-y-0.5",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-mono text-[10px] tracking-[0.2em] text-studio-muted uppercase">
                          {copy.code}
                        </span>
                        <h2 className="mt-1 font-heading text-xl font-bold tracking-tight text-studio-foreground">
                          {plan.label}
                        </h2>
                      </div>

                      {isCurrentPlan ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-emerald-400 uppercase">
                          <Check className="size-3" />
                          Current plan
                        </span>
                      ) : (
                        copy.badge && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#f6d55c]/50 bg-[#f6d55c]/15 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-[#f6d55c] uppercase">
                            <Zap className="size-3" />
                            {copy.badge}
                          </span>
                        )
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-4xl font-bold tracking-tight text-studio-foreground">
                          {formatBdt(
                            isFree ? 0 : (monthlyPrice?.amountBdt ?? 0),
                          )}
                        </span>
                        <span className="font-mono text-xs tracking-wider text-studio-muted uppercase">
                          {isFree ? "starter credits" : monthlyPrice?.period}
                        </span>
                      </div>

                      {!isFree && yearlyPrice ? (
                        <p className="mt-1 font-mono text-xs text-studio-muted">
                          or {formatBdt(yearlyPrice.amountBdt)}{" "}
                          {yearlyPrice.period}
                          {yearlySaving > 0 && (
                            <span className="text-emerald-400">
                              {" "}
                              · save {formatBdt(yearlySaving)}
                            </span>
                          )}
                        </p>
                      ) : (
                        <p className="mt-1 font-mono text-xs text-studio-muted">
                          No credit card required
                        </p>
                      )}
                    </div>

                    <p className="mt-3 text-sm leading-5 text-studio-muted">
                      {copy.description}
                    </p>

                    <div
                      aria-hidden="true"
                      className="my-4 border-t border-dashed border-studio-border"
                    />

                    <ul className="flex-1 space-y-2.5 text-sm">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <span
                            className={cn(
                              "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                              copy.highlighted
                                ? "bg-[#f6d55c]/20 text-[#f6d55c]"
                                : "bg-emerald-400/15 text-emerald-400",
                            )}
                          >
                            <Check className="size-2.5" strokeWidth={3} />
                          </span>
                          <span className="text-studio-muted">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {isFree ? (
                      <Link
                        href={freeHref}
                        className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-studio-border bg-studio-surface px-5 text-sm font-medium text-studio-foreground transition-colors hover:border-studio-muted/60 hover:bg-accent"
                      >
                        <span>
                          {user ? "Go to Studio" : "Get Started Free"}
                        </span>
                        <ArrowRight className="size-4" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={isCurrentPlan || userLoading}
                        onClick={() => handlePaidPlanClick(plan)}
                        className={cn(
                          "mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-transform",
                          isCurrentPlan
                            ? "cursor-default border border-studio-border bg-studio-surface text-studio-muted"
                            : "bg-[#f6d55c] text-[#1e1f22] shadow-[0_3px_0_0_rgba(0,0,0,0.35)] hover:-translate-y-0.5 hover:bg-[#f8dc72] active:translate-y-0 disabled:opacity-60",
                        )}
                      >
                        {!isCurrentPlan && (
                          <span className="size-1.5 rounded-full bg-[#1e1f22]" />
                        )}
                        <span>
                          {isCurrentPlan ? "Current plan" : "Upgrade to Pro"}
                        </span>
                        {!isCurrentPlan && <ArrowRight className="size-4" />}
                      </button>
                    )}
                  </article>
                </AnimationWrapper>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom 3-step drafting strip */}
      <div
        className={cn(
          "relative mx-auto hidden w-full lg:block",
          CONTAINER_MAX_WIDTH,
          CONTAINER_GUTTER,
        )}
      >
        <div className="grid grid-cols-3 gap-6 border-t border-dashed border-studio-border/80 pt-3.5">
          {BOTTOM_NOTES.map((item) => (
            <div key={item.num} className="flex items-baseline gap-2.5">
              <span className={cn("font-mono text-xs font-bold", item.accent)}>
                {item.num}
              </span>
              <div className="min-w-0">
                <p className="font-heading text-sm font-semibold text-studio-foreground">
                  {item.title}
                </p>
                <p className="truncate font-mono text-[11px] text-studio-muted">
                  {item.desc}
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
