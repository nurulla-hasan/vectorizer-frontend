"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Coins, LogIn, LogOut, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { getMe, logoutUser } from "@/lib/auth-api";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";
}

export function NavbarAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-me"],
    queryFn: getMe,
    retry: false,
    staleTime: 30_000,
  });

  const handleLogout = async () => {
    try {
      await logoutUser();
      queryClient.setQueryData(["auth-me"], null);
      await queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      successToast("Signed out", "You have been logged out.");
    } catch (error: unknown) {
      errorToast("Logout failed", getErrorMessage(error, "Could not log out."));
    }
  };

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="default" render={<Link href="/login" />}>
          <LogIn className="size-4" />
          Log in
        </Button>
        <Button size="default" render={<Link href="/register" />}>
          <UserPlus className="size-4" />
          Sign up
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <Badge variant="secondary">
        <Coins className="size-3.5 text-primary" />
        {user.plan === "FREE" ? `${user.credits} credits` : `${user.plan} Plan`}
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-lg" aria-label="Account menu" />
          }
        >
          <Avatar>
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-foreground">{user.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
