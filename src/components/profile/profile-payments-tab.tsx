"use client";

import Link from "next/link";
import { ReceiptText, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import type { PaymentRequest, PaymentStatus } from "@/services";

const PAYMENT_STATUS_VARIANT: Record<
  PaymentStatus,
  "pending" | "success" | "rejected"
> = {
  PENDING: "pending",
  APPROVED: "success",
  REJECTED: "rejected",
};

interface ProfilePaymentsTabProps {
  paymentRequests: PaymentRequest[];
  isLoading: boolean;
}

export function ProfilePaymentsTab({
  paymentRequests,
  isLoading,
}: ProfilePaymentsTabProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-studio-border bg-studio-panel p-6 sm:p-8 shadow-xl">
      {/* Background dot grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 vk-dot-grid opacity-30"
      />

      <div className="relative space-y-6">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-studio-border/70 pb-3 font-mono text-xs text-studio-muted">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-studio-foreground">
              05 / TRANSACTIONS
            </span>
            <span className="rounded bg-studio-surface px-2 py-0.5 text-xs text-studio-muted">
              BDT LEDGER
            </span>
          </div>
          <span className="text-xs text-studio-muted">
            {"//"} {paymentRequests.length} records found
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-studio-foreground flex items-center gap-2">
              <ReceiptText className="size-5 text-primary" />
              <span>Mobile Payment History</span>
            </h3>
            <p className="text-xs text-studio-muted mt-1">
              Review your manual mobile payment submissions (bKash, Nagad, Rocket) and verification states.
            </p>
          </div>
          <Button size="default" render={<Link href="/plans" />}>
            <Sparkles className="size-4" />
            <span>New Upgrade Request</span>
          </Button>
        </div>

        <Separator className="bg-studio-border" />

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : paymentRequests.length === 0 ? (
          <EmptyState
            icon={<ReceiptText className="size-6" />}
            title="No payment requests yet"
            description="When you submit manual mobile payments (bKash, Nagad, Rocket) for Pro subscriptions, their review status will show up here."
            action={
              <Button size="default" render={<Link href="/plans" />}>
                <span>Explore Pro Plans</span>
              </Button>
            }
          />
        ) : (
          <div className="rounded-xl border border-studio-border bg-studio-surface/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-studio-border">
                  <TableHead className="font-mono text-xs text-studio-muted">Provider</TableHead>
                  <TableHead className="font-mono text-xs text-studio-muted">Plan & Cycle</TableHead>
                  <TableHead className="font-mono text-xs text-studio-muted">Amount</TableHead>
                  <TableHead className="font-mono text-xs text-studio-muted">Sender Number</TableHead>
                  <TableHead className="font-mono text-xs text-studio-muted">Transaction ID</TableHead>
                  <TableHead className="font-mono text-xs text-studio-muted">Status</TableHead>
                  <TableHead className="font-mono text-xs text-studio-muted">Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentRequests.map((request) => (
                  <TableRow key={request.id} className="border-b border-studio-border/50">
                    <TableCell className="font-semibold text-studio-foreground font-mono">
                      {request.provider}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize font-mono text-xs">
                        {request.plan} ({request.billingCycle.toLowerCase()})
                      </span>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-studio-foreground">
                      ৳{request.amount.toLocaleString("en-US")}
                    </TableCell>
                    <TableCell className="font-mono text-studio-muted">
                      {request.senderNumber}
                    </TableCell>
                    <TableCell className="font-mono font-medium text-studio-foreground">
                      {request.transactionId}
                    </TableCell>
                    <TableCell>
                      <Badge variant={PAYMENT_STATUS_VARIANT[request.status]}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-studio-muted font-mono whitespace-nowrap">
                      {formatDateTime(request.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
