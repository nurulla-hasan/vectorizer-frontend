"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  CreditCard,
  LogIn,
  LogOut,
  Menu,
  PenLine,
} from "lucide-react";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, getInitials } from "@/lib/utils";
import { useGetMe, useLogout } from "@/services";
import { CreditsQuotaSummary } from "./credits-quota-summary";
import { isNavLinkActive, type NavLinkItem } from "./nav-items";

interface MobileNavProps {
  items: NavLinkItem[];
  className?: string;
}

export function MobileNav({ items, className }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  // Close the drawer on any route change, including programmatic navigation.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const { data: user, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <div className={cn("flex md:hidden", className)}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon-lg"
              className="rounded-lg cursor-pointer"
              aria-label="Open menu"
            />
          }
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-72 sm:w-80 max-w-[88vw] p-4 flex flex-col overflow-y-auto overscroll-contain gap-4"
        >
          <div className="flex flex-col gap-3.5">
            <SheetHeader className="text-left pb-3 border-b border-border">
              <SheetTitle>
                <div onClick={() => setOpen(false)}>
                  <Logo size="sm" />
                </div>
              </SheetTitle>
            </SheetHeader>

            {/* Mobile Navigation Links */}
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col space-y-0.5"
            >
              {items.map((link) => {
                const Icon = link.icon;
                const isActive = isNavLinkActive(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{link.name}</span>
                    {link.badge !== undefined && (
                      <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile Bottom User Status or CTA */}
          <div className="mt-auto pt-4 border-t border-border flex flex-col gap-2.5">
            {isLoading ? (
              <div className="h-10 animate-pulse rounded-lg bg-muted" />
            ) : user ? (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3 px-1">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={user.imageUrl}
                      alt={user.name || "User Avatar"}
                    />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate leading-tight">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate leading-tight">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/studio"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 transition-colors hover:bg-muted"
                >
                  <CreditsQuotaSummary />
                </Link>

                <div className="flex flex-col gap-0.5">
                  <Link
                    href="/studio"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <PenLine className="size-4 shrink-0" />
                    <span>Vector Studio</span>
                  </Link>
                  <Link
                    href="/plans"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <CreditCard className="size-4 shrink-0" />
                    <span>
                      {user.plan === "FREE" ? "Upgrade Plan" : "Plans & Billing"}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="size-4 shrink-0" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-center cursor-pointer font-medium"
                  render={<Link href="/auth/login" />}
                  onClick={() => setOpen(false)}
                >
                  <LogIn className="size-4" />
                  <span>Log in</span>
                </Button>
                <Button
                  className="w-full justify-center cursor-pointer font-medium"
                  render={<Link href="/auth/register" />}
                  onClick={() => setOpen(false)}
                >
                  <span>Get Started</span>
                  <ArrowRight className="size-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Mobile Theme Switcher */}
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Theme
              </span>
              <ThemeToggle size="icon" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNav;
