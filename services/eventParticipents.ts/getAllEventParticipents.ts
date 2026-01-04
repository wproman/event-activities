/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import { getCookie } from "../auth/tokenHandlers";


const getAllEventAndParticipents =async () => {
   try {
    console.log("before cookie");
    
     const accessToken = await getCookie('accessToken')  
     console.log();
     
      console.log("after cookie"); 
     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/event-participants`, {
       credentials: "include", 
          headers: {
      // Cookie: `accessToken=${accessToken}`,
             "Authorization": `Bearer ${accessToken}`,

    },
     });
 
     if (!res.ok) {
       
       const errorData = await res.json();
  
       throw new Error(errorData.message || "can not find event somthing went worng!");
     }
 const result = await res.json();
    
     return result.data
 
   } catch (error: any) {
    console.log(error);
     return { success: false, message: error.message };
   }
}
export default getAllEventAndParticipents

export const checkParticipation =async (arr:any, userId:string, eventId:string) => {
  return arr.some((item:any) => item.userId === userId && item.eventId === eventId);
};