"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  KeyRound,
  LogOut,
  PenLine,
  ReceiptText,
} from "lucide-react";
import { ChangePasswordModal } from "@/components/auth/change-password-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials } from "@/lib/utils";
import { useGetMe, useLogout } from "@/services";
import { CreditsQuotaSummary } from "./credits-quota-summary";

export function NavbarUserMenu({ className }: { className?: string }) {
  const { data: user, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();
  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div
        className={cn(
          "hidden md:block size-9 animate-pulse rounded-full bg-muted",
          className,
        )}
      />
    );
  }

  if (user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className={cn("hidden md:inline-flex rounded-full", className)}
                aria-label={user.name || "User account menu"}
              />
            }
          >
            <Avatar className="size-8">
              <AvatarImage src={user.imageUrl} alt={user.name || "User Avatar"} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-foreground text-sm font-semibold leading-none">
                    {user.name || "User"}
                  </p>
                  <p className="text-muted-foreground truncate text-xs leading-none">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link href="/studio" />}
                className="flex-col items-stretch gap-1.5 px-2.5 py-2"
              >
                <CreditsQuotaSummary />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/studio" />}>
                <PenLine className="size-4 mr-2" />
                <span>Vector Studio</span>
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/plans" />}>
                <CreditCard className="size-4 mr-2" />
                <span>{user.plan === "FREE" ? "Upgrade Plan" : "Plans & Billing"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChangePasswordOpen(true)}>
                <KeyRound className="size-4 mr-2" />
                <span>Change Password</span>
              </DropdownMenuItem>
              {user.role === "ADMIN" && (
                <DropdownMenuItem render={<Link href="/admin/payments" />}>
                  <ReceiptText className="size-4 mr-2" />
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

        <ChangePasswordModal
          open={changePasswordOpen}
          onOpenChange={setChangePasswordOpen}
        />
      </>
    );
  }

  return (
    <Button render={<Link href="/auth/register" />}>
      <span>Get Started</span>
      <ArrowRight className="size-4" />
    </Button>
  );
}

export default NavbarUserMenu;
