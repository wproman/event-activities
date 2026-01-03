/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookie } from '../auth/tokenHandlers';

const updateUserProfile = async(updatedData:any) => {
   try {
     // Bangla: Client-side cookie থেকে accessToken নিচ্ছি  
     // English: Getting token from client cookies  
     const accessToken = await getCookie("accessToken");
 
     if (!accessToken) {
       return {
         success: false,
         message: "User is not authenticated!",
       };
     }
 
     // Bangla: API request eventId সহ পাঠানো হচ্ছে  
     // English: Sending API request with eventId  
 
     const response = await fetch(
       `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/updateMyProfie`,
       {
         method: "PATCH",
         headers: {
           "Content-Type": "application/json",
          // Cookie: `accessToken=${accessToken}`, // PERFECT way
                 "Authorization": `Bearer ${accessToken}`,

         },
         credentials: "include",
           body: JSON.stringify(updatedData),
       }
     );
 
     if (!response.ok) {
       const errorData = await response.json().catch(() => null);
 
       return {
         success: false,
         message: errorData?.message || "Failed to updte profile",
       };
     }
 
     const data = await response.json();
 
     return data
   } catch (error: any) {
    console.log(error);
     return {
       success: false,
       message: error?.message || "Unexpected error occurred",
     };
   }
}

export default updateUserProfile