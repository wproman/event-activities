// services/host/getHostCreatedAllEvents.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch"; // Adjust path as needed

const getHostCreatedAllEvents = async (): Promise<any[]> => {
  try {
    const response = await serverFetch.get("/events", {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Failed to fetch host events:', response.status);
      return [];
    }
    
    const result = await response.json();
    
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
    
    console.error('Unexpected API response structure:', result);
    return [];

  } catch (error) {
    console.error('Error fetching host events:', error);
    return [];
  }
}

export default getHostCreatedAllEvents;