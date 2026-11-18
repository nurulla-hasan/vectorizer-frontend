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
        "hidden md:flex items-center justify-center flex-1 px-4",
        className,
      )}
    >
      <div className="inline-flex items-center gap-1 rounded-full border border-studio-border/80 bg-studio-panel/80 p-1 shadow-sm backdrop-blur-sm">
        {items.map((link, idx) => {
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
                "relative inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-mono text-xs transition-colors cursor-pointer select-none whitespace-nowrap",
                isActive
                  ? "text-primary-foreground font-semibold"
                  : "text-studio-muted hover:text-studio-foreground",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="navbar-active-indicator"
                  className="absolute inset-0 rounded-full bg-primary shadow-[0_2px_0_0_rgba(0,0,0,0.25)]"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span className="relative z-10 opacity-60">0{idx + 1}</span>
              <span className="relative z-10">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default DesktopNav;
