

export interface LeaveEventResponse {
  success: boolean;
  message: string;
  data: {
    event: {
      id: string;
      title: string;
      date: string;
      hostName: string;
      hostEmail: string;
    };
    user: {
      id: string;
      name: string;
    };
    refundData: any | null;
    requiresRefund: boolean;
    refundAmount: number | null;
    paymentId: string | null;
  };
}

export async function leaveEvent(eventId: string): Promise<LeaveEventResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/${eventId}/leave`,
      {
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // For cookies if using JWT in cookies
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to leave event");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error leaving event:", error);
    throw error;
  }
}