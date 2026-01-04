/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import { revalidatePath } from "next/cache";
import { getCookie } from "../auth/tokenHandlers";


const eventDetails = async (id:string) => {

  try {
    // console.log("eventDetails",id);
   const accessToken = await getCookie('accessToken')
 const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${id}`, {
      credentials: "include",
       headers: {
      // Cookie: `accessToken=${accessToken}`,
             "Authorization": `Bearer ${accessToken}`,

    },
    cache: "no-store", 
    });

      if (!res.ok) {
       // এখানেই HTTP error detect হবে
       const errorData = await res.json();
       throw new Error(errorData.message || "can not find event somthing went worng!");
     }
    const data = await res.json()
    // console.log("data",data);
    
    return data.data
  } catch (error: any) {
    console.log(error);
     return { success: false, message: error.message };
   }
  
}

export default eventDetails

export const revalidatePathFunction = async (path:string)=>{

        revalidatePath(`${path}`) 
    }