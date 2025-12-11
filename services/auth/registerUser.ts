/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import z from "zod";

// Zod schema আপনার IUser interface অনুযায়ী
const registerValidationZodSchema = z.object({
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

export const registerUser = async (_currentState: any, formData: FormData): Promise<any> => {
    try {
     

        // FormData থেকে values নেওয়া
        const validationData = {
            name: formData.get('name')?.toString()?.trim() || '',
            fullName: formData.get('name')?.toString()?.trim() || '',
            email: formData.get('email')?.toString()?.trim() || '',
            password: formData.get('password')?.toString() || '',
            bio: formData.get('bio')?.toString()?.trim() || '',
            avatarUrl: formData.get('avatarUrl')?.toString()?.trim() || '',
            city: formData.get('city')?.toString()?.trim() || '',
            interests: formData.get('interests')?.toString()?.trim() || '',
        }

        console.log("Validation Data:", validationData);

        const validatedFields = registerValidationZodSchema.safeParse(validationData);

        console.log("Validation Result:", validatedFields);

        if (!validatedFields.success) {
            return {
                success: false,
                errors: validatedFields.error.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message,
                }))
            }
        }

        // API-এর জন্য data prepare করা
        const registerData = {
            name: validatedFields.data.name,
            fullName: validatedFields.data.fullName,
            email: validatedFields.data.email,
            password: validatedFields.data.password,
            ...(validatedFields.data.bio && { bio: validatedFields.data.bio }),
            ...(validatedFields.data.avatarUrl && { avatarUrl: validatedFields.data.avatarUrl }),
            ...(validatedFields.data.city && { city: validatedFields.data.city }),
            ...(validatedFields.data.interests && { 
                interests: validatedFields.data.interests.split(',').map(i => i.trim()).filter(i => i)
            }),
            role: "USER", // default role
            needPasswordChange: true,
            ratingAvg: 0,
            ratingCount: 0
        }

        console.log("Sending to API:", registerData);
            const newFormData = new FormData();
            newFormData.append("data", JSON.stringify(registerData));

        // API call
        const res = await fetch("http://localhost:5000/api/v1/auth/register", {
            method: "POST",
          
            body: newFormData
        }).then(res => res.json());

      return res;

    } catch (error) {
        console.log("Registration error:", error);
        return { error: "Registration failed" };
    }

    
}