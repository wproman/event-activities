// src/services/payment/paymentService.ts

import { HostPaymentsResponse, HostRevenueStats, PaymentStats } from "@/app/types";
import { getCookie } from "@/services/auth/tokenHandlers";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

/**
 * Get host revenue statistics
 */
export const getHostRevenueStats = async (): Promise<{
  success: boolean;
  message: string;
  data: HostRevenueStats;
}> => {
  try {
    const accessToken = await getCookie("accessToken");
    
    const response = await fetch(
      `${BACKEND_API_URL}/payments/host/revenue`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch revenue stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching revenue stats:", error);
    throw error;
  }
};

/**
 * Get host payments with filters
 */
export const getHostPayments = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    status?: string;
    eventId?: string;
    dateFrom?: string;
    dateTo?: string;
  }
): Promise<{
  success: boolean;
  message: string;
  data: HostPaymentsResponse;
}> => {
  try {
    const accessToken = await getCookie("accessToken");
    
    // Build query string
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.eventId && { eventId: filters.eventId }),
      ...(filters?.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters?.dateTo && { dateTo: filters.dateTo }),
    });

    const response = await fetch(
      `${BACKEND_API_URL}/payments/host/payments?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch payments: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching host payments:", error);
    throw error;
  }
};

/**
 * Get payment statistics
 */
export const getPaymentStats = async (): Promise<{
  success: boolean;
  message: string;
  data: PaymentStats;
}> => {
  try {
    const accessToken = await getCookie("accessToken");
    
    const response = await fetch(
      `${BACKEND_API_URL}/payments/stats`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch payment stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    throw error;
  }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (
  paymentId: string,
  status: string,
  notes?: string
): Promise<{
  success: boolean;
  message: string;
  data: any;
}> => {
  try {
    const accessToken = await getCookie("accessToken");
    
    const response = await fetch(
      `${BACKEND_API_URL}/payments/${paymentId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status, notes }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update payment status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

/**
 * Export payments data
 */
export const exportPayments = async (filters?: {
  status?: string;
  eventId?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<Blob> => {
  try {
    const accessToken = await getCookie("accessToken");
    
    // Build query string
    const queryParams = new URLSearchParams({
      export: 'true', // Add export flag
      limit: '1000', // Export more records
      ...(filters?.status && { status: filters.status }),
      ...(filters?.eventId && { eventId: filters.eventId }),
      ...(filters?.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters?.dateTo && { dateTo: filters.dateTo }),
    });

    const response = await fetch(
      `${BACKEND_API_URL}/payments/host/payments?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to export payments: ${response.statusText}`);
    }

    // Try to get as blob first (if backend returns CSV directly)
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/csv')) {
      return await response.blob();
    }

    // Otherwise, get JSON and convert to CSV
    const data = await response.json();
    
    if (!data.success || !data.data?.payments) {
      throw new Error('No payment data available for export');
    }

    // Convert to CSV
    const csvContent = convertToCSV(data.data.payments);
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
  } catch (error) {
    console.error("Error exporting payments:", error);
    throw error;
  }
};

// Helper function to convert to CSV
const convertToCSV = (payments: any[]): string => {
  if (!payments || payments.length === 0) {
    return 'No payment data available';
  }

  const headers = [
    'ID',
    'Amount',
    'Currency', 
    'Status',
    'Transaction ID',
    'Payment Date',
    'Event Title',
    'Event Date',
    'User Name',
    'User Email',
    'Payment Method'
  ];
  
  const rows = payments.map(payment => [
    `"${payment.id}"`,
    payment.amount,
    `"${payment.currency}"`,
    `"${payment.status}"`,
    payment.transactionId ? `"${payment.transactionId}"` : '',
    `"${new Date(payment.createdAt).toLocaleString()}"`,
    payment.event?.title ? `"${payment.event.title}"` : '',
    payment.event?.date ? `"${new Date(payment.event.date).toLocaleDateString()}"` : '',
    payment.user?.name ? `"${payment.user.name}"` : '',
    payment.user?.email ? `"${payment.user.email}"` : '',
    payment.stripePaymentIntentId ? '"Stripe"' : '"Manual"'
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};