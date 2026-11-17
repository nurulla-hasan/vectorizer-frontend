"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { isNavLinkActive, type NavLinkItem } from "./nav-items";

interface DesktopNavProps {
  items: NavLinkItem[];
  className?: string;
}

export function DesktopNav({ items, className }: DesktopNavProps) {
  const pathname = usePathname();
  const [hash, setHash] = React.useState("");

  React.useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        "hidden md:flex items-center justify-center gap-7 lg:gap-8 flex-1 px-4",
        className,
      )}
    >
      {items.map((link) => {
        const isActive = isNavLinkActive(pathname, link.href, hash);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            onClick={() =>
              setHash(link.href.startsWith("/#") ? link.href.slice(1) : "")
            }
            className={cn(
              "relative py-2 text-sm font-medium transition-colors cursor-pointer select-none whitespace-nowrap",
              isActive
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span>{link.name}</span>
            {isActive && (
              <motion.div
                layoutId="navbar-active-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default DesktopNav;
