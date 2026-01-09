// services/event/leaveEvent.ts
import { serverFetch } from "@/lib/server-fetch";

const leaveEvent = async (eventId: string) => {
  try {
    console.log("=== LEAVE EVENT DEBUG ===");
    
    // TEST 1: Check what serverFetch.delete actually does
    console.log("1. Testing serverFetch.delete function...");
    console.log("serverFetch object:", serverFetch);
    console.log("serverFetch.delete:", serverFetch.delete);
    
    // TEST 2: Call it and see what happens
    console.log("2. Making request...");
    const endpoint = `/events/${eventId}/leave`;
    console.log("Endpoint to pass:", endpoint);
    
    // This should log in server-fetch.ts helper
    const response = await serverFetch.delete(endpoint);
    
    console.log("3. Got response, status:", response.status);
    console.log("4. Response URL:", response.url); // This will show the actual URL
    
    const result = await response.json();
    console.log("5. Result:", result);
    
    if (!response.ok) {
      throw new Error(result.message || "Failed to leave event");
    }

    return result;
  } catch (error: any) {
    console.error("Leave event error:", error);
    // Check if error has URL info
    if (error.message.includes("localhost:3000")) {
      console.error("ERROR: Request went to frontend instead of backend!");
    }
    throw error;
  }
};

export default leaveEvent;