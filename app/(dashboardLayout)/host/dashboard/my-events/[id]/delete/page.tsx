// app/(dashboardLayout)/host/dashboard/my-events/[id]/delete/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import deleteEvent from "@/services/event/deleteEvents";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const DeleteEventPage = () => {
  const params = useParams();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const eventId = params.id as string;

  const handleDelete = async () => {
    if (!confirm("Are you absolutely sure? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteEvent(eventId);

      if (result.success) {
        toast.success("Event deleted successfully");
        router.push("/host/dashboard/my-events");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete event");
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">Delete Event</CardTitle>
          <CardDescription>
            This will permanently delete the event and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this event?
            </p>
            <p className="text-xs text-muted-foreground">
              Event ID: {eventId.slice(0, 8)}...
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Deleting...
              </>
            ) : (
              "Delete Event"
            )}
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/host/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeleteEventPage;
