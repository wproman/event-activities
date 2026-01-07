// app/(dashboardLayout)/host/events/[id]/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Image as ImageIcon,
  MapPin,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Event type based on your API response
interface EventDetail {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string | null;
  imageUrl: string | null;
  fee: string;
  isPaidEvent: boolean;
  eventType: string;
  status: string;
  hostId: string;
  maxParticipants: number | null;
  createdAt: string;
  updatedAt: string;
}

const EventDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const eventId = params.id as string;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1"}/events/${eventId}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch event: ${response.status}`);
        }

        const result = await response.json();
        if (result.success && result.data) {
          setEvent(result.data);
        } else {
          throw new Error("Event not found");
        }
      } catch (error: any) {
        console.error("Error fetching event:", error);
        toast.error(error.message || "Failed to load event details");
        router.push("/host/events");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, router]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1"}/events/${eventId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.status}`);
      }

      toast.success("Event deleted successfully");
      router.push("/host/events");
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast.error(error.message || "Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Event Not Found</CardTitle>
            <CardDescription>
              The event you're looking for doesn't exist or you don't have
              permission to view it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/host/dashboard/my-events">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format date for display
  const formattedDate = format(new Date(event.date), "PPP");
  const formattedTime = format(new Date(event.date), "p");
  const formattedCreatedAt = format(new Date(event.createdAt), "PPP 'at' p");

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild className="self-start">
              <Link href="/host/dashboard/my-events">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/host/events/${eventId}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </Link>
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Event
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {event.title}
              </h1>
              <Badge
                variant={event.status === "OPEN" ? "default" : "secondary"}
              >
                {event.status}
              </Badge>
              {event.isPaidEvent && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <DollarSign className="h-3 w-3 mr-1" />
                  Paid
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created {formattedCreatedAt}
              </span>
              <span>•</span>
              <span>Event ID: {eventId.slice(0, 8)}...</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            {event.imageUrl ? (
              <Card className="border-border overflow-hidden">
                <div className="relative h-64 sm:h-80 w-full">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Card>
            ) : (
              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mb-2" />
                    <p>No image uploaded</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Event Description */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Event Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Date & Time
                    </div>
                    <div>
                      <p className="font-medium">{formattedDate}</p>
                      <p className="text-sm text-muted-foreground">
                        {formattedTime}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Location
                    </div>
                    <p className="font-medium">{event.location}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      Event Type
                    </div>
                    <Badge variant="outline">{event.eventType}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      Price
                    </div>
                    <p className="font-medium">
                      {event.isPaidEvent
                        ? `$${parseFloat(event.fee).toFixed(2)}`
                        : "Free"}
                    </p>
                  </div>
                </div>

                {event.category && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      Category
                    </div>
                    <Badge variant="secondary">{event.category}</Badge>
                  </div>
                )}

                {event.maxParticipants && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Max Participants
                    </div>
                    <p className="font-medium">
                      {event.maxParticipants} people
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Event Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground">Attendees</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">
                      {event.maxParticipants || "∞"}
                    </p>
                    <p className="text-xs text-muted-foreground">Capacity</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Event ID:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {eventId.slice(0, 8)}...
                    </code>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Host ID:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {event.hostId.slice(0, 8)}...
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Management Actions */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Manage Event</CardTitle>
                <CardDescription>Additional management options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={`/host/events/${eventId}/attendees`}>
                    <Users className="h-4 w-4 mr-2" />
                    View Attendees
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Check-in Settings
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Payment Reports
                </Button>
              </CardContent>
            </Card>

            {/* Share Event */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Share Event</CardTitle>
                <CardDescription>Share this event with others</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/30">
                    <code className="text-xs flex-1 truncate">
                      {typeof window !== "undefined"
                        ? `${window.location.origin}/events/${eventId}`
                        : ""}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/events/${eventId}`,
                        );
                        toast.success("Link copied to clipboard");
                      }}
                    >
                      Copy
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Share this link to invite people to your event
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
