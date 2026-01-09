/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation */
"use server";

import { loginValidationZodSchema } from "@/app/zod/auth.validation";
import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/auth-utils";
import { cleanJwtSecret } from "@/lib/jwt-utils";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";
import { setCookie } from "./tokenHandlers";

// export const loginUser = async (
//   _currentState: any,
//   formData: any,
// ): Promise<any> => {
//   try {
//     const redirectTo = formData.get("redirect") || null;
//     let accessTokenObject: null | any = null;
//     let refreshTokenObject: null | any = null;
//     const payload = {
//       email: formData.get("email"),
//       password: formData.get("password"),
//     };

//     if (zodValidator(payload, loginValidationZodSchema).success === false) {
//       return zodValidator(payload, loginValidationZodSchema);
//     }
//     const validatedPayload = zodValidator(
//       payload,
//       loginValidationZodSchema,
//     ).data;
//     const res = await serverFetch.post("/auth/login", {
//       body: JSON.stringify(validatedPayload),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const result = await res.json();
//     const setCookieHeaders = res.headers.getSetCookie();

//     if (setCookieHeaders && setCookieHeaders.length > 0) {
//       setCookieHeaders.forEach((cookie: string) => {
//         const parsedCookie = parse(cookie);

//         if (parsedCookie["accessToken"]) {
//           accessTokenObject = parsedCookie;
//         }
//         if (parsedCookie["refreshToken"]) {
//           refreshTokenObject = parsedCookie;
//         }
//       });
//     } else {
//       throw new Error("No Set-Cookie header found");
//     }

//     if (!accessTokenObject) {
//       throw new Error("Tokens not found in cookies");
//     }

//     if (!refreshTokenObject) {
//       throw new Error("Tokens not found in cookies");
//     }

//     await setCookie("accessToken", accessTokenObject.accessToken, {
//       secure: true,
//       httpOnly: true,
//       maxAge: parseInt(accessTokenObject["Max-Age"]) || 1000 * 60 * 60,
//       path: accessTokenObject.Path || "/",
//       sameSite: accessTokenObject["SameSite"] || "none",
//     });

//     await setCookie("refreshToken", refreshTokenObject.refreshToken, {
//       secure: true,
//       httpOnly: true,
//       maxAge:
//         parseInt(refreshTokenObject["Max-Age"]) || 1000 * 60 * 60 * 24 * 90,
//       path: refreshTokenObject.Path || "/",
//       sameSite: refreshTokenObject["SameSite"] || "none",
//     });
//     const verifiedToken: JwtPayload | string = jwt.verify(
//       accessTokenObject.accessToken,
//       process.env.JWT_ACCESS_SECRET as string,
//     );

//     if (typeof verifiedToken === "string") {
//       throw new Error("Invalid token");
//     }

//     const userRole: UserRole = verifiedToken.role;
//     if (!result.success) {
//       throw new Error(result.message || "Login failed");
//     }

//     if (redirectTo) {
//       const requestedPath = redirectTo.toString();
//       if (isValidRedirectForRole(requestedPath, userRole)) {
//         redirect(`${requestedPath}?loggedIn=true`);
//       } else {
//         redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
//       }
//     } else {
//       redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
//     }
//   } catch (error: any) {
//     // Re-throw NEXT_REDIRECT errors so Next.js can handle them
//     if (error?.digest?.startsWith("NEXT_REDIRECT")) {
//       throw error;
//     }
//     console.log(error);
//     return {
//       success: false,
//       message: `${process.env.NODE_ENV === "development" ? error.message : "Login Failed. You might have entered incorrect email or password."}`,
//     };
//   }
// };

// In /services/auth/loginUser.ts
export const loginUser = async (
  _currentState: any,
  formData: any,
): Promise<any> => {
  try {
    const redirectTo = formData.get("redirect") || null;
    
    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    // Validate input
    const validation = zodValidator(payload, loginValidationZodSchema);
    if (validation.success === false) {
      return validation;
    }
    
    const validatedPayload = validation.data;

    // Make API call to backend
    const res = await serverFetch.post("/auth/login", {
      body: JSON.stringify(validatedPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const result = await res.json();
    
    // Check if login was successful
    if (!result.success) {
      throw new Error(result.message || "Login failed");
    }

    // Get tokens from RESPONSE BODY
    const { accessToken, refreshToken } = result.data;

    if (!accessToken || !refreshToken) {
      throw new Error("Tokens not found in response");
    }

    // Store tokens in localStorage (for client-side access)
    // Note: You'll need to pass these to middleware via cookies
    
    // Store tokens in cookies for middleware access
    await setCookie("accessToken", accessToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: "/",
      sameSite: "lax",
    });

    await setCookie("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
      sameSite: "lax",
    });

    // Also store in localStorage for client-side use
    // You'll need a client-side context/provider for this
    
    // Get user role from token (optional)
    let userRole: UserRole = "USER"; // default
    try {
      const cleanedSecret = cleanJwtSecret(process.env.JWT_ACCESS_SECRET as string);
      const verifiedToken: JwtPayload | string = jwt.verify(
        accessToken,
        cleanedSecret,
      );
      
      if (typeof verifiedToken !== "string") {
        userRole = verifiedToken.role;
      }
    } catch (jwtError) {
      console.warn("JWT verification in login failed:", jwtError);
      // Continue anyway, middleware will verify
    }

    // Handle redirection
    const redirectPath = redirectTo && isValidRedirectForRole(redirectTo.toString(), userRole) 
      ? redirectTo.toString()
      : getDefaultDashboardRoute(userRole);

    redirect(`${redirectPath}?loggedIn=true`);
    
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    
    console.error("Login Error:", error);
    
    return {
      success: false,
      message: process.env.NODE_ENV === "development" 
        ? error.message || "Login failed"
        : "Login Failed. You might have entered incorrect email or password.",
    };
  }
};