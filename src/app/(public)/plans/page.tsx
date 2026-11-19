"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock3,
  Crown,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { UpgradePlanDialog } from "@/components/subscription/upgrade-plan-dialog";
import { Button } from "@/components/ui/button";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";
import {
  useGetMe,
  useMyPaymentRequests,
  usePlans,
  type BillingCycle,
} from "@/services";

const formatBdt = (amount: number) => `৳${amount.toLocaleString("en-US")}`;

const BOTTOM_NOTES = [
  {
    num: "01",
    title: "Preview for free",
    desc: "Tune colors & curves — previews never spend credits",
    accent: "text-trace",
  },
  {
    num: "02",
    title: "1 credit per export",
    desc: "Starter credits included on sign-up, no card needed",
    accent: "text-primary",
  },
  {
    num: "03",
    title: "bKash · Nagad · Rocket",
    desc: "Fast local payments with instant review in Studio",
    accent: "text-dot-max",
  },
];

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function PlansPage() {
  const shouldReduceMotion = useReducedMotion();
  const { data: user, isLoading: userLoading } = useGetMe();
  const { data: plans, isLoading, isError, refetch } = usePlans();
  const { data: myRequests = [] } = useMyPaymentRequests({
    enabled: Boolean(user),
  });

  const pendingRequest = user
    ? myRequests.find((request) => request.status === "PENDING")
    : undefined;

  const approvedProRequest = user
    ? myRequests.find(
        (request) => request.status === "APPROVED" && request.plan === "PRO",
      )
    : undefined;

  const activeProBillingCycle: BillingCycle | null =
    user?.plan === "PRO"
      ? (approvedProRequest?.billingCycle ?? "MONTHLY")
      : null;

  const requestedPendingPlan = pendingRequest
    ? (plans?.find(
        (p) =>
          p.code === pendingRequest.plan &&
          p.billingCycle === pendingRequest.billingCycle,
      ) ?? plans?.find((p) => p.code === pendingRequest.plan) ?? null)
    : null;

  return (
    <section className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-studio-surface pt-24 pb-8">
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
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
          className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-xs tracking-wider text-studio-muted">
                <span className="text-studio-muted/60">{"//"}</span> Plans &amp;
                credits · Vectorizer API
              </p>
              <motion.span
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-medium text-primary"
              >
                <motion.span
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { rotate: [0, 15, -10, 0] }
                  }
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-flex"
                >
                  <Sparkles className="size-3" />
                </motion.span>
                TRANSPARENT CREDITS
              </motion.span>
            </div>
            <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-studio-foreground sm:text-4xl lg:text-5xl">
              Simple pricing,{" "}
              <motion.span
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, scale: 0.85, rotate: -6 }
                }
                animate={{ opacity: 1, scale: 1, rotate: -1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 18,
                  delay: 0.15,
                }}
                whileHover={
                  shouldReduceMotion ? undefined : { rotate: 0, scale: 1.03 }
                }
                className="inline-block -rotate-1 bg-primary px-2.5 py-0.5 text-primary-foreground shadow-md"
              >
                zero guesswork
              </motion.span>
              .
            </h1>
          </div>

          <div className="flex flex-col items-start gap-1 sm:items-end">
            <motion.span
              animate={
                shouldReduceMotion
                  ? undefined
                  : { y: [0, -2.5, 0], rotate: [-2, -0.5, -2] }
              }
              transition={{
                duration: 3.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="-rotate-2 font-hand text-xl text-trace"
            >
              previews are always free ↗
            </motion.span>
            <p className="flex items-center gap-1.5 font-mono text-xs text-studio-muted">
              <ShieldCheck className="size-3.5 text-dot-max" />
              Credits are only spent when you export.
            </p>
          </div>
        </motion.div>

        {/* Pending Payment Banner */}
        {pendingRequest && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="mt-5 flex flex-col gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/10 px-4 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="flex items-center gap-2 text-studio-foreground">
              <Clock3 className="size-4 shrink-0 text-primary" />
              <span>
                Your <strong>{pendingRequest.plan}</strong> payment (
                {formatBdt(pendingRequest.amount)}) is under review.
              </span>
            </p>
            {requestedPendingPlan && (
              <UpgradePlanDialog
                plan={requestedPendingPlan}
                trigger={
                  <Button variant="outline" size="default">
                    View status
                  </Button>
                }
              />
            )}
          </motion.div>
        )}

        {/* 3-Column Plan Cards */}
        {isLoading ? (
          <div className="mt-7 grid items-stretch gap-6 lg:grid-cols-3">
            {["FREE", "PRO-MONTHLY", "PRO-YEARLY"].map((code) => (
              <div
                key={code}
                className="h-96 animate-pulse rounded-2xl border border-studio-border bg-studio-panel/60"
              />
            ))}
          </div>
        ) : isError || !plans ? (
          <div className="mx-auto mt-8 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-dashed border-studio-border bg-studio-panel p-10 text-center">
            <p className="text-sm text-studio-muted">
              Pricing could not be loaded right now.
            </p>
            <Button variant="outline" size="default" onClick={() => refetch()}>
              <RefreshCw className="size-4" />
              Try again
            </Button>
          </div>
        ) : (
          <div className="mt-7 grid items-stretch gap-6 lg:grid-cols-3 lg:gap-7">
            {plans.map((plan, index) => {
              const isFree = plan.code === "FREE";
              const isCurrentPlan = isFree
                ? user?.plan === "FREE"
                : user?.plan === "PRO" &&
                  plan.billingCycle === activeProBillingCycle;
              const isYearly = plan.billingCycle === "YEARLY";
              const isMonthly = plan.billingCycle === "MONTHLY";
              const userOnMonthly =
                user?.plan === "PRO" && activeProBillingCycle === "MONTHLY";
              const userOnYearly =
                user?.plan === "PRO" && activeProBillingCycle === "YEARLY";

              const freeHref = user ? "/studio" : "/auth/register";

              const getButtonText = () => {
                if (isCurrentPlan) return "Current plan";
                if (userOnYearly && isMonthly) return "Included in Yearly";
                if (userOnMonthly && isYearly) return "Upgrade to Pro Yearly";
                if (isYearly) return "Choose Pro Yearly";
                return "Upgrade to Pro Monthly";
              };

              const isButtonDisabled =
                isCurrentPlan ||
                userLoading ||
                (userOnYearly && isMonthly);

              return (
                <motion.div
                  key={plan.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + index * 0.09,
                    ease: EASE_OUT_EXPO,
                  }}
                  whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                  className="relative h-full"
                >
                  {/* Stacked sheet & masking tape on highlighted card */}
                  {plan.highlighted && (
                    <>
                      <motion.div
                        aria-hidden="true"
                        initial={
                          shouldReduceMotion
                            ? false
                            : { opacity: 0, rotate: 0, x: 0, y: 0 }
                        }
                        animate={{ opacity: 1, rotate: 1, x: 8, y: 8 }}
                        transition={{
                          duration: 0.55,
                          delay: 0.25,
                          ease: EASE_OUT_EXPO,
                        }}
                        className="absolute inset-0 rounded-2xl border border-studio-border bg-studio-panel/60"
                      />
                      <motion.div
                        aria-hidden="true"
                        initial={
                          shouldReduceMotion
                            ? false
                            : { opacity: 0, y: -10, rotate: -6 }
                        }
                        animate={{ opacity: 1, y: 0, rotate: -2 }}
                        transition={{
                          type: "spring",
                          stiffness: 280,
                          damping: 20,
                          delay: 0.3,
                        }}
                        className="absolute -top-3 left-1/2 z-20 h-6 w-24 -translate-x-1/2 bg-primary/80 shadow-sm"
                      />
                    </>
                  )}

                  <article
                    className={cn(
                      "relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-shadow duration-200",
                      plan.highlighted
                        ? "border-primary/45 bg-studio-panel shadow-2xl"
                        : isYearly
                          ? "border-dot-max/40 bg-studio-panel/90 shadow-lg"
                          : "border-studio-border bg-studio-panel/85 shadow-lg",
                    )}
                  >
                    {plan.highlighted && (
                      <>
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -top-16 -right-16 size-44 rounded-full bg-primary/10 blur-2xl"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute top-2 left-2 size-1.5 rounded-xs bg-primary/70"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute top-2 right-2 size-1.5 rounded-xs bg-primary/70"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute bottom-2 left-2 size-1.5 rounded-xs bg-primary/70"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute right-2 bottom-2 size-1.5 rounded-xs bg-primary/70"
                        />
                      </>
                    )}

                    <div className="relative flex items-start justify-between gap-3">
                      <div>
                        <span className="font-mono text-xs tracking-widest text-studio-muted uppercase">
                          {plan.stepCode}
                        </span>
                        <h2 className="mt-1 font-heading text-xl font-bold tracking-tight text-studio-foreground">
                          {plan.label}
                        </h2>
                      </div>

                      {isCurrentPlan ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-dot-max/40 bg-dot-max/10 px-2.5 py-0.5 font-mono text-xs tracking-wider text-dot-max uppercase">
                          <Check className="size-3" />
                          Current plan
                        </span>
                      ) : (
                        plan.badge && (
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-xs tracking-wider uppercase",
                              isYearly
                                ? "border-dot-max/40 bg-dot-max/10 text-dot-max"
                                : "border-primary/50 bg-primary/15 text-primary",
                            )}
                          >
                            {isYearly ? (
                              <Crown className="size-3" />
                            ) : (
                              <motion.span
                                animate={
                                  shouldReduceMotion
                                    ? undefined
                                    : {
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 8, -8, 0],
                                      }
                                }
                                transition={{
                                  duration: 2.8,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                                className="inline-flex"
                              >
                                <Zap className="size-3" />
                              </motion.span>
                            )}
                            {plan.badge}
                          </span>
                        )
                      )}
                    </div>

                    <div className="relative mt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-4xl font-bold tracking-tight text-studio-foreground">
                          {formatBdt(plan.amountBdt)}
                        </span>
                        <span className="font-mono text-xs tracking-wider text-studio-muted uppercase">
                          {plan.period}
                        </span>
                      </div>

                      <p
                        className={cn(
                          "mt-1 font-mono text-xs",
                          isYearly ? "text-dot-max" : "text-studio-muted",
                        )}
                      >
                        {plan.subtext}
                      </p>
                    </div>

                    <p className="mt-3 text-sm leading-5 text-studio-muted">
                      {plan.description}
                    </p>

                    <div
                      aria-hidden="true"
                      className="my-4 border-t border-dashed border-studio-border"
                    />

                    <ul className="flex-1 space-y-2.5 text-sm">
                      {plan.features.map((feature, featureIdx) => (
                        <motion.li
                          key={feature}
                          initial={
                            shouldReduceMotion ? false : { opacity: 0, x: -8 }
                          }
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.35,
                            delay: 0.25 + index * 0.08 + featureIdx * 0.04,
                            ease: EASE_OUT_EXPO,
                          }}
                          className="flex items-start gap-2.5"
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                              plan.highlighted
                                ? "bg-primary/20 text-primary"
                                : "bg-dot-max/15 text-dot-max",
                            )}
                          >
                            <Check className="size-2.5" strokeWidth={3} />
                          </span>
                          <span className="text-studio-muted">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {isFree ? (
                      <motion.div
                        whileHover={
                          shouldReduceMotion ? undefined : { scale: 1.02 }
                        }
                        whileTap={
                          shouldReduceMotion ? undefined : { scale: 0.98 }
                        }
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                      >
                        <Link
                          href={freeHref}
                          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-studio-border bg-studio-surface px-5 text-sm font-medium text-studio-foreground transition-colors hover:border-studio-muted/60 hover:bg-accent"
                        >
                          <span>
                            {user ? "Go to Studio" : "Get Started Free"}
                          </span>
                          <ArrowRight className="size-4" />
                        </Link>
                      </motion.div>
                    ) : (
                      <UpgradePlanDialog
                        plan={plan}
                        trigger={
                          <motion.button
                            type="button"
                            disabled={isButtonDisabled}
                            whileHover={
                              shouldReduceMotion || isButtonDisabled
                                ? undefined
                                : { scale: 1.02 }
                            }
                            whileTap={
                              shouldReduceMotion || isButtonDisabled
                                ? undefined
                                : { scale: 0.98 }
                            }
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                            }}
                            className={cn(
                              "mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors",
                              isButtonDisabled
                                ? "cursor-default border border-studio-border bg-studio-surface text-studio-muted"
                                : plan.highlighted
                                  ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                                  : "border border-dot-max/50 bg-dot-max/15 text-studio-foreground hover:bg-dot-max/25",
                            )}
                          >
                            {!isButtonDisabled && plan.highlighted && (
                              <span className="size-1.5 rounded-full bg-primary-foreground" />
                            )}
                            <span>{getButtonText()}</span>
                            {!isButtonDisabled && <ArrowRight className="size-4" />}
                          </motion.button>
                        }
                      />
                    )}
                  </article>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom 3-step drafting strip */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: EASE_OUT_EXPO }}
        className={cn(
          "relative mx-auto mt-8 hidden w-full lg:block",
          CONTAINER_MAX_WIDTH,
          CONTAINER_GUTTER,
        )}
      >
        <div className="grid grid-cols-3 gap-6 border-t border-dashed border-studio-border/80 pt-4">
          {BOTTOM_NOTES.map((item) => (
            <motion.div
              key={item.num}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              className="flex cursor-default items-baseline gap-2.5"
            >
              <span className={cn("font-mono text-xs font-bold", item.accent)}>
                {item.num}
              </span>
              <div className="min-w-0">
                <p className="font-heading text-sm font-semibold text-studio-foreground">
                  {item.title}
                </p>
                <p className="truncate font-mono text-xs text-studio-muted">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
