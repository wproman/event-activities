// components/modules/Event/EventFilter.tsx
/** biome-ignore-all assist/source/organizeImports: <explanation */
"use client";

import type {
  Event,
  EventType,
  EventFilters as FilterType,
  Review,
  User
} from "@/app/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { leaveEvent } from "@/services/event/leaveEvent";
import {
  Calendar,
  Clock,
  DollarSign,
  Eye,
  Filter,
  LogOut,
  MapPin,
  Search,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Union type for different use cases
type EventFilterMode = "USER_EVENTS" | "BOOK_EVENTS" | "PUBLIC";

interface BaseEventFiltersProps {
  mode: EventFilterMode;
}

// Add this type near your other type imports
type MyEventsResponse = {
  hostedEvents: Event[];
  joinedEvents: Event[];
};

// Update the UserEventsProps interface
interface UserEventsProps extends BaseEventFiltersProps {
  mode: "USER_EVENTS";
  eventAndParticipants: MyEventsResponse; // Changed to match API response
  reviews: Review[];
  user: User;
  onEventLeft?: (eventId: string) => void; // Callback for when an event is left
}

// Props for BOOK_EVENTS mode
interface BookEventsProps extends BaseEventFiltersProps {
  mode: "BOOK_EVENTS";
  filters: FilterType;
  events?: Event[];
  locations: string[];
  onFiltersChange: (filters: FilterType) => void;
  onClear: () => void;
}

// Props for PUBLIC mode
interface PublicEventsProps extends BaseEventFiltersProps {
  mode: "PUBLIC";
  filters: FilterType;
  events?: Event[];
  locations: string[];
  onFiltersChange: (filters: FilterType) => void;
  onClear: () => void;
}

// Combined props type
type EventFiltersProps = UserEventsProps | BookEventsProps | PublicEventsProps;

const EventFilters = (props: EventFiltersProps) => {
  // State for user events filter
  const [userEventsFilter, setUserEventsFilter] = useState<"UPCOMING" | "PAST">(
    "UPCOMING",
  );
  
  // State for loading states for each event
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Handle leave event
  const handleLeaveEvent = async (eventId: string, eventTitle: string) => {
    // Set loading state for this specific event
    setLoadingStates(prev => ({ ...prev, [eventId]: true }));
    
    try {
      // Confirm before leaving
      const confirmLeave = window.confirm(
        `Are you sure you want to leave "${eventTitle}"?`
      );
      
      if (!confirmLeave) {
        setLoadingStates(prev => ({ ...prev, [eventId]: false }));
        return;
      }

      const response = await leaveEvent(eventId);
      
      if (response.success) {
        toast.success(response.message || "Successfully left the event.");
        
        // Call the callback if provided (to refresh the events list)
        if (props.mode === "USER_EVENTS" && props.onEventLeft) {
          props.onEventLeft(eventId);
        }
        
        // Show refund info if applicable
        if (response.data.requiresRefund && response.data.refundAmount) {
          toast.info(`A refund of $${response.data.refundAmount} will be processed.`);
        }
        
        // Reload the page to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error: any) {
      console.error("Error leaving event:", error);
      toast.error(error.message || "Failed to leave event. Please try again.");
    } finally {
      // Clear loading state
      setLoadingStates(prev => ({ ...prev, [eventId]: false }));
    }
  };

  // Handle USER_EVENTS mode
  if (props.mode === "USER_EVENTS") {
    const { eventAndParticipants, user } = props;
    const now = new Date();

    // Check if eventAndParticipants is the new structure (object with hostedEvents and joinedEvents)
    let eventsArray: any[] = [];

    if (eventAndParticipants && typeof eventAndParticipants === 'object') {
      // If it has hostedEvents or joinedEvents properties, it's the new structure
      if ('hostedEvents' in eventAndParticipants || 'joinedEvents' in eventAndParticipants) {
        // Combine both arrays
        eventsArray = [
          ...(eventAndParticipants.hostedEvents || []),
          ...(eventAndParticipants.joinedEvents || [])
        ];
      } else if (Array.isArray(eventAndParticipants)) {
        // Old structure: already an array
        eventsArray = eventAndParticipants;
      }
    }

    const filteredEvents = eventsArray.filter((event) => {
      const eventDate = new Date(event?.date || "");
      return userEventsFilter === "UPCOMING"
        ? eventDate >= now
        : eventDate < now;
    });

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">My Registered Events</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={
                  userEventsFilter === "UPCOMING" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setUserEventsFilter("UPCOMING")}
                className="gap-1"
              >
                <Clock className="w-3 h-3" />
                Upcoming
              </Button>
              <Button
                variant={userEventsFilter === "PAST" ? "default" : "outline"}
                size="sm"
                onClick={() => setUserEventsFilter("PAST")}
                className="gap-1"
              >
                <Calendar className="w-3 h-3" />
                Past
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => {
                  // Note: event is now the event object directly, not nested under .event
                  const isFull =
                    event.maxParticipants &&
                    event._count?.participants &&
                    event._count.participants >= event.maxParticipants;

                  // Determine if event is in the past
                  const eventDate = new Date(event.date);
                  const isPastEvent = eventDate < now;

                  // Check if user is the host (from your data structure)
                  const isHost = event.hostId === user?.id;

                  return (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        {event.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event._count?.participants || 0}
                          {event.maxParticipants && `/${event.maxParticipants}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {parseInt(event.fee) > 0 ? `$${event.fee}` : "Free"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isFull ? "destructive" : "default"}>
                          {isFull ? "Full" : "Joined"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {/* Only show leave button for upcoming events where user is not the host */}
                        {!isPastEvent && !isHost && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLeaveEvent(event.id, event.title)}
                            disabled={loadingStates[event.id]}
                            className="gap-1"
                          >
                            {loadingStates[event.id] ? (
                              <>
                                <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Leaving...
                              </>
                            ) : (
                              <>
                                <LogOut className="w-3 h-3" />
                                Leave
                              </>
                            )}
                          </Button>
                        )}
                        {isHost && (
                          <Badge variant="outline" className="text-xs">
                            Host
                          </Badge>
                        )}
                        {isPastEvent && (
                          <span className="text-sm text-muted-foreground">
                            Completed
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No {userEventsFilter.toLowerCase()} events found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  // Handle BOOK_EVENTS and PUBLIC modes (they share the same filter structure)
  const { filters, onFiltersChange, onClear, locations } = props;
  
  // Determine the mode for display
  const isPublicMode = props.mode === "PUBLIC";

  // Helper function to update specific filter
  const updateFilter = <K extends keyof FilterType>(
    key: K,
    value: FilterType[K],
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Check if any filter is active
  const hasActiveFilters =
    filters.search !== "" ||
    filters.eventType !== "" ||
    filters.location !== "" ||
    filters.date !== "" ||
    filters.isPaid !== null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPublicMode ? (
              <Eye className="h-5 w-5 text-primary" />
            ) : (
              <Filter className="h-5 w-5 text-primary" />
            )}
            <CardTitle className="text-xl">
              {isPublicMode ? "Browse Events" : "Filter Events"}
            </CardTitle>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                isPublicMode
                  ? "Search public events..."
                  : "Search events by title or description..."
              }
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>

          <Separator />

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Event Type */}
            <div className="space-y-2">
              <Label htmlFor="eventType" className="text-sm font-medium">
                Event Type
              </Label>
              <Select
                value={filters.eventType}
                onValueChange={(value) => {
                  const eventTypeValue =
                    value === "ALL_TYPES" ? "" : (value as EventType);
                  updateFilter("eventType", eventTypeValue);
                }}
              >
                <SelectTrigger id="eventType" className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_TYPES">All Types</SelectItem>
                  <SelectItem value="CONCERT">🎵 Concert</SelectItem>
                  <SelectItem value="HIKE">🥾 Hiking</SelectItem>
                  <SelectItem value="DINNER">🍽️ Dinner</SelectItem>
                  <SelectItem value="GAME_NIGHT">🎮 Game Night</SelectItem>
                  <SelectItem value="MEETUP">👥 Meetup</SelectItem>
                  <SelectItem value="SPORT">⚽ Sport</SelectItem>
                  <SelectItem value="ART">🎨 Art</SelectItem>
                  <SelectItem value="OTHER">📌 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location
              </Label>
              <Select
                value={filters.location}
                onValueChange={(value) => {
                  const locationValue = value === "ALL_LOCATIONS" ? "" : value;
                  updateFilter("location", locationValue);
                }}
              >
                <SelectTrigger id="location" className="w-full">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_LOCATIONS">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      📍 {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={filters.date}
                onChange={(e) => updateFilter("date", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Payment Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium block">Payment Type</Label>
              <Tabs
                value={
                  filters.isPaid === null
                    ? "all"
                    : filters.isPaid
                      ? "paid"
                      : "free"
                }
                onValueChange={(value) => {
                  if (value === "all") updateFilter("isPaid", null);
                  else if (value === "paid") updateFilter("isPaid", true);
                  else updateFilter("isPaid", false);
                }}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                  <TabsTrigger value="free">Free</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Active Filters Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <span className="text-sm text-muted-foreground self-center">
                Active filters:
              </span>
              {filters.search && (
                <Badge variant="secondary" className="gap-1">
                  Search: {filters.search}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() => updateFilter("search", "")}
                  >
                    ×
                  </Button>
                </Badge>
              )}
              {filters.eventType && (
                <Badge variant="secondary" className="gap-1">
                  Type: {filters.eventType}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() => updateFilter("eventType", "")}
                  >
                    ×
                  </Button>
                </Badge>
              )}
              {filters.location && (
                <Badge variant="secondary" className="gap-1">
                  Location: {filters.location}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() => updateFilter("location", "")}
                  >
                    ×
                  </Button>
                </Badge>
              )}
              {filters.date && (
                <Badge variant="secondary" className="gap-1">
                  Date: {new Date(filters.date).toLocaleDateString()}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() => updateFilter("date", "")}
                  >
                    ×
                  </Button>
                </Badge>
              )}
              {filters.isPaid !== null && (
                <Badge variant="secondary" className="gap-1">
                  {filters.isPaid ? "Paid Only" : "Free Only"}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() => updateFilter("isPaid", null)}
                  >
                    ×
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventFilters;