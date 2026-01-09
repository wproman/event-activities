import jwt, { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/auth-utils";
import { deleteCookie } from "./services/auth/tokenHandlers";

// Helper function to clean JWT secret (remove surrounding quotes)
const cleanJwtSecret = (secret: string): string => {
  if (!secret) return secret;
  
  // Remove surrounding double quotes
  if (secret.startsWith('"') && secret.endsWith('"')) {
    return secret.slice(1, -1);
  }
  
  // Remove surrounding single quotes
  if (secret.startsWith("'") && secret.endsWith("'")) {
    return secret.slice(1, -1);
  }
  
  return secret;
};

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get("accessToken")?.value || null;

  let userRole: UserRole | null = null;
  if (accessToken) {
    try {
      // Get and clean the JWT secret
      const rawSecret = process.env.JWT_ACCESS_SECRET as string;
      const cleanedSecret = cleanJwtSecret(rawSecret);
      
      // Debug logging (remove in production)
      console.log("JWT Debug:", {
        hasToken: !!accessToken,
        tokenLength: accessToken?.length,
        rawSecretLength: rawSecret?.length,
        cleanedSecretLength: cleanedSecret?.length,
        rawSecretFirstLast: rawSecret ? `${rawSecret[0]}...${rawSecret[rawSecret.length - 1]}` : 'none',
        cleanedSecretFirstLast: cleanedSecret ? `${cleanedSecret[0]}...${cleanedSecret[cleanedSecret.length - 1]}` : 'none'
      });

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
      // Token is invalid, expired, or malformed
      console.error("Token verification failed:", error.message);
      console.error("Error details:", error);
      
      // Try one more approach - check if token is expired
      try {
        const rawSecret = process.env.JWT_ACCESS_SECRET as string;
        const decoded = jwt.decode(accessToken);
        console.log("Decoded token:", decoded);
      } catch (decodeError) {
        console.error("Cannot decode token:", decodeError);
      }
      
      await deleteCookie("accessToken");
      await deleteCookie("refreshToken");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const routerOwner = getRouteOwner(pathname);
  const isAuth = isAuthRoute(pathname);

  // Rule 1 : User is logged in and trying to access auth route. Redirect to default dashboard
  if (accessToken && isAuth) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
    );
  }

  // Rule 2 : User is trying to access open public route
  if (routerOwner === null) {
    return NextResponse.next();
  }

  // Rule 1 & 2 for open public routes and auth routes

  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rule 3 : User is trying to access common protected route
  if (routerOwner === "COMMON") {
    return NextResponse.next();
  }

  // Rule 4 : User is trying to access role based protected route
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