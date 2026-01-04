/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookie } from "../auth/tokenHandlers";

interface creatReview {
  eventId: string;
  reviewData: any;
}
const creatReview = async ({ eventId, reviewData }: creatReview) => {
  try {
    const accessToken = await getCookie("accessToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews/${eventId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Cookie: `accessToken=${accessToken}`,
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        // যদি request body দরকার হয়, যেমন user info:
        body: JSON.stringify(reviewData),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to creat the review");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

export default creatReview;
