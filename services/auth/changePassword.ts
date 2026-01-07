// services/auth/changePassword.ts
import { getCookie } from "./tokenHandlers"; // Adjust import path as needed

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Change user password
 */
export const changePassword = async (data: ChangePasswordData): Promise<ChangePasswordResponse> => {
  try {
    const accessToken = await getCookie("accessToken");
    
    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required. Please login again.",
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/reset-password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: result.message || `Failed to change password (HTTP ${response.status})`,
      };
    }

    return {
      success: true,
      message: result.message || "Password changed successfully",
      data: result.data,
    };
    
  } catch (error: any) {
    console.error("Change password error:", error);
    return {
      success: false,
      message: error.message || "Network error. Please check your connection.",
    };
  }
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
  strength: number;
  label: string;
  color: string;
} => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  // Calculate strength (0-4)
  let strength = 0;
  if (password.length >= 6) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  const strengths = [
    { label: "Very Weak", color: "bg-red-500" },
    { label: "Weak", color: "bg-orange-500" },
    { label: "Fair", color: "bg-yellow-500" },
    { label: "Good", color: "bg-green-400" },
    { label: "Strong", color: "bg-green-600" }
  ];
  
  const strengthInfo = strengths[Math.min(strength, 4)];
  
  return {
    isValid: errors.length === 0,
    errors,
    strength,
    label: strengthInfo.label,
    color: strengthInfo.color,
  };
};

/**
 * Validate password change form
 */
export const validatePasswordForm = (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (!oldPassword.trim()) {
    errors.push("Current password is required");
  }
  
  if (!newPassword.trim()) {
    errors.push("New password is required");
  }
  
  if (!confirmPassword.trim()) {
    errors.push("Confirm password is required");
  }
  
  if (newPassword !== confirmPassword) {
    errors.push("New passwords do not match");
  }
  
  if (oldPassword === newPassword) {
    errors.push("New password must be different from current password");
  }
  
  const strengthValidation = validatePasswordStrength(newPassword);
  if (!strengthValidation.isValid) {
    errors.push(...strengthValidation.errors);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};