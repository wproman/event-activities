import jwt, { JwtPayload } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from './lib/auth-utils';
import { deleteCookie } from './services/auth/tokenHandlers';

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    
    // Debug logging
    console.log('🔍 Middleware path:', pathname);
    console.log('🔍 NODE_ENV:', process.env.NODE_ENV);

    const accessToken = request.cookies.get("accessToken")?.value || null;
    console.log('🔍 Access token exists:', !!accessToken);
    
    if (accessToken) {
        console.log('🔍 Token preview:', accessToken.substring(0, 50) + '...');
    }

    let userRole: UserRole | null = null;
    
    if (accessToken) {
        try {
            console.log('🔐 Attempting token verification...');
            
            // Get JWT secret with fallback
            const jwtSecret = process.env.JWT_ACCESS_SECRET;
            console.log('🔐 JWT_SECRET exists:', !!jwtSecret);
            
            if (!jwtSecret) {
                throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
            }
            
            // Verify token with clock tolerance for time sync issues
            const verifiedToken: JwtPayload | string = jwt.verify(
                accessToken, 
                jwtSecret,
                {
                    clockTolerance: 300, // Allow 5 minutes of clock skew
                    ignoreExpiration: false
                }
            );

            console.log('✅ Token verified successfully!');
            
            if (typeof verifiedToken === "string") {
                console.log('⚠️ Token is string type (unexpected)');
                await deleteCookie("accessToken");
                await deleteCookie("refreshToken");
                return NextResponse.redirect(new URL('/login', request.url));
            }

            userRole = verifiedToken.role;
            console.log('👤 User role:', userRole);
            
            // Debug: Check token timestamps
            if (verifiedToken.iat && verifiedToken.exp) {
                console.log('⏰ Token issued at:', new Date(verifiedToken.iat * 1000).toISOString());
                console.log('⏰ Token expires at:', new Date(verifiedToken.exp * 1000).toISOString());
                console.log('⏰ Current time:', new Date().toISOString());
                console.log('⏰ Seconds until expiry:', verifiedToken.exp - Math.floor(Date.now() / 1000));
            }
            
        } catch (error: any) {
            console.error('❌ Token verification failed:', error.message);
            
            // Log specific error details
            if (error.name === 'TokenExpiredError') {
                console.error('⏰ Token expired at:', error.expiredAt);
                console.error('⏰ Current time:', new Date().toISOString());
            }
            
            await deleteCookie("accessToken");
            await deleteCookie("refreshToken");
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    const routerOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // Rule 1: User is logged in and trying to access auth route
    if (accessToken && isAuth) {
        console.log('↪️ Redirecting authenticated user from auth route to dashboard');
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
    }

    // Rule 2: User is trying to access open public route
    if (routerOwner === null) {
        console.log('✅ Public route - allowing access');
        return NextResponse.next();
    }

    // Rule 3: Protected route without token
    if (!accessToken) {
        console.log('🔒 Protected route without token - redirecting to login');
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Rule 4: Common protected route
    if (routerOwner === "COMMON") {
        console.log('✅ Common protected route - allowing access');
        return NextResponse.next();
    }

    // Rule 5: Role-based protected route
    if (routerOwner === "ADMIN" || routerOwner === "HOST" || routerOwner === "USER") {
        if (userRole !== routerOwner) {
            console.log(`🚫 Role mismatch: User is ${userRole}, route requires ${routerOwner}`);
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
        }
        console.log(`✅ Role-based route access granted: ${userRole}`);
    }

    console.log('✅ All checks passed - allowing access');
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
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ],
};