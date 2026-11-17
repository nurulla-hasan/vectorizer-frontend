import type { ReactNode } from "react";
import { CheckCircle2, type LucideIcon } from "lucide-react";
import AnimationWrapper from "@/components/common/animation-wrapper";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  badge: string;
  badgeIcon: LucideIcon;
  title: ReactNode;
  description: ReactNode;
  points?: string[];
  extra?: ReactNode;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function PageHero({
  badge,
  badgeIcon: BadgeIcon,
  title,
  description,
  points,
  extra,
  children,
  className,
  contentClassName,
}: PageHeroProps) {
  const split = Boolean(children);

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-studio-border/50 bg-studio-surface",
        className,
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="vk-blueprint-grid absolute inset-0 opacity-30" />
        <div className="absolute -top-40 right-[-10%] size-[36rem] rounded-full bg-primary/25 blur-[130px]" />
        <div className="absolute -bottom-48 left-[-8%] size-[28rem] rounded-full bg-trace/10 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </div>

      <div
        className={cn(
          "relative mx-auto w-full py-16 sm:py-20",
          CONTAINER_MAX_WIDTH,
          CONTAINER_GUTTER,
        )}
      >
        <div
          className={cn(
            "grid items-center gap-12",
            split && "lg:grid-cols-[1.05fr_0.95fr] lg:gap-16",
          )}
        >
          <AnimationWrapper
            direction="up"
            className={cn(
              split ? "max-w-xl" : "mx-auto max-w-2xl text-center",
              contentClassName,
            )}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-studio-muted">
              <BadgeIcon className="size-3.5 text-trace" />
              {badge}
            </span>

            <h1
              className={cn(
                "mt-6 font-heading text-4xl font-bold tracking-tight text-studio-foreground sm:text-5xl",
                !split && "text-balance",
              )}
            >
              {title}
            </h1>

            <p
              className={cn(
                "mt-5 text-base leading-7 text-studio-muted sm:text-lg",
                !split && "mx-auto max-w-xl",
              )}
            >
              {description}
            </p>

            {points && (
              <ul
                className={cn(
                  "mt-7 flex flex-wrap items-center gap-x-5 gap-y-2",
                  !split && "justify-center",
                )}
              >
                {points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-1.5 text-sm text-studio-muted"
                  >
                    <CheckCircle2 className="size-4 text-trace" />
                    {point}
                  </li>
                ))}
              </ul>
            )}

            {extra}
          </AnimationWrapper>

          {children && (
            <AnimationWrapper direction="left" delay={0.15}>
              {children}
            </AnimationWrapper>
          )}
        </div>
      </div>
    </section>
  );
}

export function TitleAccent({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) {
  return (
    <span className="relative inline-block">
      <span className="bg-[linear-gradient(90deg,var(--trace),var(--title-gradient-2)_48%,var(--title-gradient-3))] bg-clip-text text-transparent">
        {children}
      </span>
      <svg
        viewBox="0 0 300 14"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-2 h-3 w-full"
      >
        <defs>
          <linearGradient id={id} x1="0" x2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        <path
          d="M3 10C58 3 118 2 175 7S268 12 297 5"
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="3"
          strokeLinecap="round"
          className="vk-draw-line"
        />
      </svg>
    </span>
  );
}
