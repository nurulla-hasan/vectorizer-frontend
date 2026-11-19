import { API_BASE_URL, apiClient } from "@/lib/api-client";

export type UserPlan = "FREE" | "PRO";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  plan: UserPlan;
  credits: number;
  creditsLimit?: number | null;
  unlimited?: boolean;
  imageUrl?: string;
  emailVerified: boolean;
}

interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const AUTH_ME_QUERY_KEY = ["auth-me"] as const;

export async function getMe(cookieHeader?: string): Promise<AuthUser | null> {
  try {
    const res = await apiClient<ApiEnvelope<{ user: AuthUser }>>("/auth/me", {
      ...(cookieHeader ? { headers: { cookie: cookieHeader } } : {}),
    });
    return res.data.user;
  } catch {
    return null;
  }
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const res = await apiClient<ApiEnvelope<{ user: AuthUser }>>("/auth/login", {
    method: "POST",
    body: payload,
  });
  return res.data.user;
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<{ email: string }> {
  const res = await apiClient<ApiEnvelope<{ email: string }>>("/auth/register", {
    method: "POST",
    body: payload,
  });
  return res.data;
}

export async function verifyEmailOtp(payload: {
  email: string;
  otp: string;
}): Promise<AuthUser> {
  const res = await apiClient<ApiEnvelope<{ user: AuthUser }>>(
    "/auth/verify-email",
    {
      method: "POST",
      body: payload,
    },
  );
  return res.data.user;
}

export async function resendVerificationOtp(payload: {
  email: string;
}): Promise<void> {
  await apiClient("/auth/resend-otp", {
    method: "POST",
    body: payload,
  });
}

export async function logoutUser(): Promise<void> {
  await apiClient("/auth/logout", {
    method: "POST",
  });
}

export async function changePassword(payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<string> {
  const res = await apiClient<ApiEnvelope<null>>("/auth/change-password", {
    method: "POST",
    body: payload,
  });
  return res.message;
}

export async function forgotPassword(payload: {
  email: string;
}): Promise<string> {
  const res = await apiClient<ApiEnvelope<null>>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
  return res.message;
}

export async function resendResetOtp(payload: {
  email: string;
}): Promise<string> {
  const res = await apiClient<ApiEnvelope<null>>("/auth/resend-reset-otp", {
    method: "POST",
    body: payload,
  });
  return res.message;
}

export async function verifyResetOtp(payload: {
  email: string;
  otp: string;
}): Promise<string> {
  const res = await apiClient<ApiEnvelope<null>>("/auth/verify-reset-otp", {
    method: "POST",
    body: payload,
  });
  return res.message;
}

export async function resetPassword(payload: {
  email: string;
  otp: string;
  password: string;
}): Promise<string> {
  const res = await apiClient<ApiEnvelope<null>>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
  return res.message;
}

export function getGoogleLoginUrl(): string {
  return `${API_BASE_URL}/auth/google`;
}
