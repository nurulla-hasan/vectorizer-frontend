"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
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
      router.replace("/");
    })();

    return () => {
      active = false;
    };
  }, [queryClient, router]);

  return (
    <div className="flex min-h-96 flex-col items-center justify-center gap-3 p-6 text-center">
      <Spinner className="size-6 text-primary" />
      <p className="text-sm text-muted-foreground">
        Completing sign-in, redirecting to studio...
      </p>
    </div>
  );
}
