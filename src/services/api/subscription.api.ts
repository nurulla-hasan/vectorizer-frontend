import { apiClient } from "@/lib/api-client";
import type { UserPlan } from "./auth.api";

export type PaymentProvider = "BKASH" | "NAGAD" | "ROCKET";
export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED";
export type BillingCycle = "MONTHLY" | "YEARLY";

export interface PlanPrice {
  billingCycle: BillingCycle;
  amountBdt: number;
  period: string;
}

export interface PlanDefinition {
  code: UserPlan;
  label: string;
  description: string;
  creditsLimit: number | null;
  unlimited: boolean;
  prices: PlanPrice[];
}

export interface PaymentMethod {
  provider: PaymentProvider;
  label: string;
  number: string;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  plan: UserPlan;
  billingCycle: BillingCycle;
  provider: PaymentProvider;
  amount: number;
  senderNumber: string;
  transactionId: string;
  status: PaymentStatus;
  adminNote: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPaymentRequest extends PaymentRequest {
  user: {
    id: string;
    name: string;
    email: string;
    plan: UserPlan;
  };
}

interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export async function getPlans(): Promise<PlanDefinition[]> {
  const res = await apiClient<ApiEnvelope<{ plans: PlanDefinition[] }>>(
    "/subscription/plans",
  );
  return res.data.plans;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const res = await apiClient<ApiEnvelope<{ methods: PaymentMethod[] }>>(
    "/subscription/payment-methods",
  );
  return res.data.methods;
}

export async function createPaymentRequest(payload: {
  plan: Exclude<UserPlan, "FREE">;
  billingCycle: BillingCycle;
  provider: PaymentProvider;
  senderNumber: string;
  transactionId: string;
}): Promise<PaymentRequest> {
  const res = await apiClient<ApiEnvelope<{ request: PaymentRequest }>>(
    "/subscription/requests",
    { method: "POST", body: payload },
  );
  return res.data.request;
}

export async function getMyPaymentRequests(): Promise<PaymentRequest[]> {
  const res = await apiClient<ApiEnvelope<{ requests: PaymentRequest[] }>>(
    "/subscription/requests/me",
  );
  return res.data.requests;
}

export async function listPaymentRequests(status?: PaymentStatus): Promise<
  AdminPaymentRequest[]
> {
  const res = await apiClient<ApiEnvelope<{ requests: AdminPaymentRequest[] }>>(
    "/subscription/requests",
    { query: status ? { status } : undefined },
  );
  return res.data.requests;
}

export async function approvePaymentRequest(
  id: string,
): Promise<PaymentRequest> {
  const res = await apiClient<ApiEnvelope<{ request: PaymentRequest }>>(
    `/subscription/requests/${id}/approve`,
    { method: "PATCH" },
  );
  return res.data.request;
}

export async function rejectPaymentRequest(
  id: string,
  note: string,
): Promise<PaymentRequest> {
  const res = await apiClient<ApiEnvelope<{ request: PaymentRequest }>>(
    `/subscription/requests/${id}/reject`,
    { method: "PATCH", body: { note } },
  );
  return res.data.request;
}
