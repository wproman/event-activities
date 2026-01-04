import { getCookie } from "../auth/tokenHandlers";

// services/eventParticipents.ts/getAllEventParticipents.ts
const getAllEventAndParticipents = async () => {
  try {
    const accessToken = await getCookie("accessToken");
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/my-events`, // ✅ Correct endpoint
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const result = await response.json();
    
    // Check if backend returned success
    if (result.success) {
      return result.data; // This is the array of event participants
    } else {
      console.error("Backend error:", result.message);
      return []; // Return empty array on failure
    }
  } catch (error: any) {
    console.log("Error fetching my events:", error);
    return []; // Return empty array on error
  }
};

export default getAllEventAndParticipents;