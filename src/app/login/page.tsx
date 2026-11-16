"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { LogIn } from "lucide-react";
import { z } from "zod";
import { GoogleIcon } from "@/components/common/brand-icons";
import { PasswordInput } from "@/components/common/password-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getGoogleLoginUrl, loginUser } from "@/lib/auth-api";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";

const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
  password: z.string().min(1, { error: "Password is required" }),
});

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

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
        await loginUser(value);
        await queryClient.invalidateQueries({ queryKey: ["auth-me"] });
        successToast("Welcome back", "Signed in to Vectorizer AI.");
        router.push("/");
      } catch (error: unknown) {
        errorToast("Sign in failed", getErrorMessage(error, "Invalid credentials"));
      }
    },
  });

  return (
    <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to Vectorizer</CardTitle>
          <CardDescription>
            Access your vector credits and export clean SVG, PNG, and PDF files.
          </CardDescription>
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
            <form.Field name="email">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="login-email-input">Email</Label>
                  <Input
                    id="login-email-input"
                    type="email"
                    placeholder="you@example.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors[0] && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors[0].message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor="login-password-input">Password</Label>
                  <PasswordInput
                    id="login-password-input"
                    placeholder="••••••••"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors[0] && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors[0].message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

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
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={null}>
      <LoginFormContent />
    </React.Suspense>
  );
}
