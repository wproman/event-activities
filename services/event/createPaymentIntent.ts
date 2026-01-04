// services/payment/createPaymentIntent.ts
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

    if (!response.ok) {
      throw new Error("Failed to create payment intent");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.log(error, "from createPaymentIntent function");
    return { success: false, message: error.message };
  }
};

export default createPaymentIntent;