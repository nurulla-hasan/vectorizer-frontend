"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { isNavLinkActive, NAV_LINKS } from "./nav-items";

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("flex md:hidden", className)}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon-lg" aria-label="Open menu">
              <Menu />
            </Button>
          }
        />
        <SheetContent side="right">
          <div className="flex h-full flex-col gap-5 p-4">
            <SheetHeader>
              <SheetTitle>
                <div onClick={() => setOpen(false)}>
                  <Logo size="sm" />
                </div>
              </SheetTitle>
            </SheetHeader>

            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = isNavLinkActive(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs font-medium text-muted-foreground">
                Theme
              </span>
              <ThemeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
