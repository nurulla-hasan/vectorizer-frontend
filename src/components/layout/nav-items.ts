import { Home, type LucideIcon } from "lucide-react";

export type NavLinkKey = "home";

export interface NavLinkItem {
  key: NavLinkKey;
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_LINKS: NavLinkItem[] = [
  { key: "home", label: "Home", href: "/", icon: Home },
];

export function isNavLinkActive(
  pathname: string | null,
  href: string,
  hash = ""
): boolean {
  if (!pathname) return false;
  if (href.startsWith("/#")) {
    return pathname === "/" && hash === href.slice(1);
  }
  if (href === "/") {
    return (
      pathname === "/" &&
      !NAV_LINKS.some(
        (item) => item.href.startsWith("/#") && hash === item.href.slice(1)
      )
    );
  }
  return pathname.startsWith(href);
}
