/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Event } from "@/app/types";
import approveEvent from "@/services/admin/eventsApprove";
import { revalidatePathFunction } from "@/services/event/eventDetails";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EventApproval = ({ event }: { event: Event }) => {
  // console.log(event);
  const [isStatusChange, setIsStatusChange] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await revalidatePathFunction(`/admin/dashboard/manage-events`);
    }
    fetchData();
  }, []);
  const handleApprove = async (currentStatus: boolean) => {
    try {
      const updatedData = { isApproved: !currentStatus };
      // console.log("from handleApprove",event.id,updatedData);

      const res = await approveEvent(event.id, updatedData);

      if (res.success) {
        toast.success(
          `Event ${currentStatus ? "unapproved" : "approved"} successfully`,
        );
        setIsStatusChange(!isStatusChange);
      } else {
        toast.error(res.message || "Failed to update approval");
      }
    } catch (error: any) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };
  return (
    <button
      type="button"
      onClick={() => handleApprove(event.isApproved)}
      className={`px-2 my-2 rounded text-white ${
        event.isApproved ? "bg-red-600" : "bg-green-600"
      }`}
    >
      {event.isApproved ? "Unapprove" : "Approve"}
    </button>
  );
};

export default EventApproval;
