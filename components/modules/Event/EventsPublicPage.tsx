"use client";

import { Event, EventType } from "@/app/types";
import EventFilters from "@/components/modules/Event/EventFilter";
import { EventCard } from "@/components/shared/EventCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Skeleton } from "@/components/ui/skeleton";
import publicEvents from "@/services/event/publicEvents";
import {
    AlertCircle,
    Calendar,
    CalendarDays,
    Filter,
    LogIn,
    Search,
    UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EventsPublicPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    eventType: "" as EventType | "",
    location: "",
    date: "",
    isPaid: null as boolean | null,
  });

  // Fetch events (public - no authentication needed)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all events (you might need to create a public API endpoint)
        const eventsData = await publicEvents();

        // Filter only OPEN/APPROVED events
        const openEvents = eventsData.filter(
          (event: any) =>
            event.status === "OPEN" || event.status === "APPROVED"
        );

        // Transform events
        const transformedEvents: Event[] = openEvents.map((event: any) => ({
          ...event,
          fee: parseFloat(event.fee) || 0,
          isPaidEvent: parseFloat(event.fee) > 0,
          date: new Date(event.date),
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt),
        }));

        setEvents(transformedEvents);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter events based on filters
  const filteredEvents = events.filter((event) => {
    if (
      filters.search &&
      !event.title.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.eventType && event.eventType !== filters.eventType) {
      return false;
    }
    if (
      filters.location &&
      !event.location.toLowerCase().includes(filters.location.toLowerCase())
    ) {
      return false;
    }
    if (filters.date) {
      const filterDate = new Date(filters.date).toDateString();
      const eventDate = event.date.toDateString();
      if (filterDate !== eventDate) return false;
    }
    if (filters.isPaid !== null) {
      if (filters.isPaid && !event.isPaidEvent) return false;
      if (!filters.isPaid && event.isPaidEvent) return false;
    }
    return true;
  });

  const handleClearFilters = () => {
    setFilters({
      search: "",
      eventType: "",
      location: "",
      date: "",
      isPaid: null,
    });
  };

  // Get unique locations for filter
  const uniqueLocations = [
    ...new Set(events.map((e) => e.location).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header with auth options */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Explore Events
            </h1>
            <p className="text-muted-foreground mt-2">
              Browse amazing events. Join free events or register for paid ones.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
            <Button asChild>
              <Link href="/register">
                <UserPlus className="h-4 w-4 mr-2" />
                Register
              </Link>
            </Button>
          </div>
        </div>

        {/* Info banner */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Public Access</AlertTitle>
          <AlertDescription className="text-blue-700">
            View all events without login. Free events require registration.
            Paid events require login and payment.
          </AlertDescription>
        </Alert>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle>Filters</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Clear All
            </Button>
          </div>
          <CardDescription>
            Filter events to find exactly what you're looking for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventFilters
            mode="PUBLIC"
            filters={filters}
            onFiltersChange={setFilters}
            onClear={handleClearFilters}
            locations={uniqueLocations}
          />
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filteredEvents.length}
            </span>{" "}
            events available
          </span>
        </div>

        {filteredEvents.length > 0 && (
          <Badge variant="secondary">
            {filteredEvents.filter((e) => e.isPaidEvent).length} Paid •{" "}
            {filteredEvents.filter((e) => !e.isPaidEvent).length} Free
          </Badge>
        )}
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const isFull =
              event.maxParticipants &&
              event._count?.participants &&
              event._count.participants >= event.maxParticipants;

            return (
              <Card
                key={event.id}
                className="overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <EventCard event={event} />

                <Separator className="my-4" />

                <CardContent className="pb-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {event.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {event.isPaidEvent ? (
                        <Badge variant="default" className="font-semibold">
                          ${event.fee.toFixed(2)}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="font-semibold">
                          Free
                        </Badge>
                      )}
                    </div>

                    {/* Action buttons based on event type and user auth */}
                    {isFull ? (
                      <Button disabled variant="destructive" className="w-full">
                        Event Full
                      </Button>
                    ) : event.isPaidEvent ? (
                      <Button asChild className="w-full">
                        <Link href="/login">
                          Login to Book (${event.fee.toFixed(2)})
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <Link href="/register">
                          Register to Join Free
                        </Link>
                      </Button>
                    )}

                    {isFull && (
                      <p className="text-xs text-center text-destructive">
                        This event has reached maximum capacity
                      </p>
                    )}

                    {!isFull && event.isPaidEvent && (
                      <p className="text-xs text-center text-muted-foreground">
                        Login required for paid events
                      </p>
                    )}

                    {!isFull && !event.isPaidEvent && (
                      <p className="text-xs text-center text-muted-foreground">
                        Registration required for free events
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Try adjusting your filters or check back later for new events
            </p>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bottom CTA */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="py-8 text-center">
          <h3 className="text-xl font-bold mb-2">
            Want to host your own events?
          </h3>
          <p className="text-muted-foreground mb-4">
            Become a host and share your experiences with others
          </p>
          <Button size="lg" asChild>
            <Link href="/hosts/create-host">
              Become a Host
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}