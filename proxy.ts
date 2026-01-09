// middleware.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/auth-utils";
import { cleanJwtSecret } from "./lib/jwt-utils"; // Import the helper
import { deleteCookie } from "./services/auth/tokenHandlers";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken")?.value || null;

  let userRole: UserRole | null = null;
  if (accessToken) {
    try {
      // Clean the JWT secret (remove quotes if present)
      const rawSecret = process.env.JWT_ACCESS_SECRET as string;
      const cleanedSecret = cleanJwtSecret(rawSecret);
      
      // Verify token with cleaned secret
      const verifiedToken: JwtPayload | string = jwt.verify(
        accessToken,
        cleanedSecret,
      );

      if (typeof verifiedToken === "string") {
        await deleteCookie("accessToken");
        await deleteCookie("refreshToken");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      userRole = verifiedToken.role;
    } catch (error: any) {
      console.error("Token verification failed:", error.message);
      
      // Debug: Log what went wrong
      console.log("Token:", accessToken?.substring(0, 50) + "...");
      console.log("Secret exists:", !!process.env.JWT_ACCESS_SECRET);
      console.log("Secret length:", process.env.JWT_ACCESS_SECRET?.length);
      
      await deleteCookie("accessToken");
      await deleteCookie("refreshToken");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const routerOwner = getRouteOwner(pathname);
  const isAuth = isAuthRoute(pathname);

  // Rule 1: User is logged in and trying to access auth route
  if (accessToken && isAuth) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
    );
  }

  // Rule 2: User is trying to access open public route
  if (routerOwner === null) {
    return NextResponse.next();
  }

  // Rule 3: Protected route without token
  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rule 4: Common protected route
  if (routerOwner === "COMMON") {
    return NextResponse.next();
  }

  // Rule 5: Role-based protected route
  if (
    routerOwner === "ADMIN" ||
    routerOwner === "HOST" ||
    routerOwner === "USER"
  ) {
    if (userRole !== routerOwner) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};