// services/host/getHostCreatedAllEvents.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch"; // Adjust path if needed

const getHostCreatedAllEvents = async (): Promise<any[]> => {
  try {
    console.log("Fetching host events...");

    // Use the serverFetch helper with authentication
    const response = await serverFetch.get("/events", {
      cache: "no-store",
    });

    console.log("API Response status:", response.status);

    if (!response.ok) {
      console.error("Failed to fetch host events:", response.status);

      // Try the regular events endpoint as fallback
      console.log("Trying /events endpoint...");
      const fallbackResponse = await serverFetch.get("/events", {
        cache: "no-store",
      });

      if (!fallbackResponse.ok) {
        console.error("Fallback also failed:", fallbackResponse.status);
        return [];
      }

      const fallbackResult = await fallbackResponse.json();
      return fallbackResult.data || fallbackResult || [];
    }

    const result = await response.json();
    console.log("API Response data:", result);

    // Handle different API response structures
    if (result.success && result.data && Array.isArray(result.data)) {
      return result.data;
    } else if (Array.isArray(result)) {
      return result;
    } else if (result.data && Array.isArray(result.data.events)) {
      return result.data.events;
    } else if (result.success && Array.isArray(result.data)) {
      return result.data;
    }

    console.error("Unexpected API response structure:", result);
    return [];
  } catch (error) {
    console.error("Error fetching host events:", error);
    return [];
  }
};

export default getHostCreatedAllEvents;
