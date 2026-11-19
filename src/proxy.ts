import type { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  AUTH_ROUTES,
  PRIVATE_ROUTES,
  getSafeRedirectUrl,
} from "@/constant/routes";
import { API_BASE_URL } from "@/lib/api-client";
import { jwtUtils } from "@/lib/jwt";

export interface TokenPayload extends JwtPayload {
  id?: string;
  email?: string;
  role?: "USER" | "ADMIN";
}

const REFRESH_BEFORE_EXPIRY = 5 * 60; // 5 minutes in seconds

function verifyToken(token?: string): TokenPayload | null {
  return jwtUtils.verifyToken<TokenPayload>(token);
}

function isTokenExpiringSoon(session: TokenPayload | null): boolean {
  if (!session?.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return session.exp - now <= REFRESH_BEFORE_EXPIRY;
}

async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.data?.accessToken ?? null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isPrivateRoute = PRIVATE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let session = verifyToken(accessToken);
  let newAccessToken: string | null = null;

  // Refresh if token is expired/missing or expiring within 5 minutes
  if (refreshToken && (!session || isTokenExpiringSoon(session))) {
    const refreshedToken = await refreshAccessToken(refreshToken);

    if (refreshedToken) {
      const refreshedSession = verifyToken(refreshedToken);
      if (refreshedSession) {
        session = refreshedSession;
        newAccessToken = refreshedToken;
      }
    }
  }

  const isAuthenticated = Boolean(session?.id);

  let response: NextResponse | null = null;

  // 1. Unauthenticated user trying to access a private route -> redirect to /auth/login
  if (isPrivateRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    response = NextResponse.redirect(loginUrl);
  }
  // 2. Authenticated user trying to access auth pages -> redirect to callbackUrl or home
  else if (isAuthRoute && isAuthenticated) {
    const redirectTarget = getSafeRedirectUrl(
      request.nextUrl.searchParams.get("callbackUrl"),
    );
    response = NextResponse.redirect(new URL(redirectTarget, request.url));
  }

  if (!response) {
    response = NextResponse.next();
  }

  // Store new access token in browser cookie if refreshed
  if (newAccessToken && session?.exp) {
    const now = Math.floor(Date.now() / 1000);

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.max(session.exp - now, 0),
    });
  }

  return response;
}

export default proxy;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|assets|.*\\..*).*)",
  ],
};
