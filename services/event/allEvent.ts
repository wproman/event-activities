/* eslint-disable @typescript-eslint/no-explicit-any */

const allEvents = async (): Promise<any[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events`, {
      credentials: "include",
      cache: 'no-store'
    });

    if (!res.ok) {
      return [];
    }
    
    const data = await res.json();
    
    // Always return an array, even if empty
    return Array.isArray(data.data) ? data.data : [];

  } catch {
    // Return empty array on any error
    return [];
  }
}

export default allEvents;