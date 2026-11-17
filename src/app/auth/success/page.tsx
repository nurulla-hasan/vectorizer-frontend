"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { successToast } from "@/lib/toast";

export default function AuthSuccessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    let active = true;
    (async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      if (!active) return;
      successToast("Signed in", "Google account connected.");
      router.replace("/studio");
    })();

    return () => {
      active = false;
    };
  }, [queryClient, router]);

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Spinner className="size-6" />
        </div>
        <div className="space-y-1">
          <h1 className="font-heading text-lg font-semibold tracking-tight">
            Signing you in
          </h1>
          <p className="text-sm text-muted-foreground">
            Completing Google sign-in, redirecting to your studio…
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
