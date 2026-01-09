import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getRouteOwner,
  isAuthRoute
} from "./lib/auth-utils";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken")?.value || null;
  const refreshToken = request.cookies.get("refreshToken")?.value || null;

  // Just check if token exists, don't verify it
  const hasValidToken = accessToken && refreshToken;

  const isAuth = isAuthRoute(pathname);

  // Rule 1: User is logged in and trying to access auth route
  if (hasValidToken && isAuth) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url), // Simple redirect
    );
  }

  // Rule 2: Open public route
  if (getRouteOwner(pathname) === null) {
    return NextResponse.next();
  }

  // Rule 3: Protected route without token
  if (!hasValidToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User has token, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
