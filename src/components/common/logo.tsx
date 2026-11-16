"use client";

import Link from "next/link";
import { Shapes } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
}

export function Logo({
  className,
  size = "md",
  showText = true,
  href = "/",
}: LogoProps) {
  const boxSize =
    size === "lg" ? "size-10" : size === "md" ? "size-9" : "size-8";

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 tracking-tight transition-opacity hover:opacity-90",
        className
      )}
    >
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground",
          boxSize
        )}
      >
        <Shapes className="size-5" />
      </span>

      {showText && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          Vectorizer
        </span>
      )}
    </Link>
  );
}
