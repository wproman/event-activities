import { UserRole } from "@/lib/auth-utils";

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  bio?: string | null;
  avatarUrl?: string | null;
  interests?: string[];
  city?: string | null;
  ratingAvg?: number;
  ratingCount?: number;
  needPasswordChange?: boolean;
  status?: "ACTIVE" | "INACTIVE";
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
