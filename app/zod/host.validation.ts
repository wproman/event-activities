import { z } from "zod";

export const createHostZodValidationSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  bio: z.string().nullable().optional(),
  avatarUrl: z.string().url("Invalid URL").optional().nullable(),
  interests: z.array(z.string()).optional(),
  city: z.string().nullable().optional(),
  ratingAvg: z.number().optional().default(0),
  ratingCount: z.number().optional().default(0),
  needPasswordChange: z.boolean().optional().default(true),
});

export const updateHostZodValidationSchema = z.object({
  name: z.string().optional(),
  fullName: z.string().optional(),
  bio: z.string().nullable().optional(),
  avatarUrl: z.string().url("Invalid URL").optional().nullable(),
  interests: z.array(z.string()).optional(),
  city: z.string().nullable().optional(),
  ratingAvg: z.number().optional(),
  ratingCount: z.number().optional(),
  needPasswordChange: z.boolean().optional(),
});
