/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Event, EventFilters as FilterType } from "@/app/types/index";
import { EventCard } from "@/components/shared/EventCard";
import { Button } from "@/components/ui/button";
import allEvents from "@/services/event/allEvent";
import userInfo from "@/services/user/userInfo";
import { useEffect, useMemo, useState } from "react"; // React imports first

export default function ExplorePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userInfo();
        setUser(data);

        // // Extract saved event IDs from user data
        // if (data?.savedEvents) {
        //   const savedIds = data.savedEvents
        //     .filter((se: any) => se.userId === data.id)
        //     .map((se: any) => se.eventId);
        //   setSavedEventIds(savedIds);
        // }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await allEvents();
        console.log("Fetched events:", data);
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filters state - Fixed to match your EventFilters interface
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    eventType: "",
    location: "",
    date: "",
    isPaid: null, // Changed from isFeatured to isPaid
  });

  const filteredEvents = useMemo(() => {
    if (!events || events.length === 0) return [];

    const now = new Date();
    return events.filter((event: Event) => {
      // Skip if event is not approved
      if (!event.isApproved) return false;

      // Search filter - check title instead of name
      if (filters.search && event.title) {
        const searchLower = filters.search.toLowerCase();
        const titleLower = event.title.toLowerCase();
        const descLower = event.description?.toLowerCase() || "";

        if (
          !titleLower.includes(searchLower) &&
          !descLower.includes(searchLower)
        ) {
          return false;
        }
      }

      // Event type filter
      if (filters.eventType && event.eventType !== filters.eventType) {
        return false;
      }

      // Location filter
      if (filters.location && event.location) {
        const eventLocation = event.location.toLowerCase();
        const filterLocation = filters.location.toLowerCase();

        if (!eventLocation.includes(filterLocation)) {
          return false;
        }
      }

      // Date filter
      if (filters.date) {
        const filterDate = new Date(filters.date).toDateString();
        const eventDate = new Date(event.date).toDateString();
        if (filterDate !== eventDate) return false;
      }

      // Paid/Free filter
      if (filters.isPaid !== null) {
        if (filters.isPaid && !event.isPaidEvent) return false;
        if (!filters.isPaid && event.isPaidEvent) return false;
      }

      // Time filter - show only upcoming events by default
      const eventDate = new Date(event.date);
      if (eventDate < now) {
        return false; // Hide past events by default
      }

      return true;
    });
  }, [filters, events]);

  const handleClearFilters = () => {
    setFilters({
      search: "",
      eventType: "",
      location: "",
      date: "",
      isPaid: null,
    });
  };

  const handleSaveEvent = (eventId: string) => {
    if (user) {
      setSavedEventIds((prev) => [...prev, eventId]);
    }
  };

  const handleUnsaveEvent = (eventId: string) => {
    if (user) {
      setSavedEventIds((prev) => prev.filter((id) => id !== eventId));
    }
  };

  // Get unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    const locations = events
      .map((event) => event.location)
      .filter((location): location is string => !!location);
    return [...new Set(locations)];
  }, [events]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Explore Events
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover amazing events happening in your area
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          {/* <EventFilters
            filters={filters}
            onChange={setFilters}
            onClear={handleClearFilters}
            eventData={events}
            locations={uniqueLocations}
          /> */}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filteredEvents.length}
            </span>{" "}
            events
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && filteredEvents.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event: Event) => (
              <EventCard
                key={event.id}
                event={event}
                // isSaved={savedEventIds.includes(event.id)}
                // onSave={user ? () => handleSaveEvent(event.id) : undefined}
                // onUnsave={user ? () => handleUnsaveEvent(event.id) : undefined}
              />
            ))}
          </div>
        ) : !isLoading ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true" // Add this to hide from screen readers if decorative
              >
                <title>No Events Found Icon</title>{" "}
                {/* Add title for accessibility */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No events found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search criteria
            </p>
            <Button
              onClick={handleClearFilters}
              className="text-primary font-medium hover:underline"
            >
              Clear all filters
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
