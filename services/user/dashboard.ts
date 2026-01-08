/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation */
"use server";

import userInfo from "./userInfo";

// Generic user fetch for any role
const fetchUserData = async () => {
  const response = await userInfo();
  
  if (!response.success || !response.data) {
    return null;
  }

  return response.data;
};

// For regular user dashboard
export const getDashboardUser = async () => {
  try {
    const userData = await fetchUserData();
    
    if (!userData) {
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
    }

    return userData;
  } catch (error: any) {
    console.error("Dashboard user error:", error);
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
  }
};

// For host dashboard
export const getHostDashboardUser = async () => {
  try {
    const userData = await fetchUserData();
    
    if (!userData) {
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
        updatedAt: new Date().toISOString()
      };
    }

    // Return user data with HOST role (override if needed)
    return {
      ...userData,
      role: "HOST" // Ensure role is HOST for dashboard
    };
    
  } catch (error: any) {
    console.error("Host dashboard user error:", error);
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
      updatedAt: new Date().toISOString()
    };
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