/* eslint-disable @typescript-eslint/no-explicit-any */
import z from "zod";
export const loginValidationZodSchema = z.object({
  email: z.email({
    message: "Email is required",
  }),
  password: z
    .string("Password is required")
    .min(6, {
      error: "Password is required and must be at least 6 characters long",
    })
    .max(100, {
      error: "Password must be at most 100 characters long",
    }),
});

export const registerValidationZodSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  password: z.string().min(6, {
    message: "Password is required and must be at least 6 characters long",
  }),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  city: z.string().optional(),
  interests: z.string().optional(),
});
