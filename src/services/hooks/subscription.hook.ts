"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approvePaymentRequest,
  createPaymentRequest,
  getMyPaymentRequests,
  getPaymentMethods,
  getPlans,
  listPaymentRequests,
  type PaymentStatus,
  rejectPaymentRequest,
} from "../api/subscription.api";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";
import { AUTH_ME_QUERY_KEY } from "./auth.hook";

export const subscriptionKeys = {
  plans: ["subscription", "plans"] as const,
  paymentMethods: ["subscription", "payment-methods"] as const,
  myRequests: ["subscription", "my-requests"] as const,
  adminRequests: (status?: PaymentStatus) =>
    ["subscription", "admin-requests", status ?? "ALL"] as const,
};

export function usePlans() {
  return useQuery({
    queryKey: subscriptionKeys.plans,
    queryFn: getPlans,
    staleTime: 5 * 60_000,
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: subscriptionKeys.paymentMethods,
    queryFn: getPaymentMethods,
    staleTime: 5 * 60_000,
  });
}

// Shared across every component observing the query so the approval toast and
// auth refresh fire once, not once per mounted consumer.
const requestStatusCache = new Map<string, PaymentStatus>();

/**
 * My payment requests. While one is pending we poll, and the moment it flips
 * to APPROVED we refresh the cached session so the plan/credits UI updates.
 */
export function useMyPaymentRequests(options?: { enabled?: boolean }) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: subscriptionKeys.myRequests,
    queryFn: getMyPaymentRequests,
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
    refetchInterval: (q) => {
      const requests = q.state.data;
      if (!requests) return false;
      return requests.some((request) => request.status === "PENDING")
        ? 15_000
        : false;
    },
  });

  React.useEffect(() => {
    const requests = query.data;
    if (!requests) return;

    let justApproved = false;
    for (const request of requests) {
      if (
        requestStatusCache.get(request.id) === "PENDING" &&
        request.status === "APPROVED"
      ) {
        justApproved = true;
      }
      requestStatusCache.set(request.id, request.status);
    }

    if (justApproved) {
      successToast(
        "Plan activated",
        "Your payment was approved and your new plan is now active.",
      );
      void queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    }
  }, [query.data, queryClient]);

  return query;
}

export function useCreatePaymentRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPaymentRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: subscriptionKeys.myRequests,
      });
      successToast(
        "Payment submitted",
        "We received your request. An admin will verify it shortly.",
      );
    },
    onError: (error: unknown) => {
      errorToast(
        "Could not submit payment",
        getErrorMessage(error, "Please check the details and try again."),
      );
    },
  });
}

export function useAdminPaymentRequests(status?: PaymentStatus) {
  return useQuery({
    queryKey: subscriptionKeys.adminRequests(status),
    queryFn: () => listPaymentRequests(status),
    refetchInterval: status === "PENDING" ? 20_000 : false,
  });
}

export function useApprovePaymentRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approvePaymentRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.adminRequests("PENDING"),
        }),
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.adminRequests(undefined),
        }),
      ]);
      successToast("Payment approved", "The user's plan has been updated.");
    },
    onError: (error: unknown) => {
      errorToast(
        "Approval failed",
        getErrorMessage(error, "Could not approve this payment request."),
      );
    },
  });
}

export function useRejectPaymentRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      rejectPaymentRequest(id, note),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.adminRequests("PENDING"),
        }),
        queryClient.invalidateQueries({
          queryKey: subscriptionKeys.adminRequests(undefined),
        }),
      ]);
      successToast("Payment rejected", "The user can submit a new request.");
    },
    onError: (error: unknown) => {
      errorToast(
        "Rejection failed",
        getErrorMessage(error, "Could not reject this payment request."),
      );
    },
  });
}
