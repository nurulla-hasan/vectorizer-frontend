"use client";

import * as React from "react";
import {
  CreditCard,
  Home,
  Info,
  Mail,
  PenLine,
  type LucideIcon,
} from "lucide-react";

export type NavItemKey = "home" | "studio" | "plans" | "about" | "contact";

export interface NavItemConfig {
  key: NavItemKey;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
}

export interface NavLinkItem {
  key: NavItemKey;
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
}

export const NAV_ITEMS: readonly NavItemConfig[] = [
  { key: "home", label: "Home", href: "/", icon: Home },
  { key: "studio", label: "Studio", href: "/studio", icon: PenLine },
  { key: "plans", label: "Plans", href: "/plans", icon: CreditCard },
  { key: "about", label: "About", href: "/about", icon: Info },
  { key: "contact", label: "Contact", href: "/contact", icon: Mail },
] as const;

export function isNavLinkActive(
  pathname: string | null,
  href: string,
  hash = "",
): boolean {
  if (!pathname) return false;
  if (href.startsWith("/#")) {
    return pathname === "/" && hash === href.slice(1);
  }
  if (href === "/") {
    return (
      pathname === "/" &&
      !NAV_ITEMS.some(
        (item) => item.href.startsWith("/#") && hash === item.href.slice(1),
      )
    );
  }
  return pathname.startsWith(href);
}

/**
 * Hook returning navigation items, optionally enriched with dynamic API badges.
 */
export function useNavLinks(
  dynamicBadges?: Partial<Record<NavItemKey, number | string>>,
): NavLinkItem[] {
  return React.useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
        key: item.key,
        name: item.label,
        href: item.href,
        icon: item.icon,
        badge: dynamicBadges?.[item.key] ?? item.badge,
      })),
    [dynamicBadges],
  );
}
