// services/admin/getAllUser.ts
import { cookies } from 'next/headers';
import { getCookie } from '../auth/tokenHandlers';

const getAllUser = async (): Promise<any[]> => {
  try {
    // Try both methods to get the token
    let accessToken: string | null | undefined;
    
    // Method 1: Try from cookies() for server components
    try {
      const cookieStore = await cookies();
      accessToken = cookieStore.get('accessToken')?.value;
    } catch (e) {
      // Method 2: Try from getCookie() for server actions
      const token = await getCookie('accessToken');
      accessToken = token || null;
    }

    if (!accessToken) {
      return [];
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/all-user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return [];
    }
    
    const result = await res.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data;
    }
    
    return [];

  } catch {
    return [];
  }
}

export default getAllUser;


