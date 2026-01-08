// services/host/getHostCreatedAllEvents.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";

const getHostCreatedAllEvents = async (): Promise<any[]> => {
  try {
    const response = await serverFetch.get("/events/my-events", {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch host events:", response.status);
      return [];
    }

    const result = await response.json();
    console.log("API Response:", result);

    // Handle the actual response structure
    if (result.success && result.data) {
      // CASE 1: If data is an array directly
      if (Array.isArray(result.data)) {
        console.log(`Found ${result.data.length} events in data array`);
        return result.data;
      }
      
      // CASE 2: If data has hostedEvents property (your current structure)
      if (result.data.hostedEvents && Array.isArray(result.data.hostedEvents)) {
        console.log(`Found ${result.data.hostedEvents.length} hosted events`);
        return result.data.hostedEvents;
      }
      
      // CASE 3: If data has joinedEvents property
      if (result.data.joinedEvents && Array.isArray(result.data.joinedEvents)) {
        console.log(`Found ${result.data.joinedEvents.length} joined events`);
        return result.data.joinedEvents;
      }
    }
    
    // CASE 4: Direct array response
    if (Array.isArray(result)) {
      console.log(`Found ${result.length} events in direct array`);
      return result;
    }

    console.log("No events found or unexpected structure");
    return [];
  } catch (error) {
    console.error("Error fetching host events:", error);
    return [];
  }
};

export default getHostCreatedAllEvents;