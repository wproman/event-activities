// /* eslint-disable @typescript-eslint/no-explicit-any */

// const allEvents = async (): Promise<any[]> => {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events`, {
//       credentials: "include",
//       cache: 'no-store'
//     });

//     if (!res.ok) {
//       return [];
//     }
    
//     const response = await res.json();
    
//     // Your API structure: data.events (not data.data)
//     if (response.success && response.data && Array.isArray(response.data.events)) {
//       return response.data.events;
//     }
    
//     // Alternative: maybe data is directly the array
//     if (response.success && Array.isArray(response.data)) {
//       return response.data;
//     }
    
//     return [];

//   } catch {
//     return [];
//   }
// }

// export default allEvents;

/* eslint-disable @typescript-eslint/no-explicit-any */

const allEvents = async (): Promise<any[]> => {
  console.log("=== allEvents START ===");
  
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/events`;
    console.log("URL:", url);

    const res = await fetch(url, {
      credentials: "include",
      cache: 'no-store'
    });

    console.log("Status:", res.status, res.statusText);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      console.log("Response NOT OK");
      const errorText = await res.text();
      console.log("Error response:", errorText);
      return [];
    }
    
    const response = await res.json();
    console.log("Full response:", JSON.stringify(response, null, 2));
    console.log("response.success:", response.success);
    console.log("response.data:", response.data);
    console.log("response.data.events:", response.data?.events);
    console.log("Is array?", Array.isArray(response.data?.events));
    
    // Your API structure: data.events (not data.data)
    if (response.success && response.data && Array.isArray(response.data.events)) {
      console.log(`Found ${response.data.events.length} events`);
      return response.data.events;
    }
    
    // Alternative: maybe data is directly the array
    if (response.success && Array.isArray(response.data)) {
      console.log(`Found ${response.data.length} events (direct array)`);
      return response.data;
    }
    
    console.log("No events found in response structure");
    return [];

  } catch (error) {
    console.log("Catch error:", error);
    return [];
  } finally {
    console.log("=== allEvents END ===");
  }
}

export default allEvents;