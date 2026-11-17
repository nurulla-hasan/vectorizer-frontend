"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ShieldCheck, UserPlus } from "lucide-react";
import { z } from "zod";
import { GoogleIcon } from "@/components/common/brand-icons";
import { PasswordInput } from "@/components/common/password-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  getGoogleLoginUrl,
  registerUser,
  resendVerificationOtp,
  verifyEmailOtp,
} from "@/lib/auth-api";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";

const registerSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters" }).max(100),
  email: z.email({ error: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" })
    .max(100),
});

export default function RegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [pendingEmail, setPendingEmail] = React.useState<string | null>(null);
  const [otp, setOtp] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await registerUser(value);
        setPendingEmail(res.email);
        successToast(
          "Verification code sent",
          `Enter the 6-digit code sent to ${res.email}.`,
        );
      } catch (error: unknown) {
        errorToast(
          "Registration failed",
          getErrorMessage(error, "Could not create account."),
        );
      }
    },
  });

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!pendingEmail || otp.length !== 6) return;

    setIsVerifying(true);
    try {
      await verifyEmailOtp({ email: pendingEmail, otp });
      await queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      successToast("Email verified", "Welcome to Vectorizer AI — 5 credits added.");
      router.push("/studio");
    } catch (error: unknown) {
      errorToast(
        "Verification failed",
        getErrorMessage(error, "Invalid or expired verification code."),
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    setIsResending(true);
    try {
      await resendVerificationOtp({ email: pendingEmail });
      successToast("Code resent", `A fresh code was sent to ${pendingEmail}.`);
    } catch (error: unknown) {
      errorToast(
        "Resend failed",
        getErrorMessage(error, "Could not resend verification code."),
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full">
      {!pendingEmail ? (
        <>
          <CardHeader>
            <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserPlus className="size-5" />
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Get 5 free vector export credits right away — no card required.
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
              <form.Field name="name">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-name">Full Name</Label>
                    <Input
                      id="reg-name"
                      placeholder="Jane Doe"
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

              <form.Field name="email">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
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
                    <Label htmlFor="reg-password">Password</Label>
                    <PasswordInput
                      id="reg-password"
                      placeholder="At least 6 characters"
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
                    loadingText="Creating account..."
                  >
                    <UserPlus className="size-4" />
                    Create Account
                  </Button>
                )}
              </form.Subscribe>
            </form>
          </CardContent>

          <CardFooter className="justify-center text-sm text-muted-foreground">
            <span>Already have an account?&nbsp;</span>
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader>
            <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Verify your email
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit verification code sent to {pendingEmail}.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={otp.length !== 6}
                loading={isVerifying}
                loadingText="Verifying..."
              >
                <CheckCircle2 className="size-4" />
                Verify & Continue
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-between">
            <Button
              variant="ghost"
              size="default"
              onClick={() => {
                setPendingEmail(null);
                setOtp("");
              }}
            >
              Change email
            </Button>
            <Button
              variant="outline"
              size="default"
              loading={isResending}
              loadingText="Sending..."
              onClick={handleResend}
            >
              Resend code
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
