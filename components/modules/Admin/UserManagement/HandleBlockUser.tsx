/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { User, UserStatus } from "@/app/types";
import blockUser from "@/services/admin/blockUser";
import { revalidatePathFunction } from "@/services/event/eventDetails";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const HandleBlockUser = ({ user }: { user: User }) => {
  const [isStatusChange, setIsStatusChange] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await revalidatePathFunction(`/admin/dashboard/manage-host`);
    }
    fetchData();
  }, []);

  // Helper to check if user is blocked
  const isUserBlocked = user.status === "BLOCKED";

  // Determine new status
  const getNewStatus = (currentStatus: UserStatus): UserStatus => {
    return currentStatus === "BLOCKED" ? "ACTIVE" : "BLOCKED";
  };

  const handleBlock = async (id: string, currentStatus: UserStatus) => {
    try {
      const newStatus = getNewStatus(currentStatus);
      const updateData = { status: newStatus };

      const res = await blockUser(updateData, id);

      if (res.success) {
        toast.success(
          `User ${newStatus === "ACTIVE" ? "unblocked" : "blocked"} successfully`,
        );
        setIsStatusChange(!isStatusChange);
      } else {
        toast.error(res.message || "Failed to update user status");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <button
      type="button"
      onClick={() => handleBlock(user?.id, user?.status)}
      className={`px-2 my-2 rounded text-white ${
        isUserBlocked ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {isUserBlocked ? "Unblock" : "Block"}
    </button>
  );
};

export default HandleBlockUser;
