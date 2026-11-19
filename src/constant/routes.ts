export const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
] as const;

export const PRIVATE_ROUTES: readonly string[] = [];

export const USER_HOME = "/";

/**
 * Returns a safe relative redirect path (prevents open-redirect URLs like `//evil.com`),
 * falling back to `USER_HOME` ("/") when no valid `callbackUrl` is provided.
 */
export function getSafeRedirectUrl(
  callbackUrl?: string | null,
  fallback: string = USER_HOME,
): string {
  if (!callbackUrl) return fallback;
  if (callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
    return callbackUrl;
  }
  return fallback;
}
