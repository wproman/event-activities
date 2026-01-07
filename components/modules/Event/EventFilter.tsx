// // components/modules/Event/EventFilter.tsx
// /** biome-ignore-all assist/source/organizeImports: <explanation */
// "use client";

// import type {
//   Event,
//   EventParticipant,
//   EventType,
//   EventFilters as FilterType,
//   Review,
//   User,
// } from "@/app/types";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Calendar,
//   Clock,
//   DollarSign,
//   Filter,
//   MapPin,
//   Search,
//   Users,
//   X,
// } from "lucide-react";
// import { useState } from "react";

// // Union type for different use cases
// type EventFilterMode = "USER_EVENTS" | "BOOK_EVENTS";

// interface BaseEventFiltersProps {
//   mode: EventFilterMode;
// }

// // Props for USER_EVENTS mode
// interface UserEventsProps extends BaseEventFiltersProps {
//   mode: "USER_EVENTS";
//   eventAndParticipants: EventParticipant[];
//   reviews: Review[];
//   user: User;
// }

// // Props for BOOK_EVENTS mode
// interface BookEventsProps extends BaseEventFiltersProps {
//   mode: "BOOK_EVENTS";
//   // Filter values
//   filters: FilterType;
//   // Event data for filtering
//   events?: Event[];
//   locations: string[];
//   // Callbacks
//   onFiltersChange: (filters: FilterType) => void;
//   onClear: () => void;
// }

// // Combined props type
// type EventFiltersProps = UserEventsProps | BookEventsProps;

// const EventFilters = (props: EventFiltersProps) => {
//   // State for user events filter
//   const [userEventsFilter, setUserEventsFilter] = useState<"UPCOMING" | "PAST">(
//     "UPCOMING",
//   );

//   // Handle USER_EVENTS mode
//   if (props.mode === "USER_EVENTS") {
//     const { eventAndParticipants } = props;
//     const now = new Date();

//     const filteredEvents = eventAndParticipants?.filter((item) => {
//       const eventDate = new Date(item.event?.date || "");
//       return userEventsFilter === "UPCOMING"
//         ? eventDate >= now
//         : eventDate < now;
//     });

//     return (
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-xl">My Registered Events</CardTitle>
//             <div className="flex gap-2">
//               <Button
//                 variant={
//                   userEventsFilter === "UPCOMING" ? "default" : "outline"
//                 }
//                 size="sm"
//                 onClick={() => setUserEventsFilter("UPCOMING")}
//                 className="gap-1"
//               >
//                 <Clock className="w-3 h-3" />
//                 Upcoming
//               </Button>
//               <Button
//                 variant={userEventsFilter === "PAST" ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setUserEventsFilter("PAST")}
//                 className="gap-1"
//               >
//                 <Calendar className="w-3 h-3" />
//                 Past
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Event</TableHead>
//                 <TableHead>Location</TableHead>
//                 <TableHead>Date</TableHead>
//                 <TableHead>Participants</TableHead>
//                 <TableHead>Fee</TableHead>
//                 <TableHead>Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredEvents.length > 0 ? (
//                 filteredEvents.map((item) => {
//                   const event = item.event;
//                   const isFull =
//                     event.maxParticipants &&
//                     event._count?.participants &&
//                     event._count.participants >= event.maxParticipants;

//                   return (
//                     <TableRow key={event.id}>
//                       <TableCell className="font-medium">
//                         {event.title}
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-1">
//                           <MapPin className="w-3 h-3" />
//                           {event.location}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//   {new Date(event.date).toLocaleDateString("en-US", {
//     weekday: "short",
//     month: "short",
//     day: "numeric",
//   })}
// </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-1">
//                           <Users className="w-3 h-3" />
//                           {event._count?.participants || 0}
//                           {event.maxParticipants && `/${event.maxParticipants}`}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-1">
//                           <DollarSign className="w-3 h-3" />
//                           {event.fee > 0 ? `$${event.fee}` : "Free"}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant={isFull ? "destructive" : "default"}>
//                           {isFull ? "Full" : "Joined"}
//                         </Badge>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={6}
//                     className="text-center py-8 text-muted-foreground"
//                   >
//                     No {userEventsFilter.toLowerCase()} events found
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     );
//   }

