/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookie } from "../auth/tokenHandlers";

// utils/eventJoining.ts
const eventJoining = async (eventId: string) => {
  try {
    const accessToken = await getCookie("accessToken");
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/${eventId}/join`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    
    // Log for debugging
    console.log("Join event response:", {
      status: response.status,
      ok: response.ok,
      data: data
    });
    
    // Return whatever the backend sends
    return data;
    
  } catch (error: any) {
    console.log("Join event error:", error);
    return { 
      success: false, 
      message: error.message || "Network error joining event" 
    };
  }
};
export default eventJoining;
