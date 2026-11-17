"use client";

import * as React from "react";
import { Check, Clock3, Copy, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  type BillingCycle,
  type PaymentMethod,
  type PaymentProvider,
  type PlanDefinition,
  useCreatePaymentRequest,
  useMyPaymentRequests,
  usePaymentMethods,
} from "@/services";

const SENDER_NUMBER_PATTERN = /^01[3-9]\d{8}$/;
const TRANSACTION_ID_PATTERN = /^[A-Za-z0-9]{6,30}$/;

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
      size="icon-sm"
      onClick={handleCopy}
      aria-label="Copy payment number"
    >
      {copied ? (
        <Check className="size-3.5 text-emerald-500" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </Button>
  );
}

interface UpgradePlanDialogProps {
  plan: PlanDefinition | null;
  onClose: () => void;
}

export function UpgradePlanDialog({ plan, onClose }: UpgradePlanDialogProps) {
  const { data: methods = [], isLoading: methodsLoading } =
    usePaymentMethods();
  const { data: requests = [], isLoading: requestsLoading } =
    useMyPaymentRequests({ enabled: plan !== null });
  const { mutateAsync: createRequest, isPending: isSubmitting } =
    useCreatePaymentRequest();

  const [provider, setProvider] = React.useState<PaymentProvider | null>(null);
  const [billingCycle, setBillingCycle] =
    React.useState<BillingCycle>("MONTHLY");
  const [senderNumber, setSenderNumber] = React.useState("");
  const [transactionId, setTransactionId] = React.useState("");

  const pendingRequest = requests.find((request) => request.status === "PENDING");
  const lastRejected = requests.find((request) => request.status === "REJECTED");

  const selectedMethod: PaymentMethod | undefined =
    methods.find((method) => method.provider === provider) ?? methods[0];
  const selectedPrice =
    plan?.prices.find((price) => price.billingCycle === billingCycle) ??
    plan?.prices[0];

  const monthlyPrice = plan?.prices.find(
    (price) => price.billingCycle === "MONTHLY",
  );
  const yearlyPrice = plan?.prices.find(
    (price) => price.billingCycle === "YEARLY",
  );
  const yearlySaving =
    monthlyPrice && yearlyPrice
      ? monthlyPrice.amountBdt * 12 - yearlyPrice.amountBdt
      : 0;

  const senderValid = SENDER_NUMBER_PATTERN.test(senderNumber.trim());
  const transactionValid = TRANSACTION_ID_PATTERN.test(
    transactionId.trim(),
  );
  const canSubmit =
    plan !== null &&
    Boolean(selectedMethod) &&
    Boolean(selectedPrice) &&
    senderValid &&
    transactionValid &&
    !isSubmitting;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !plan ||
      plan.code === "FREE" ||
      !selectedMethod ||
      !selectedPrice ||
      !canSubmit
    ) {
      return;
    }

    try {
      await createRequest({
        plan: plan.code,
        billingCycle: selectedPrice.billingCycle,
        provider: selectedMethod.provider,
        senderNumber: senderNumber.trim(),
        transactionId: transactionId.trim(),
      });
      setSenderNumber("");
      setTransactionId("");
    } catch {
      // Errors are surfaced via toast inside the mutation hook.
    }
  };

  return (
    <Dialog
      open={plan !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {pendingRequest
              ? "Payment under review"
              : `Upgrade to ${plan?.label ?? "a paid plan"}`}
          </DialogTitle>
          <DialogDescription>
            {pendingRequest
              ? "Your request is waiting for admin verification. No action is needed right now."
              : "Pay with bKash, Nagad, or Rocket, then submit the sender number and transaction ID below."}
          </DialogDescription>
        </DialogHeader>

        {requestsLoading ? (
          <div className="h-40 animate-pulse rounded-xl bg-muted" />
        ) : pendingRequest ? (
          <div className="space-y-4">
            <div className="space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
              <p className="flex items-center gap-2 font-medium">
                <Clock3 className="size-4 text-amber-500" />
                {pendingRequest.plan} plan ·{" "}
                {formatBdt(pendingRequest.amount)}
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
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
              Your plan activates automatically once an admin approves the
              payment. This page refreshes the status on its own.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {lastRejected && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                Your previous request was rejected
                {lastRejected.adminNote
                  ? `: ${lastRejected.adminNote}`
                  : "."}{" "}
                You can submit a new one below.
              </p>
            )}

            {plan && plan.prices.length > 1 && (
              <div className="space-y-2">
                <Label>Billing cycle</Label>
                <div className="grid grid-cols-2 gap-2">
                  {plan.prices.map((price) => {
                    const active = selectedPrice?.billingCycle === price.billingCycle;
                    const isYearly = price.billingCycle === "YEARLY";
                    return (
                      <button
                        key={price.billingCycle}
                        type="button"
                        onClick={() => setBillingCycle(price.billingCycle)}
                        aria-pressed={active}
                        className={cn(
                          "rounded-lg border px-3 py-2.5 text-left transition-colors",
                          active
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background hover:bg-muted",
                        )}
                      >
                        <span
                          className={cn(
                            "flex items-center justify-between text-sm font-medium",
                            active ? "text-primary" : "text-foreground",
                          )}
                        >
                          {isYearly ? "Yearly" : "Monthly"}
                          {isYearly && yearlySaving > 0 && (
                            <span className="text-[10px] font-semibold text-emerald-600 uppercase dark:text-emerald-400">
                              Save {formatBdt(yearlySaving)}
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground tabular-nums">
                          {formatBdt(price.amountBdt)} · {price.period}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Payment method</Label>
              {methodsLoading ? (
                <div className="h-10 animate-pulse rounded-lg bg-muted" />
              ) : methods.length === 0 ? (
                <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
                  Payment numbers are not configured yet. Please contact
                  support to complete the upgrade.
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

            {selectedMethod && selectedPrice && (
              <div className="space-y-3 rounded-xl border border-border/70 bg-muted/40 p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Send exactly
                  </span>
                  <span className="font-heading text-lg font-semibold tabular-nums">
                    {formatBdt(selectedPrice.amountBdt)}
                    <span className="ml-1 font-mono text-[10px] font-normal tracking-wider text-muted-foreground uppercase">
                      {selectedPrice.period}
                    </span>
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    {selectedMethod.label} number
                  </span>
                  <span className="flex items-center gap-1.5 font-medium tabular-nums">
                    {selectedMethod.number}
                    <CopyButton value={selectedMethod.number} />
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use the “Send Money” option in {selectedMethod.label}, then
                  paste the transaction details below.
                </p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="payment-sender">Your sender number</Label>
                <Input
                  id="payment-sender"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="01XXXXXXXXX"
                  value={senderNumber}
                  onChange={(event) => setSenderNumber(event.target.value)}
                  aria-invalid={senderNumber.length > 0 && !senderValid}
                />
                {senderNumber.length > 0 && !senderValid && (
                  <p className="text-xs text-destructive">
                    Enter an 11-digit Bangladeshi mobile number.
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="payment-trx">Transaction ID</Label>
                <Input
                  id="payment-trx"
                  placeholder="e.g. 9HK23JX7A1"
                  value={transactionId}
                  onChange={(event) =>
                    setTransactionId(event.target.value.toUpperCase())
                  }
                  aria-invalid={transactionId.length > 0 && !transactionValid}
                />
                {transactionId.length > 0 && !transactionValid && (
                  <p className="text-xs text-destructive">
                    6–30 letters or digits, as shown in the payment SMS.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!canSubmit}
                loading={isSubmitting}
                loadingText="Submitting..."
              >
                Submit payment request
              </Button>
            </DialogFooter>
          </form>
        )}

        {pendingRequest && (
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