//   // Handle BOOK_EVENTS mode
//   const { filters, onFiltersChange, onClear, locations } = props;

//   // Helper function to update specific filter
//   const updateFilter = <K extends keyof FilterType>(
//     key: K,
//     value: FilterType[K],
//   ) => {
//     onFiltersChange({ ...filters, [key]: value });
//   };

//   // Check if any filter is active
//   const hasActiveFilters =
//     filters.search !== "" ||
//     filters.eventType !== "" ||
//     filters.location !== "" ||
//     filters.date !== "" ||
//     filters.isPaid !== null;

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Filter className="h-5 w-5 text-primary" />
//             <CardTitle className="text-xl">Filter Events</CardTitle>
//           </div>
//           {hasActiveFilters && (
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={onClear}
//               className="flex items-center gap-2"
//             >
//               <X className="h-4 w-4" />
//               Clear All
//             </Button>
//           )}
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-6">
//           {/* Search Input */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search events by title or description..."
//               value={filters.search}
//               onChange={(e) => updateFilter("search", e.target.value)}
//               className="pl-10"
//             />
//           </div>

//           <Separator />

//           {/* Filter Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Event Type */}
//             <div className="space-y-2">
//               <Label htmlFor="eventType" className="text-sm font-medium">
//                 Event Type
//               </Label>
//               <Select
//                 value={filters.eventType}
//                 onValueChange={(value) => {
//                   // Use a placeholder value for "All Types" that's not an empty string
//                   const eventTypeValue =
//                     value === "ALL_TYPES" ? "" : (value as EventType);
//                   updateFilter("eventType", eventTypeValue);
//                 }}
//               >
//                 <SelectTrigger id="eventType" className="w-full">
//                   <SelectValue placeholder="All Types" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {/* FIXED: Changed from value="" to value="ALL_TYPES" */}
//                   <SelectItem value="ALL_TYPES">All Types</SelectItem>
//                   <SelectItem value="CONCERT">🎵 Concert</SelectItem>
//                   <SelectItem value="HIKE">🥾 Hiking</SelectItem>
//                   <SelectItem value="DINNER">🍽️ Dinner</SelectItem>
//                   <SelectItem value="GAME_NIGHT">🎮 Game Night</SelectItem>
//                   <SelectItem value="MEETUP">👥 Meetup</SelectItem>
//                   <SelectItem value="SPORT">⚽ Sport</SelectItem>
//                   <SelectItem value="ART">🎨 Art</SelectItem>
//                   <SelectItem value="OTHER">📌 Other</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Location */}
//             <div className="space-y-2">
//               <Label htmlFor="location" className="text-sm font-medium">
//                 Location
//               </Label>
//               <Select
//                 value={filters.location}
//                 onValueChange={(value) => {
//                   // Use a placeholder value for "All Locations" that's not an empty string
//                   const locationValue = value === "ALL_LOCATIONS" ? "" : value;
//                   updateFilter("location", locationValue);
//                 }}
//               >
//                 <SelectTrigger id="location" className="w-full">
//                   <SelectValue placeholder="All Locations" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {/* FIXED: Changed from value="" to value="ALL_LOCATIONS" */}
//                   <SelectItem value="ALL_LOCATIONS">All Locations</SelectItem>
//                   {locations.map((loc) => (
//                     <SelectItem key={loc} value={loc}>
//                       📍 {loc}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Date */}
//             <div className="space-y-2">
//               <Label
//                 htmlFor="date"
//                 className="text-sm font-medium flex items-center gap-2"
//               >
//                 <Calendar className="h-4 w-4" />
//                 Date
//               </Label>
//               <Input
//                 id="date"
//                 type="date"
//                 value={filters.date}
//                 onChange={(e) => updateFilter("date", e.target.value)}
//                 className="w-full"
//               />
//             </div>

