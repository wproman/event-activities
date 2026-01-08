import { getCookie } from "@/services/auth/tokenHandlers";

export const getEventParticipants = async (eventId: string) => {
  try {
    const accessToken = await getCookie("accessToken");
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/${eventId}/participants`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch participants: ${response.statusText}`);
    }

    const result = await response.json();
    return result; // Returns { success, message, data }
  } catch (error) {
    console.error("Error fetching participants:", error);
    throw error;
  }
};