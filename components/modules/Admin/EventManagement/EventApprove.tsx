/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Event } from "@/app/types";
import approveEvent from "@/services/admin/eventsApprove";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface EventApprovalProps {
  event: Event;
  onApprove?: (updatedEvent: Event) => void;
}

const EventApproval = ({ event, onApprove }: EventApprovalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    // Show confirmation dialog
    const confirmApprove = window.confirm(
      `Are you sure you want to approve "${event.title}"?`
    );
    
    if (!confirmApprove) return;

    setIsLoading(true);
    try {
      // Call with eventId and isApproved value
      const res = await approveEvent(event.id, true);

      if (res.success) {
        toast.success(res.message || "Event approved successfully!");
        
        // Create updated event object from response
        const updatedEvent = {
          ...event,
          ...res.data, // Use all data from backend response
          status: "APPROVED",
          isApproved: true
        };
        
        // Notify parent component if callback provided
        if (onApprove) {
          onApprove(updatedEvent);
        }
        
        // Refresh the page after a short delay
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        toast.error(res.message || "Failed to approve event");
      }
    } catch (error: any) {
      console.error("Approval error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnapprove = async () => {
    const confirmUnapprove = window.confirm(
      `Are you sure you want to unapprove "${event.title}"?`
    );
    
    if (!confirmUnapprove) return;

    setIsLoading(true);
    try {
      const res = await approveEvent(event.id, false);

      if (res.success) {
        toast.success(res.message || "Event unapproved successfully!");
        
        const updatedEvent = {
          ...event,
          ...res.data,
          status: "PENDING",
          isApproved: false
        };
        
        if (onApprove) {
          onApprove(updatedEvent);
        }
        
        setTimeout(() => {
          router.refresh();
        }, 1500);
      }
    } catch (error: any) {
      console.error("Unapproval error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Determine button text and color based on status
  const isApproved = event.status === "APPROVED" || event.isApproved;
  const isRejected = event.status === "REJECTED";

  if (isRejected) {
    return (
      <span className="px-4 py-2 bg-red-600 text-white rounded font-medium opacity-70 cursor-not-allowed">
        Rejected
      </span>
    );
  }

  if (isApproved) {
    return (
      <button
        type="button"
        onClick={handleUnapprove}
        disabled={isLoading}
        className={`px-4 py-2 rounded text-white font-medium bg-yellow-600 hover:bg-yellow-700 ${
          isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
        }`}
      >
        {isLoading ? "Unapproving..." : "Unapprove"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleApprove}
      disabled={isLoading}
      className={`px-4 py-2 rounded text-white font-medium bg-blue-600 hover:bg-blue-700 ${
        isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
      }`}
    >
      {isLoading ? "Approving..." : "Approve"}
    </button>
  );
};

export default EventApproval;