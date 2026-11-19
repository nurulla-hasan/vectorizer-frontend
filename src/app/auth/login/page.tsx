"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { LogIn } from "lucide-react";
import { z } from "zod";
import { GoogleIcon } from "@/components/common/brand-icons";
import { FormInput } from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSafeRedirectUrl } from "@/constant/routes";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";
import { getGoogleLoginUrl, useLogin } from "@/services";

const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
  password: z.string().min(1, { error: "Password is required" }),
});

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync: login } = useLogin();

  React.useEffect(() => {
    if (searchParams.get("error") === "google_auth_failed") {
      errorToast(
        "Google sign-in failed",
        "Could not complete Google authentication. Please try again.",
      );
    }
  }, [searchParams]);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await login(value);
        successToast("Welcome back", "Signed in to TraceCraft AI.");
        const target = getSafeRedirectUrl(searchParams.get("callbackUrl"));
        router.push(target);
      } catch (error: unknown) {
        errorToast("Sign in failed", getErrorMessage(error, "Invalid credentials"));
      }
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LogIn className="size-5" />
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to access your vector credits and export clean SVG, PNG,
          PDF, EPS, and DXF files.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          render={<a href={getGoogleLoginUrl()} />}
        >
          <GoogleIcon className="size-4" />
          Continue with Google
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FormInput
            form={form}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />

          <FormInput
            form={form}
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
          />

          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={isSubmitting}
                loadingText="Signing in..."
              >
                <LogIn className="size-4" />
                Sign In
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        <span>Don&apos;t have an account?&nbsp;</span>
        <Link
          href="/auth/register"
          className="font-medium text-primary hover:underline"
        >
          Create one
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={null}>
      <LoginFormContent />
    </React.Suspense>
  );
}
