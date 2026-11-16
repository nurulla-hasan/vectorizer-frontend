import { API_BASE_URL, apiClient } from "@/lib/api-client";

export type UserPlan = "FREE" | "PRO" | "API";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  plan: UserPlan;
  credits: number;
  imageUrl?: string;
  emailVerified: boolean;
}

interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export async function getMe(): Promise<AuthUser | null> {
  try {
    const res = await apiClient<ApiEnvelope<{ user: AuthUser }>>("/auth/me");
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

export function getGoogleLoginUrl(): string {
  return `${API_BASE_URL}/auth/google`;
}
