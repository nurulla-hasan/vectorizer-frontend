"use client";

import Link from "next/link";
import {
  CreditCard,
  LogOut,
  PenLine,
  ReceiptText,
} from "lucide-react";
import { CreditsQuotaSummary } from "@/components/layout/credits-quota-summary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials } from "@/lib/utils";
import { useGetMe, useLogout } from "@/services";

/**
 * Account menu for the Vector Studio canvas.
 * Studio surfaces are always dark, so this menu is a dedicated dark variant
 * instead of reusing the site navbar menu.
 */
export function StudioUserMenu({ className }: { className?: string }) {
  const { data: user, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();

  if (isLoading) {
    return (
      <div
        className={cn(
          "size-9 animate-pulse rounded-full border border-studio-border bg-studio-panel/80",
          className,
        )}
      />
    );
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            title={user.name || "Account"}
            aria-label={user.name ? `${user.name} account menu` : "Account menu"}
            className={cn(
              "inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-studio-border bg-studio-panel/80 shadow-lg backdrop-blur transition-colors hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none aria-expanded:border-primary/60 aria-expanded:bg-studio-panel",
              className,
            )}
          />
        }
      >
        <Avatar className="size-7">
          <AvatarImage src={user.imageUrl} alt={user.name || "User Avatar"} />
          <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-72 rounded-xl border border-studio-border bg-studio-panel shadow-2xl"
      >
        <DropdownMenuGroup>
          <div className="flex items-center gap-3 px-1.5 py-1.5">
            <Avatar className="size-9">
              <AvatarImage
                src={user.imageUrl}
                alt={user.name || "User Avatar"}
              />
              <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-studio-foreground">
                {user.name || "User"}
              </p>
              <p className="truncate text-xs text-studio-muted">{user.email}</p>
            </div>
            <Badge variant="secondary">{user.plan}</Badge>
          </div>

          <DropdownMenuSeparator />

          <div className="px-1.5 py-2">
            <CreditsQuotaSummary />
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem render={<Link href="/studio" />}>
            <PenLine className="size-4" />
            <span>Vector Studio</span>
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/plans" />}>
            <CreditCard className="size-4" />
            <span>
              {user.plan === "FREE" ? "Upgrade Plan" : "Plans & Billing"}
            </span>
          </DropdownMenuItem>
          {user.role === "ADMIN" && (
            <DropdownMenuItem render={<Link href="/admin/payments" />}>
              <ReceiptText className="size-4" />
              <span>Payment Requests</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={() => logout()}>
          <LogOut className="size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default StudioUserMenu;
