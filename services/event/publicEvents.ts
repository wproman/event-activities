const publicEvents = async (): Promise<any[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/public`;
    console.log("Fetching public events from:", url);

    const res = await fetch(url, {
      cache: "no-store", // Don't cache public data
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.log("Error response:", errorText);
      
      // Fallback: Try the regular endpoint if public endpoint doesn't exist
      console.log("Trying fallback to regular events endpoint...");
      return await fallbackToRegularEvents();
    }

    const response = await res.json();
    console.log("Public API Response:", response);

    if (
      response.success &&
      response.data &&
      Array.isArray(response.data.events)
    ) {
      console.log(`Found ${response.data.events.length} public events`);
      
      // Transform the events
      return response.data.events.map((event: any) => ({
        ...event,
        fee: parseFloat(event.fee) || 0,
        isPaidEvent: parseFloat(event.fee) > 0,
        date: new Date(event.date),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
      }));
    }

    return [];
  } catch (error) {
    console.log("Catch error fetching public events:", error);
    // Fallback to regular endpoint
    return await fallbackToRegularEvents();
  }
};

// Fallback function if public endpoint doesn't exist
const fallbackToRegularEvents = async (): Promise<any[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/events`;
    console.log("Fallback: Fetching from regular endpoint:", url);

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.log("Fallback also failed");
      return [];
    }

    const response = await res.json();
    
    if (
      response.success &&
      response.data &&
      Array.isArray(response.data.events)
    ) {
      // Filter only OPEN/APPROVED events
      const openEvents = response.data.events.filter((event: any) =>
        event.status === "OPEN" || event.status === "APPROVED"
      );
      
      return openEvents.map((event: any) => ({
        ...event,
        fee: parseFloat(event.fee) || 0,
        isPaidEvent: parseFloat(event.fee) > 0,
        date: new Date(event.date),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
      }));
    }

    return [];
  } catch (error) {
    console.log("Fallback catch error:", error);
    return [];
  }
};

export default publicEvents;