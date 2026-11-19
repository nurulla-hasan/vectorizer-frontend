"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Check, Clock3, Copy, ShieldCheck } from "lucide-react";
import { FormInput } from "@/components/common/form-input";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getErrorMessage } from "@/lib/error";
import { errorToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
  type PaidPlanId,
  type PaymentMethod,
  type PaymentProvider,
  type PlanDefinition,
  useCreatePaymentRequest,
  useGetMe,
  useMyPaymentRequests,
  usePaymentMethods,
} from "@/services";
import { paymentSubmissionSchema } from "@/validations";

const formatBdt = (amount: number) => `৳${amount.toLocaleString("en-US")}`;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      aria-label="Copy payment number"
    >
      {copied ? (
        <Check className="size-4 text-dot-max" />
      ) : (
        <Copy className="size-4" />
      )}
    </Button>
  );
}

export interface UpgradePlanDialogProps {
  plan: PlanDefinition | null;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

export function UpgradePlanDialog({
  plan,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onClose,
}: UpgradePlanDialogProps) {
  const router = useRouter();
  const { data: user } = useGetMe();
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const { data: methods = [], isLoading: methodsLoading } =
    usePaymentMethods();
  const { data: requests = [], isLoading: requestsLoading } =
    useMyPaymentRequests({ enabled: plan !== null && isOpen });
  const { mutateAsync: createRequest, isPending: isSubmitting } =
    useCreatePaymentRequest();

  const [provider, setProvider] = React.useState<PaymentProvider | null>(null);

  const pendingRequest = requests.find((request) => request.status === "PENDING");
  const lastRejected = requests.find((request) => request.status === "REJECTED");

  const selectedMethod: PaymentMethod | undefined =
    methods.find((method) => method.provider === provider) ?? methods[0];

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && !user) {
      router.push("/auth/login?callbackUrl=/plans");
      return;
    }
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    controlledOnOpenChange?.(nextOpen);
    if (!nextOpen) {
      form.reset();
      onClose?.();
    }
  };

  const form = useForm({
    defaultValues: {
      senderNumber: "",
      transactionId: "",
    },
    validators: {
      onSubmit: paymentSubmissionSchema,
    },
    onSubmit: async ({ value }) => {
      if (!plan || plan.code === "FREE" || !selectedMethod) {
        return;
      }

      try {
        await createRequest({
          planId: plan.id as PaidPlanId,
          provider: selectedMethod.provider,
          senderNumber: value.senderNumber.trim(),
          transactionId: value.transactionId.trim(),
        });
        form.reset();
        handleOpenChange(false);
      } catch (error: unknown) {
        errorToast(
          "Payment submission failed",
          getErrorMessage(error, "Could not submit payment request."),
        );
      }
    },
  });

  if (!plan) {
    return trigger ? <>{trigger}</> : null;
  }

  const title = pendingRequest
    ? "Payment under review"
    : `Upgrade to ${plan.label}`;

  const description = pendingRequest
    ? "Your request is waiting for admin verification. No action is needed right now."
    : "Pay with bKash, Nagad, or Rocket, then submit the sender number and transaction ID below.";

  return (
    <Modal
      open={isOpen}
      onOpenChange={handleOpenChange}
      actionTrigger={trigger}
      title={title}
      description={description}
      size="default"
    >
      {requestsLoading ? (
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      ) : pendingRequest ? (
        <div className="space-y-4">
          <div className="space-y-3 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm">
            <p className="flex items-center gap-2 font-medium text-studio-foreground">
              <Clock3 className="size-4 text-primary" />
              {pendingRequest.plan} plan · {formatBdt(pendingRequest.amount)}
            </p>
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <dt className="text-muted-foreground">Billing</dt>
              <dd className="text-right font-medium">
                {pendingRequest.billingCycle === "YEARLY"
                  ? "Yearly"
                  : "Monthly"}
              </dd>
              <dt className="text-muted-foreground">Method</dt>
              <dd className="text-right font-medium">
                {pendingRequest.provider}
              </dd>
              <dt className="text-muted-foreground">Sender number</dt>
              <dd className="text-right font-medium tabular-nums">
                {pendingRequest.senderNumber}
              </dd>
              <dt className="text-muted-foreground">Transaction ID</dt>
              <dd className="text-right font-medium break-all">
                {pendingRequest.transactionId}
              </dd>
              <dt className="text-muted-foreground">Submitted</dt>
              <dd className="text-right font-medium">
                {formatDate(pendingRequest.createdAt)}
              </dd>
            </dl>
          </div>
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-dot-max" />
            Your plan activates automatically once an admin approves the payment.
            This page refreshes the status on its own.
          </p>
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => handleOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {lastRejected && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              Your previous request was rejected
              {lastRejected.adminNote ? `: ${lastRejected.adminNote}` : "."} You
              can submit a new one below.
            </p>
          )}

          <div className="space-y-2">
            <Label>Payment method</Label>
            {methodsLoading ? (
              <div className="h-10 animate-pulse rounded-lg bg-muted" />
            ) : methods.length === 0 ? (
              <p className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-xs text-primary">
                Payment numbers are not configured yet. Please contact support to
                complete the upgrade.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {methods.map((method) => {
                  const active = selectedMethod?.provider === method.provider;
                  return (
                    <button
                      key={method.provider}
                      type="button"
                      onClick={() => setProvider(method.provider)}
                      aria-pressed={active}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {method.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-3 rounded-xl border border-border/70 bg-muted/40 p-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Send exactly</span>
              <span className="font-heading text-lg font-semibold tabular-nums">
                {formatBdt(plan.amountBdt)}
                <span className="ml-1 font-mono text-xs font-normal tracking-wider text-muted-foreground uppercase">
                  {plan.period}
                </span>
              </span>
            </div>
            <Separator />
            {selectedMethod && (
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  {selectedMethod.label} number
                </span>
                <span className="flex items-center gap-1.5 font-medium tabular-nums">
                  {selectedMethod.number}
                  <CopyButton value={selectedMethod.number} />
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Use the “Send Money” option in {selectedMethod?.label ?? "your mobile wallet"},
              then paste the transaction details below.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <FormInput
              form={form}
              name="senderNumber"
              label="Your sender number"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              maxLength={11}
            />

            <FormInput
              form={form}
              name="transactionId"
              label="Transaction ID"
              placeholder="e.g. 9HK23JX7A1"
              autoComplete="off"
              maxLength={30}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(formSubmitting) => (
                <Button
                  type="submit"
                  size="default"
                  loading={isSubmitting || formSubmitting}
                  loadingText="Submitting..."
                >
                  Submit payment request
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      )}
    </Modal>
  );
}
