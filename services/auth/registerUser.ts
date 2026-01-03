/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
"use server"

import { registerValidationZodSchema } from "@/app/zod/auth.validation";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { loginUser } from "./loginUser";




export const registerUser = async (_currentState: any, formData: FormData): Promise<any> => {
    try {
     

        // FormData থেকে values নেওয়া
        const payload = {
            name: formData.get('name')?.toString()?.trim() || '',
            fullName: formData.get('name')?.toString()?.trim() || '',
            email: formData.get('email')?.toString()?.trim() || '',
            password: formData.get('password')?.toString() || '',
            bio: formData.get('bio')?.toString()?.trim() || '',
            avatarUrl: formData.get('avatarUrl')?.toString()?.trim() || '',
            city: formData.get('city')?.toString()?.trim() || '',
            interests: formData.get('interests')?.toString()?.trim() || '',
        }



if(zodValidator(payload,registerValidationZodSchema).success === false){
    return zodValidator(payload, registerValidationZodSchema)
}
const validatedPayload : any = zodValidator(payload, registerValidationZodSchema).data
        // API-এর জন্য data prepare করা
        const registerData = {
            name: validatedPayload.name,
            fullName: validatedPayload.fullName,
            email: validatedPayload.email,
            password: validatedPayload.password,
            ...(validatedPayload.bio && { bio: validatedPayload.bio }),
            ...(validatedPayload.avatarUrl && { avatarUrl: validatedPayload.avatarUrl }),
            ...(validatedPayload.city && { city: validatedPayload.city }),
            ...(validatedPayload.interests && { 
                interests: validatedPayload.interests.split(',').map((i: string) => i.trim()).filter((i: any) => i)
            }),
            role: "USER", // default role
            needPasswordChange: true,
            ratingAvg: 0,
            ratingCount: 0
        }

        
            const newFormData = new FormData();
            newFormData.append("data", JSON.stringify(registerData));
   if(formData.get("file")) {
    newFormData.append("file", formData.get("file")as Blob)
   }
        // API call
        const res = await serverFetch.post("/auth/register", {
          
            body: newFormData
        })

     const result = await res.json();

      

        if (result.success) {
            await loginUser(_currentState, formData);
        }

        return result;

    } catch (error: any) {
         if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.log("Registration error:", error);
            return { success: false, message: `${process.env.NODE_ENV === 'development' ? error.message : "Login Failed. You might have entered incorrect email or password."}` };
    }

    
}