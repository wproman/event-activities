/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookie } from '../auth/tokenHandlers';

const getAllUser = async() => {
try {
     const accessToken = await getCookie('accessToken')
     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admins/all-user`, {
       credentials: "include",
          headers: {
      // Cookie: `accessToken=${accessToken}`,
        "Authorization": `Bearer ${accessToken}`,
    },
     });
 
     if (!res.ok) {
       // এখানেই HTTP error detect হবে
       const errorData = await res.json();
       throw new Error(errorData.message || "can not find users somthing went worng!");
     }
 const result = await res.json();
     // success হলে data return করো
     return result.data
 
   } catch (error: any) {
    console.log(error);
     return { success: false, message: error.message };
   }
}

export default getAllUser