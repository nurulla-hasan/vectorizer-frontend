"use client";

import { cn } from "@/lib/utils";
import { useGetMe } from "@/services";

const FREE_CREDIT_CAP = 5;

/** Compact plan & credits quota readout for navbar account menus. */
export function CreditsQuotaSummary({ className }: { className?: string }) {
  const { data: user, isLoading } = useGetMe();

  if (isLoading) {
    return (
      <div
        className={cn("h-11 w-full animate-pulse rounded-md bg-muted", className)}
      />
    );
  }

  if (!user) return null;

  const isUnlimited = user.plan !== "FREE";
  const remaining = Math.max(0, user.credits);
  const exhausted = !isUnlimited && remaining <= 0;
  const nearCap = !isUnlimited && !exhausted && remaining <= 1;
  const percentage = isUnlimited
    ? 100
    : Math.min(100, (remaining / FREE_CREDIT_CAP) * 100);

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <div className="flex w-full items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">{user.plan} Plan</span>
        <span className="font-medium tabular-nums">
          {isUnlimited ? "Unlimited" : `${remaining} / ${FREE_CREDIT_CAP}`}
        </span>
      </div>

      <div
        role="progressbar"
        aria-label="Available vector credits"
        aria-valuemin={0}
        aria-valuemax={isUnlimited ? 100 : FREE_CREDIT_CAP}
        aria-valuenow={isUnlimited ? 100 : Math.min(remaining, FREE_CREDIT_CAP)}
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300",
            exhausted ? "bg-destructive" : nearCap ? "bg-amber-500" : "bg-primary",
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p
        className={cn(
          "text-[11px] text-muted-foreground",
          exhausted && "text-destructive",
        )}
      >
        {isUnlimited
          ? "Priority AI & SVG vectorization active"
          : exhausted
            ? "No free credits remaining"
            : `${remaining} vector ${remaining === 1 ? "credit" : "credits"} remaining`}
      </p>
    </div>
  );
}
