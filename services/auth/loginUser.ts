/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { isValidRedirectForRole, UserRole } from "@/lib/auth-utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";
import { z } from "zod";
import { setCookie } from "./tokenHandlers";

const loginValidationZodSchema = z.object({
    email: z.email({
        message: "Email is required",
    }),
    password: z.string("Password is required").min(6, {
        error: "Password is required and must be at least 6 characters long",
    }).max(100, {
        error: "Password must be at most 100 characters long",
    }),
});

export const loginUser = async (_currentState: any, formData: any): Promise<any> => {
    try {
        const redirectTo = formData.get('redirect') || null;
        const loginData = { 
            email: formData.get('email'), 
            password: formData.get('password'), 
        }

        const validatedFields = loginValidationZodSchema.safeParse(loginData);

        if (!validatedFields.success) {
            return {
                success: false,
                errors: validatedFields.error.issues.map(issue => {
                    return {
                        field: issue.path[0],
                        message: issue.message,
                    }
                })
            }
        }

        // Make API call
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify(loginData),
            headers: {
                "Content-Type": "application/json", 
            },
        });

        if (!res.ok) {
            const result = await res.json();
            if(result.success === false && result.message === "You are blocked by admin!"){
                throw new Error("You are blocked by admin!")
            }
            throw new Error("Login failed");
        }

        // Get response BODY
        const result = await res.json();
        
        if (!result.success) {
            throw new Error(result.message || "Login failed");
        }

        const { accessToken, refreshToken } = result.data;

        if (!accessToken) {
            throw new Error("Access token not found in response");
        }

        // MANUALLY SET COOKIES from response body
        await setCookie("accessToken", accessToken, {
            secure: true,
            httpOnly: false, // Must be false for middleware to read
            maxAge: 15 * 60 * 1000, // 15 minutes
            path: "/",
            sameSite: "lax",
        });

        if (refreshToken) {
            await setCookie("refreshToken", refreshToken, {
                secure: true,
                httpOnly: false,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: "/",
                sameSite: "lax",
            });
        }

        // Verify token to get user role
        const verifiedToken: JwtPayload | string = jwt.verify(
            accessToken, 
            process.env.JWT_SECRET as string
        );

        if (typeof verifiedToken === "string") { 
            throw new Error("Invalid token"); 
        } 

        const userRole: UserRole = verifiedToken.role;

        if (redirectTo) {
            const requestedPath = redirectTo.toString();
            if (isValidRedirectForRole(requestedPath, userRole)) {
                redirect(`${requestedPath}?loggedIn=true`);
            } else {
                redirect(`/my-profile?loggedIn=true`);
            }
        } else {
            redirect(`/my-profile?loggedIn=true`);
        }
        
    } catch (error: any) {
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        
        return { 
            success: false, 
            message: error.message || "Login Failed. You might have entered incorrect email or password."
        };
    }
}