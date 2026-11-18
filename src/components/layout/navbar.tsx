"use client";

import { usePathname } from "next/navigation";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
// import { useHasMounted } from "@/hooks";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { useNavLinks } from "./nav-items";
import { NavbarUserMenu } from "./navbar-user-menu";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const navLinks = useNavLinks();
  const isHome = usePathname() === "/";
  // const hasMounted = useHasMounted();

  return (
    <header
      className={cn(
        "top-0 z-40 w-full transition-colors",
        isHome
          ? "absolute inset-x-0 border-b border-transparent bg-transparent"
          : "sticky border-b border-border/60 bg-background/80 backdrop-blur-md",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-16 w-full items-center justify-between",
          CONTAINER_MAX_WIDTH,
          CONTAINER_GUTTER,
        )}
      >
        {/* Left: Brand Logo */}
        <div className="flex shrink-0 items-center">
          <Logo size="md" />
        </div>

        {/* Center: Desktop Navigation Links */}
        <DesktopNav items={navLinks} />

        {/* Right: Controls & User Auth Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle size="icon" className="hidden md:inline-flex" />

            <NavbarUserMenu />
          {/* Mobile Navigation Drawer */}
          <MobileNav items={navLinks} />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
