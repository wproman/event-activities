/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookie } from "../auth/tokenHandlers";

const approveEvent = async (eventId: string, isApproved: boolean) => {
  try {
    const accessToken = await getCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "User is not authenticated!",
      };
    }

    // CORRECT: /event/{id}/approve (not /admin/event/{id}/approve)
    // But likely under admin routes, so: /admin/event/{id}/approve
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/event/${eventId}/approve`,
      {
        method: "PATCH", // CORRECT METHOD: PATCH
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ isApproved }), // REQUIRED BODY
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      return {
        success: false,
        message: errorData?.message || "Failed to approve event",
      };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error?.message || "Unexpected error occurred",
    };
  }
};

export default approveEvent;