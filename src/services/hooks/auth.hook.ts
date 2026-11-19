"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AUTH_ME_QUERY_KEY,
  type AuthUser,
  changePassword,
  forgotPassword,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  resendResetOtp,
  resendVerificationOtp,
  resetPassword,
  verifyEmailOtp,
  verifyResetOtp,
} from "../api/auth.api";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";

export { AUTH_ME_QUERY_KEY };

/**
 * Fetch the currently authenticated user's session & credits.
 */
export function useGetMe() {
  return useQuery<AuthUser | null>({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: () => getMe(),
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

/**
 * Change the signed-in user's password.
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}

/**
 * Request a password reset OTP email.
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

/**
 * Resend the password reset OTP email.
 */
export function useResendResetOtp() {
  return useMutation({
    mutationFn: resendResetOtp,
  });
}

/**
 * Verify a password reset OTP code before resetting password.
 */
export function useVerifyResetOtp() {
  return useMutation({
    mutationFn: verifyResetOtp,
  });
}

/**
 * Reset password using email, verified OTP, and new password.
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}
