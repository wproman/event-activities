import { getCookie } from "../auth/tokenHandlers";

const createPaymentIntent = async (eventId: string) => {
  try {
    const accessToken = await getCookie("accessToken");
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/create-intent`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ eventId }),
      }
    );

    const data = await response.json(); // Always parse JSON first
    
    if (!response.ok) {
      // Return the actual error message from backend
      return {
        success: false,
        message: data.message || "Failed to create payment intent",
        data: data.data // Include any additional data
      };
    }

    return data;
  } catch (error: any) {
    console.log(error, "from createPaymentIntent function");
    return { 
      success: false, 
      message: error.message || "Network error occurred" 
    };
  }
};

export default createPaymentIntent;