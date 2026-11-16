import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import {
  CONTAINER_GUTTER,
  CONTAINER_MAX_WIDTH,
  SURFACE_WARM,
} from "@/lib/layout";
import { cn } from "@/lib/utils";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { NavbarAuth } from "./navbar-auth";

export function Navbar() {
  return (
    <header className={cn("sticky top-0 z-40 w-full border-b border-border", SURFACE_WARM)}>
      <div
        className={cn(
          "mx-auto flex h-16 items-center justify-between gap-4",
          CONTAINER_MAX_WIDTH,
          CONTAINER_GUTTER
        )}
      >
        <Logo size="md" />

        <DesktopNav />

        <div className="flex items-center gap-2">
          <NavbarAuth />
          <div className="hidden items-center gap-1 md:flex">
            <ThemeToggle />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
