/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookie } from "../auth/tokenHandlers";

// utils/eventJoining.ts
const eventJoining = async (eventId: string) => {
  try {
    console.log("in eventJoining after cookie");
    
     const accessToken = await getCookie('accessToken')
     console.log("accessToken",accessToken);  
       console.log("in eventJoining befor cookie");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${eventId}/join`, { 
     method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      // "Cookie": `accessToken=${accessToken}`, 
       "Authorization": `Bearer ${accessToken}`,
    },
      // যদি request body দরকার হয়, যেমন user info: 
      // body: JSON.stringify({ userId: "user-id-here" }),
    });

    if (!response.ok) {
      throw new Error('Failed to join the event');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.log(error,"from eventjoin function");
    
     return { success: false, message: error.message };
   }
};

export default eventJoining;