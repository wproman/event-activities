/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { loginUser } from "./loginUser";

export const createHost = async (
  _currentState: any,
  formData: FormData,
): Promise<any> => {
  try {
    // FormData থেকে values নেওয়া
    const payload = {
      name: formData.get("name")?.toString()?.trim() || "",
      fullName: formData.get("name")?.toString()?.trim() || "",
      email: formData.get("email")?.toString()?.trim() || "",
      password: formData.get("password")?.toString() || "",
      bio: formData.get("bio")?.toString()?.trim() || "",
      avatarUrl: formData.get("avatarUrl")?.toString()?.trim() || "",
      city: formData.get("city")?.toString()?.trim() || "",
      interests: formData.get("interests")?.toString()?.trim() || "",
    };

    // API-এর জন্য data prepare করা - HOST হিসেবে
    const hostData = {
      name: payload.name,
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      ...(payload.bio && { bio: payload.bio }),
      ...(payload.avatarUrl && {
        avatarUrl: payload.avatarUrl,
      }),
      ...(payload.city && { city: payload.city }),
      ...(payload.interests && {
        interests: payload.interests
          .split(",")
          .map((i: string) => i.trim())
          .filter((i: any) => i),
      }),
      role: "HOST", // HOST role
      needPasswordChange: true,
      ratingAvg: 0,
      ratingCount: 0,
    };

    const newFormData = new FormData();
    newFormData.append("data", JSON.stringify(hostData));
    
    // যদি file upload থাকে
    if (formData.get("file")) {
      newFormData.append("file", formData.get("file") as Blob);
    }

    // API call to your backend endpoint
    const res = await serverFetch.post("/users/create-host", {
      body: newFormData,
    });

    const result = await res.json();

    // যদি success হয়, auto login করানো
    if (result.success) {
      await loginUser(_currentState, formData);
    }

    return result;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.log("Host registration error:", error);
    return {
      success: false,
      message: `${process.env.NODE_ENV === "development" ? error.message : "Failed to create host account. Please try again."}`,
    };
  }
};