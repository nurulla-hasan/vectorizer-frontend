"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type AuthUser,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationOtp,
  verifyEmailOtp,
} from "../api/auth.api";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";

export const AUTH_ME_QUERY_KEY = ["auth-me"] as const;

/**
 * Fetch the currently authenticated user's session & credits.
 */
export function useGetMe() {
  return useQuery<AuthUser | null>({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: getMe,
    retry: false,
    staleTime: 30_000,
  });
}

/**
 * Sign in a user and refresh cached session state.
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });
}

/**
 * Register a new account (triggers email OTP verification).
 */
export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}

/**
 * Verify registration email OTP and hydrate the signed-in session.
 */
export function useVerifyEmailOtp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyEmailOtp,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });
}

/**
 * Resend the email verification OTP code.
 */
export function useResendVerificationOtp() {
  return useMutation({
    mutationFn: resendVerificationOtp,
  });
}

/**
 * Sign out the current user and clear cached auth state.
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: async () => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
      successToast("Signed out", "You have been logged out.");
    },
    onError: (error: unknown) => {
      errorToast("Logout failed", getErrorMessage(error, "Could not log out."));
    },
  });
}
