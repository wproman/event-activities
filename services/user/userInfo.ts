/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation*/
"use server";

import { serverFetch } from "@/lib/server-fetch"; // Adjust the path if needed

const userInfo = async () => {
  try {
    const response = await serverFetch.get("/users/me");

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Request failed",
        status: response.status,
      };
    }

    const result = await response.json();

    console.log("first", result)
    return {
      success: true,
      data: result.data || result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "An unknown error occurred",
    };
  }
};

export default userInfo;
