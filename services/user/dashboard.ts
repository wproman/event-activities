/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import userInfo from "./userInfo";

// Generic user fetch for any role
const fetchUserData = async () => {
  const response = await userInfo();
  
  if (!response.success || !response.data) {
    return null;
  }

  return response.data;
};

// Helper function for guest host data
const getGuestHostData = () => {
  return {
    id: "guest-host",
    name: "Guest Host",
    email: "host@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Host",
    city: "",
    ratingAvg: 0,
    ratingCount: 0,
    interests: [],
    bio: "",
    role: "HOST",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stats: {
      totalEvents: 0,
      upcomingEvents: 0,
      totalParticipants: 0,
      totalRevenue: 0,
      pendingEvents: 0,
      approvalRate: 0
    },
    recentEvents: [],
    upcomingEvents: [],
    recentParticipants: []
  };
};

// Helper function for guest user data
const getGuestUserData = () => {
  return {
    id: "guest",
    name: "Guest User",
    email: "guest@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
    city: "",
    ratingAvg: 0,
    ratingCount: 0,
    interests: [],
    bio: "",
    role: "USER",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// For host dashboard with real data from backend
// export const getHostDashboardUser = async () => {
//   try {
//     const userData = await fetchUserData();
    
//     if (!userData) {
//       return getGuestHostData();
//     }

//     // Check if user is actually a HOST
//     if (userData.role !== 'HOST') {
//       console.warn('User is not a HOST, returning guest data');
//       return getGuestHostData();
//     }

//     try {
//       // Fetch all dashboard data from backend in parallel
//       const [statsResponse, eventsResponse, participantsResponse] = await Promise.all([
//         // 1. Get host dashboard stats
//         serverFetch.get("/host/dashboard/stats"),
        
//         // 2. Get recent events (limit 5)
//         serverFetch.get("/host/events?limit=5&sort=-createdAt"),
        
//         // 3. Get recent participants (limit 5)
//         serverFetch.get("/host/participants/recent?limit=5")
//       ]);

//       // Parse responses
//       const statsData = statsResponse.ok ? await statsResponse.json() : { data: null };
//       const eventsData = eventsResponse.ok ? await eventsResponse.json() : { data: [] };
//       const participantsData = participantsResponse.ok ? await participantsResponse.json() : { data: [] };

//       // Get upcoming events from the events data (filter by date)
//       const now = new Date();
//       const upcomingEvents = eventsData.data
//         ? eventsData.data.filter((event: any) => new Date(event.date) > now)
//         : [];

//       // Return combined data
//       return {
//         ...userData,
//         role: "HOST",
//         stats: statsData.data || {
//           totalEvents: 0,
//           upcomingEvents: 0,
//           totalParticipants: 0,
//           totalRevenue: 0,
//           pendingEvents: 0,
//           approvalRate: 0
//         },
//         recentEvents: eventsData.data || [],
//         upcomingEvents: upcomingEvents.slice(0, 3), // Limit to 3 upcoming
//         recentParticipants: participantsData.data || []
//       };
      
//     } catch (apiError) {
//       console.warn("Backend API not available, using fallback data");
//       // Return user data with empty stats (fallback)
//       return {
//         ...userData,
//         role: "HOST",
//         stats: {
//           totalEvents: 0,
//           upcomingEvents: 0,
//           totalParticipants: 0,
//           totalRevenue: 0,
//           pendingEvents: 0,
//           approvalRate: 0
//         },
//         recentEvents: [],
//         upcomingEvents: [],
//         recentParticipants: []
//       };
//     }
    
//   } catch (error: any) {
//     console.error("Host dashboard error:", error);
//     return getGuestHostData();
//   }
// };
// In services/user/dashboard.ts - SIMPLIFIED VERSION
export const getHostDashboardUser = async () => {
  try {
    const userData = await fetchUserData();
    
    if (!userData) {
      return getGuestHostData();
    }

    if (userData.role !== 'HOST') {
      return getGuestHostData();
    }

    try {
      // Call the NEW dashboard stats endpoint
      const response = await serverFetch.get("/events/dashboard/stats");
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          return {
            ...userData,
            role: "HOST",
            ...result.data // Contains stats, recentEvents, upcomingEvents, recentParticipants, host
          };
        }
      }
      
      // Fallback if endpoint fails
      return {
        ...userData,
        role: "HOST",
        stats: {
          totalEvents: 0,
          upcomingEvents: 0,
          totalParticipants: 0,
          totalRevenue: 0,
          pendingEvents: 0,
          approvalRate: 0
        },
        recentEvents: [],
        upcomingEvents: [],
        recentParticipants: []
      };
      
    } catch (error) {
      console.warn("Dashboard endpoint error:", error);
      return {
        ...userData,
        role: "HOST",
        stats: {
          totalEvents: 0,
          upcomingEvents: 0,
          totalParticipants: 0,
          totalRevenue: 0,
          pendingEvents: 0,
          approvalRate: 0
        },
        recentEvents: [],
        upcomingEvents: [],
        recentParticipants: []
      };
    }
    
  } catch (error) {
    console.error("Host dashboard error:", error);
    return getGuestHostData();
  }
};
// For regular user dashboard
export const getDashboardUser = async () => {
  try {
    const userData = await fetchUserData();
    
    if (!userData) {
      return getGuestUserData();
    }

    return userData;
  } catch (error: any) {
    console.error("Dashboard user error:", error);
    return getGuestUserData();
  }
};

// For admin dashboard (if needed)
export const getAdminDashboardUser = async () => {
  try {
    const userData = await fetchUserData();
    
    if (!userData) {
      return {
        id: "guest-admin",
        name: "Guest Admin",
        email: "admin@example.com",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
        city: "",
        ratingAvg: 0,
        ratingCount: 0,
        interests: [],
        bio: "",
        role: "ADMIN",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    return {
      ...userData,
      role: "ADMIN" // Ensure role is ADMIN for dashboard
    };
    
  } catch (error: any) {
    console.error("Admin dashboard user error:", error);
    return {
      id: "guest-admin",
      name: "Guest Admin",
      email: "admin@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
      city: "",
      ratingAvg: 0,
      ratingCount: 0,
      interests: [],
      bio: "",
      role: "ADMIN",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};