"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  MailCheck,
  ShieldCheck,
} from "lucide-react";
import { z } from "zod";
import { FormInput } from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";
import {
  useForgotPassword,
  useResendResetOtp,
  useResetPassword,
  useVerifyResetOtp,
} from "@/services";

const emailStepSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
});

const resetPasswordStepSchema = z
  .object({
    password: z
      .string()
      .min(6, { error: "Password must be at least 6 characters" })
      .max(100),
    confirmPassword: z
      .string()
      .min(1, { error: "Please confirm your new password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ForgotPasswordStep = "email" | "otp" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { mutateAsync: requestResetOtp } = useForgotPassword();
  const { mutateAsync: resendOtp, isPending: isResending } =
    useResendResetOtp();
  const { mutateAsync: verifyOtp, isPending: isVerifying } =
    useVerifyResetOtp();
  const { mutateAsync: submitNewPassword } = useResetPassword();

  const [step, setStep] = React.useState<ForgotPasswordStep>("email");
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");

  const emailForm = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: emailStepSchema },
    onSubmit: async ({ value }) => {
      try {
        const message = await requestResetOtp({ email: value.email });
        setEmail(value.email);
        setStep("otp");
        successToast(
          "Reset code sent",
          message || `Check ${value.email} for your 6-digit code.`,
        );
      } catch (error: unknown) {
        errorToast(
          "Request failed",
          getErrorMessage(error, "Could not send password reset code."),
        );
      }
    },
  });

  const resetForm = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    validators: { onSubmit: resetPasswordStepSchema },
    onSubmit: async ({ value }) => {
      try {
        const message = await submitNewPassword({
          email,
          otp,
          password: value.password,
        });
        successToast(
          "Password updated",
          message || "You can now sign in with your new password.",
        );
        router.push("/auth/login");
      } catch (error: unknown) {
        errorToast(
          "Reset failed",
          getErrorMessage(error, "Could not reset password."),
        );
      }
    },
  });

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || otp.length !== 6) return;

    try {
      const message = await verifyOtp({ email, otp });
      successToast(
        "Code verified",
        message || "Now choose a new password for your account.",
      );
      setStep("reset");
    } catch (error: unknown) {
      errorToast(
        "Verification failed",
        getErrorMessage(error, "Invalid or expired reset code."),
      );
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      const message = await resendOtp({ email });
      successToast(
        "Code resent",
        message || `A fresh reset code was sent to ${email}.`,
      );
    } catch (error: unknown) {
      errorToast(
        "Resend failed",
        getErrorMessage(error, "Could not resend reset code."),
      );
    }
  };

  const stepMeta: Record<
    ForgotPasswordStep,
    { icon: typeof KeyRound; title: string; subtitle: string }
  > = {
    email: {
      icon: KeyRound,
      title: "Forgot your password?",
      subtitle:
        "Enter the email associated with your account and we'll send a 6-digit reset code.",
    },
    otp: {
      icon: MailCheck,
      title: "Verify reset code",
      subtitle: `Enter the 6-digit code we sent to ${email}.`,
    },
    reset: {
      icon: ShieldCheck,
      title: "Set a new password",
      subtitle: "Choose a strong password for your TraceCraft AI account.",
    },
  };

  const ActiveIcon = stepMeta[step].icon;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ActiveIcon className="size-5" />
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          {stepMeta[step].title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {stepMeta[step].subtitle}
        </p>
      </CardHeader>

      <CardContent>
        {step === "email" && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              emailForm.handleSubmit();
            }}
            className="space-y-4"
          >
            <FormInput
              form={emailForm}
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />

            <emailForm.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  loading={isSubmitting}
                  loadingText="Sending code..."
                >
                  Send reset code
                </Button>
              )}
            </emailForm.Subscribe>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="reset-otp-input">6-digit reset code</Label>
              <div className="flex justify-center">
                <InputOTP
                  id="reset-otp-input"
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
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
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={otp.length !== 6}
              loading={isVerifying}
              loadingText="Verifying code..."
            >
              <CheckCircle2 className="size-4" />
              Verify code
            </Button>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() => {
                  setOtp("");
                  setStep("email");
                }}
                className="font-medium hover:text-foreground hover:underline"
              >
                Use different email
              </button>
              <button
                type="button"
                disabled={isResending}
                onClick={handleResend}
                className="font-medium text-primary hover:underline disabled:opacity-60"
              >
                {isResending ? "Sending..." : "Resend code"}
              </button>
            </div>
          </form>
        )}

        {step === "reset" && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              resetForm.handleSubmit();
            }}
            className="space-y-4"
          >
            <FormInput
              form={resetForm}
              name="password"
              label="New password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
            />

            <FormInput
              form={resetForm}
              name="confirmPassword"
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your new password"
            />

            <resetForm.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  loading={isSubmitting}
                  loadingText="Updating password..."
                >
                  Reset password
                </Button>
              )}
            </resetForm.Subscribe>
          </form>
        )}
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
