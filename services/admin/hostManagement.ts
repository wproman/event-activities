/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { IUser } from "@/app/types/host.interface";
import { createHostZodValidationSchema, updateHostZodValidationSchema } from "@/app/zod/host.validation";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";





export async function createHost(_prevState: any, formData: FormData) {
    try {
        const payload: IUser = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            fullName: formData.get("fullName") as string,
            bio: formData.get("bio") as string || null,
            avatarUrl: formData.get("avatarUrl") as string || "",
            interests: (formData.get("interests") as string)?.split(",") || [],
            city: formData.get("city") as string || null,
            needPasswordChange: formData.get("needPasswordChange") === "true",
        }
        
        if (zodValidator(payload, createHostZodValidationSchema).success === false) {
            return zodValidator(payload, createHostZodValidationSchema);
        }

        const validatedPayload = zodValidator(payload, createHostZodValidationSchema).data;

        if (!validatedPayload) {
            throw new Error("Invalid payload");
        }

        const newPayload = {
           name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            fullName: formData.get("fullName") as string,
            bio: formData.get("bio") as string || null,
            avatarUrl: formData.get("avatarUrl") as string || null,
            interests: (formData.get("interests") as string)?.split(",") || [],
            city: formData.get("city") as string || null,
            needPasswordChange: formData.get("needPasswordChange") === "true",
        }
        
        const newFormData = new FormData()
        newFormData.append("data", JSON.stringify(newPayload))

        if (formData.get("file")) {
            newFormData.append("file", formData.get("file") as Blob)
        }

        const response = await serverFetch.post("/users/create-host", {
            body: newFormData,
        })

        const result = await response.json();
        return result;
        
    } catch (error: any) {
        console.log(error);
        return { 
            success: false, 
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}` 
        }
    }
}

export async function getHosts(queryString?: string) {
    try {
        const response = await serverFetch.get(`/host${queryString ? `?${queryString}` : ""}`);
        const result = await response.json();
        return result;
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        };
    }
}

export async function getHostById(id: string) {
    try {
        const response = await serverFetch.get(`/host/${id}`)
        const result = await response.json();
        return result;
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        };
    }
}

export async function updateHost(id: string, _prevState: any, formData: FormData) {
    try {
        const payload: Partial<IUser> = {
            name: formData.get("name") as string,
            fullName: formData.get("fullName") as string,
            bio: formData.get("bio") as string || null,
            avatarUrl: formData.get("avatarUrl") as string || null,
            interests: (formData.get("interests") as string)?.split(",") || [],
            city: formData.get("city") as string || null,
            ratingAvg: formData.get("ratingAvg") ? Number(formData.get("ratingAvg")) : undefined,
            ratingCount: formData.get("ratingCount") ? Number(formData.get("ratingCount")) : undefined,
            needPasswordChange: formData.get("needPasswordChange") === "true",
        }
        
        const validatedPayload = zodValidator(payload, updateHostZodValidationSchema).data;

        const response = await serverFetch.patch(`/host/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedPayload),
        })
        
        const result = await response.json();
        return result;
        
    } catch (error: any) {
        console.log(error);
        return { 
            success: false, 
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}` 
        }
    }
}

export async function softDeleteHost(id: string) {
    try {
        const response = await serverFetch.delete(`/host/soft/${id}`)
        const result = await response.json();
        return result;
        
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        };
    }
}

export async function deleteHost(id: string) {
    try {
        const response = await serverFetch.delete(`/host/${id}`)
        const result = await response.json();
        return result;
        
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        };
    }
}