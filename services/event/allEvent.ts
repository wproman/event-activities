// services/event/allEvent.ts
const allEvents = async (): Promise<any[]> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/events`;
    console.log("URL:", url);



    const res = await fetch(url, {
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.log("Error response:", errorText);
      return [];
    }

    const response = await res.json();
    console.log("API Response:", response);

    if (
      response.success &&
      response.data &&
      Array.isArray(response.data.events)
    ) {
      console.log(`Found ${response.data.events.length} events`);

      // Transform the events to ensure correct data types
      return response.data.events.map((event: any) => ({
        ...event,
        // Ensure fee is parsed correctly and isPaidEvent is accurate
        fee: parseFloat(event.fee) || 0,
        // IMPORTANT: Check if fee > 0 to determine if it's a paid event
        isPaidEvent: parseFloat(event.fee) > 0,
        // Parse dates
        date: new Date(event.date),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
      }));
    }

    return [];
  } catch (error) {
    console.log("Catch error:", error);
    return [];
  }
};

export default allEvents;


import { EventResponse } from "@/app/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const getEvents = async (queryString = ""): Promise<EventResponse | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/events?${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // cache: "no-store", // For SSR, but we're using revalidate
        next: { revalidate: 300 } // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    return null;
  }
};

export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/events/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};