//             {/* Payment Type */}
//             <div className="space-y-2">
//               <Label className="text-sm font-medium block">Payment Type</Label>
//               <Tabs
//                 value={
//                   filters.isPaid === null
//                     ? "all"
//                     : filters.isPaid
//                       ? "paid"
//                       : "free"
//                 }
//                 onValueChange={(value) => {
//                   if (value === "all") updateFilter("isPaid", null);
//                   else if (value === "paid") updateFilter("isPaid", true);
//                   else updateFilter("isPaid", false);
//                 }}
//                 className="w-full"
//               >
//                 <TabsList className="grid w-full grid-cols-3">
//                   <TabsTrigger value="all">All</TabsTrigger>
//                   <TabsTrigger value="paid">Paid</TabsTrigger>
//                   <TabsTrigger value="free">Free</TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>
//           </div>

//           {/* Active Filters Badges */}
//           {hasActiveFilters && (
//             <div className="flex flex-wrap gap-2 pt-4 border-t">
//               <span className="text-sm text-muted-foreground self-center">
//                 Active filters:
//               </span>
//               {filters.search && (
//                 <Badge variant="secondary" className="gap-1">
//                   Search: {filters.search}
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
//                     onClick={() => updateFilter("search", "")}
//                   >
//                     ×
//                   </Button>
//                 </Badge>
//               )}
//               {filters.eventType && (
//                 <Badge variant="secondary" className="gap-1">
//                   Type: {filters.eventType}
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
//                     onClick={() => updateFilter("eventType", "")}
//                   >
//                     ×
//                   </Button>
//                 </Badge>
//               )}
//               {filters.location && (
//                 <Badge variant="secondary" className="gap-1">
//                   Location: {filters.location}
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
//                     onClick={() => updateFilter("location", "")}
//                   >
//                     ×
//                   </Button>
//                 </Badge>
//               )}
//               {filters.date && (
//                 <Badge variant="secondary" className="gap-1">
//                   Date: {new Date(filters.date).toLocaleDateString()}
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
//                     onClick={() => updateFilter("date", "")}
//                   >
//                     ×
//                   </Button>
//                 </Badge>
//               )}
//               {filters.isPaid !== null && (
//                 <Badge variant="secondary" className="gap-1">
//                   {filters.isPaid ? "Paid Only" : "Free Only"}
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
//                     onClick={() => updateFilter("isPaid", null)}
//                   >
//                     ×
//                   </Button>
//                 </Badge>
//               )}
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default EventFilters;









// components/modules/Event/EventFilter.tsx
/** biome-ignore-all assist/source/organizeImports: <explanation */
"use client";

import type {
  Event,
  EventParticipant,
  EventType,
  EventFilters as FilterType,
  Review,
  User,
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
import {
  Calendar,
  Clock,
  DollarSign,
  Eye,
  Filter,
  MapPin,
  Search,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

// Union type for different use cases
type EventFilterMode = "USER_EVENTS" | "BOOK_EVENTS" | "PUBLIC";

interface BaseEventFiltersProps {
  mode: EventFilterMode;
}

// Props for USER_EVENTS mode
interface UserEventsProps extends BaseEventFiltersProps {
  mode: "USER_EVENTS";
  eventAndParticipants: EventParticipant[];
  reviews: Review[];
  user: User;
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

  // Handle USER_EVENTS mode
  if (props.mode === "USER_EVENTS") {
    const { eventAndParticipants } = props;
    const now = new Date();

    const filteredEvents = eventAndParticipants?.filter((item) => {
      const eventDate = new Date(item.event?.date || "");
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((item) => {
                  const event = item.event;
                  const isFull =
                    event.maxParticipants &&
                    event._count?.participants &&
                    event._count.participants >= event.maxParticipants;

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
                          {event.fee > 0 ? `$${event.fee}` : "Free"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isFull ? "destructive" : "default"}>
                          {isFull ? "Full" : "Joined"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
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