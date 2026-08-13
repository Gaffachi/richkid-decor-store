import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

/**
 * Edge-safe gate: only checks the session cookie's presence (Admin SDK can't
 * run on the edge runtime). Full verification — signature, expiry, revocation,
 * and (for /admin) role — happens server-side in the relevant layout via
 * getCurrentUser() / getAdminUser().
 */
const publicAccountPaths = ["/account/login", "/account/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (publicAccountPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
  if (!hasSession) {
    const loginUrl = new URL("/account/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
