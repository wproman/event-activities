// import { getCookie } from "@/services/auth/tokenHandlers";

// export const getEventParticipants = async (eventId: string) => {
//   try {
//     const accessToken = await getCookie("accessToken");
    
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/${eventId}/participants`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to fetch participants: ${response.statusText}`);
//     }

//     const result = await response.json();
//     return result; // Returns { success, message, data }
//   } catch (error) {
//     console.error("Error fetching participants:", error);
//     throw error;
//   }
// };













import { AllParticipantsResponse, EventParticipant, ParticipantStats } from "@/app/types";
import { getCookie } from "@/services/auth/tokenHandlers";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

/**
 * Get ALL participants from ALL events hosted by the current host
 * For the ManageParticipantsPage
 */
// participantService.ts - getAllHostEventParticipants ফাংশন

export const getAllHostEventParticipants = async (): Promise<AllParticipantsResponse> => {
  try {
    const accessToken = await getCookie("accessToken");
    const apiUrl = `${BACKEND_API_URL}/participants/host/all`;
    
    console.log("🔵 [Service] Making API call to:", apiUrl);
    
    const response = await fetch(
      apiUrl,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );

    console.log("🟡 [Service] Response status:", response.status);
    
    if (!response.ok) {
      // Get error message safely
      let errorMessage = `HTTP Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If not JSON, get text
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // ✅ FIX: Directly parse the response
    const result: AllParticipantsResponse = await response.json();
    console.log("🟢 [Service] API success");
    return result;
    
  } catch (error) {
    console.error("🔴 [Service] Fetch error:", error);
    
    // Re-throw with better message
    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON response from server");
    }
    throw error;
  }
};

/**
 * Get participant statistics for host dashboard
 */
export const getParticipantStats = async (): Promise<{
  success: boolean;
  message: string;
  data: ParticipantStats;
}> => {
  try {
    const accessToken = await getCookie("accessToken");
    
    const response = await fetch(
      `${BACKEND_API_URL}/participants/host/stats`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching participant stats:", error);
    throw error;
  }
};

/**
 * Update participant status (confirm, cancel, waitlist)
 */
export const updateParticipantStatus = async (
  participantId: string, 
  status: string
): Promise<{
  success: boolean;
  message: string;
  data: EventParticipant;
}> => {
  try {
    const accessToken = await getCookie("accessToken");
    
    const response = await fetch(
      `${BACKEND_API_URL}/participants/${participantId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating participant status:", error);
    throw error;
  }
};

/**
 * Mark participant as paid
 */
export const markParticipantAsPaid = async (
  participantId: string,
  paymentData: {
    amount?: number;
    transactionId?: string;
    paymentMethod?: string;
  }
): Promise<{
  success: boolean;
  message: string;
  data: EventParticipant;
}> => {
  try {
    const accessToken = await getCookie("accessToken");
    
    const response = await fetch(
      `${BACKEND_API_URL}/participants/${participantId}/mark-paid`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(paymentData),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to mark as paid: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error marking participant as paid:", error);
    throw error;
  }
};

/**
 * Remove participant from event
 */
export const removeParticipant = async (
  participantId: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const accessToken = await getCookie("accessToken");
    
    const response = await fetch(
      `${BACKEND_API_URL}/participants/${participantId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to remove participant: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing participant:", error);
    throw error;
  }
};

/**
 * Get participants by event ID (for single event view)
 */
export const getParticipantsByEvent = async (
  eventId: string
): Promise<{
  success: boolean;
  message: string;
  data: {
    event: {
      id: string;
      title: string;
      date: Date;
      fee: number;
    };
    participants: EventParticipant[];
  };
}> => {
  try {
    const accessToken = await getCookie("accessToken");
    
    const response = await fetch(
      `${BACKEND_API_URL}/events/my-events/${eventId}/participants`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch event participants: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching event participants:", error);
    throw error;
  }
};