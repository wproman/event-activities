

// // app/dashboard/book-events/page.tsx
// "use client";

// import { Event, EventType } from '@/app/types';
// import EventFilters from '@/components/modules/Event/EventFilter';
// import { EventCard } from '@/components/shared/EventCard';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { Skeleton } from '@/components/ui/skeleton';
// import allEvents from '@/services/event/allEvent';
// import userInfo from '@/services/user/userInfo';
// import { AlertCircle, Calendar, CalendarDays, Filter, Search } from 'lucide-react';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';

// export default function BookEventsPage() {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // Filters state

// const [filters, setFilters] = useState({
//   search: '',
//   eventType: '' as EventType | '',  // Add type assertion
//   location: '',
//   date: '',
//   isPaid: null as boolean | null,
// });

//   // Fetch events and user data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
      
//       try {
//         // Fetch user info
//         const userData = await userInfo();
//         setUser(userData);
        
//         // Fetch all events
//         const eventsData = await allEvents();
        
//         // Filter only OPEN/APPROVED events
//         const openEvents = eventsData.filter((event: any) => 
//           event.status === 'OPEN' || event.status === 'APPROVED'
//         );
        
//         // Transform events
//         const transformedEvents: Event[] = openEvents.map((event: any) => ({
//           ...event,
//           fee: parseFloat(event.fee) || 0,
//           isPaidEvent: parseFloat(event.fee) > 0,
//           date: new Date(event.date),
//           createdAt: new Date(event.createdAt),
//           updatedAt: new Date(event.updatedAt),
//         }));
        
//         setEvents(transformedEvents);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Failed to load events');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   // Filter events based on filters
//   const filteredEvents = events.filter((event) => {
//     if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) {
//       return false;
//     }
//     if (filters.eventType && event.eventType !== filters.eventType) {
//       return false;
//     }
//     if (filters.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) {
//       return false;
//     }
//     if (filters.date) {
//       const filterDate = new Date(filters.date).toDateString();
//       const eventDate = event.date.toDateString();
//       if (filterDate !== eventDate) return false;
//     }
//     if (filters.isPaid !== null) {
//       if (filters.isPaid && !event.isPaidEvent) return false;
//       if (!filters.isPaid && event.isPaidEvent) return false;
//     }
//     return true;
//   });

//   const handleClearFilters = () => {
//     setFilters({
//       search: '',
//       eventType: '',
//       location: '',
//       date: '',
//       isPaid: null,
//     });
//   };

//   // Get unique locations for filter
//   const uniqueLocations = [...new Set(events.map(e => e.location).filter(Boolean))];

//   if (loading) {
//     return (
//       <div className="container mx-auto py-8 px-4">
//         <div className="mb-8 space-y-2">
//           <Skeleton className="h-8 w-64" />
//           <Skeleton className="h-4 w-96" />
//         </div>
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {[1, 2, 3].map((i) => (
//             <Card key={i} className="overflow-hidden">
//               <Skeleton className="h-48 w-full" />
//               <CardHeader>
//                 <Skeleton className="h-6 w-3/4" />
//                 <Skeleton className="h-4 w-full" />
//                 <Skeleton className="h-4 w-2/3" />
//               </CardHeader>
//               <CardContent>
//                 <Skeleton className="h-10 w-full" />
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
//           Book Events
//         </h1>
//         <p className="text-muted-foreground mt-2">
//           Browse and book events that interest you
//         </p>
//       </div>

//       {/* Error Alert */}
//       {error && (
//         <Alert variant="destructive" className="mb-6">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {/* Filters */}
//       <Card className="mb-6">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Filter className="h-5 w-5" />
//               <CardTitle>Filters</CardTitle>
//             </div>
//             <Button 
//               variant="outline" 
//               size="sm" 
//               onClick={handleClearFilters}
//             >
//               Clear All
//             </Button>
//           </div>
//           <CardDescription>
//             Filter events to find exactly what you're looking for
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//     <EventFilters
//       mode="BOOK_EVENTS"
//       filters={filters}
//       onFiltersChange={setFilters}
//       onClear={handleClearFilters}
//       locations={uniqueLocations}
//     />
//         </CardContent>
//       </Card>

//       {/* Results Header */}
//       <div className="mb-6 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <CalendarDays className="h-5 w-5 text-muted-foreground" />
//           <span className="text-sm text-muted-foreground">
//             Showing{' '}
//             <span className="font-medium text-foreground">
//               {filteredEvents.length}
//             </span>{' '}
//             events available for booking
//           </span>
//         </div>
        
//         {filteredEvents.length > 0 && (
//           <Badge variant="secondary">
//             {filteredEvents.filter(e => e.isPaidEvent).length} Paid •{' '}
//             {filteredEvents.filter(e => !e.isPaidEvent).length} Free
//           </Badge>
//         )}
//       </div>

//       {/* Events Grid */}
//       {filteredEvents.length > 0 ? (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {filteredEvents.map((event) => {
//             const isFull = event.maxParticipants && event._count?.participants && 
//                           event._count.participants >= event.maxParticipants;
            
//             return (
//               <Card key={event.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
//                 <EventCard event={event} />
                
//                 <Separator className="my-4" />
                
//                 <CardContent className="pb-4">
//                   <div className="flex flex-col gap-3">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4 text-muted-foreground" />
//                         <span className="text-sm font-medium">
//                           {event.date.toLocaleDateString('en-US', {
//                             month: 'short',
//                             day: 'numeric',
//                           })}
//                         </span>
//                       </div>
//                       {event.isPaidEvent ? (
//                         <Badge variant="default" className="font-semibold">
//                           ${event.fee.toFixed(2)}
//                         </Badge>
//                       ) : (
//                         <Badge variant="secondary" className="font-semibold">
//                           Free
//                         </Badge>
//                       )}
//                     </div>
                    
//                     {isFull ? (
//                       <Button disabled variant="destructive" className="w-full">
//                         Event Full
//                       </Button>
//                     ) : (
//                       <Button asChild className="w-full">
//                         <Link href={`/events/${event.id}/book`}>
//                           {event.isPaidEvent ? 'Book Now' : 'Join Event'}
//                         </Link>
//                       </Button>
//                     )}
                    
//                     {isFull && (
//                       <p className="text-xs text-center text-destructive">
//                         This event has reached maximum capacity
//                       </p>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       ) : (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-16">
//             <div className="rounded-full bg-muted p-4 mb-4">
//               <Search className="h-8 w-8 text-muted-foreground" />
//             </div>
//             <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
//             <p className="text-muted-foreground text-center mb-4">
//               Try adjusting your filters or check back later for new events
//             </p>
//             <Button variant="outline" onClick={handleClearFilters}>
//               Clear Filters
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }


// "use client";

// import { Event, EventType } from '@/app/types';
// import EventFilters from '@/components/modules/Event/EventFilter';
// import { EventCard } from '@/components/shared/EventCard';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { Skeleton } from '@/components/ui/skeleton';
// import allEvents from '@/services/event/allEvent';
// import userInfo from '@/services/user/userInfo';
// import { AlertCircle, Calendar, CalendarDays, Filter, Search } from 'lucide-react';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';

// // Define a type for filters that includes a special "ALL" value for eventType
// type FilterState = {
//   search: string;
//   eventType: EventType | 'ALL' | ''; // Include 'ALL' as a valid value
//   location: string;
//   date: string;
//   isPaid: boolean | null;
// };

// export default function BookEventsPage() {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // Filters state - use 'ALL' instead of empty string
//   const [filters, setFilters] = useState<FilterState>({
//     search: '',
//     eventType: 'ALL',  // Changed from '' to 'ALL'
//     location: '',
//     date: '',
//     isPaid: null,
//   });

//   // Fetch events and user data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
      
//       try {
//         // Fetch user info
//         const userData = await userInfo();
//         setUser(userData);
        
//         // Fetch all events
//         const eventsData = await allEvents();
        
//         // Filter only OPEN/APPROVED events
//         const openEvents = eventsData.filter((event: any) => 
//           event.status === 'OPEN' || event.status === 'APPROVED'
//         );
        
//         // Transform events
//         const transformedEvents: Event[] = openEvents.map((event: any) => ({
//           ...event,
//           fee: parseFloat(event.fee) || 0,
//           isPaidEvent: parseFloat(event.fee) > 0,
//           date: new Date(event.date),
//           createdAt: new Date(event.createdAt),
//           updatedAt: new Date(event.updatedAt),
//         }));
        
//         setEvents(transformedEvents);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Failed to load events');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   // Filter events based on filters
//   const filteredEvents = events.filter((event) => {
//     if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) {
//       return false;
//     }
//     // Only filter by eventType if it's not 'ALL' and not empty
//     if (filters.eventType && filters.eventType !== 'ALL' && event.eventType !== filters.eventType) {
//       return false;
//     }
//     if (filters.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) {
//       return false;
//     }
//     if (filters.date) {
//       const filterDate = new Date(filters.date).toDateString();
//       const eventDate = event.date.toDateString();
//       if (filterDate !== eventDate) return false;
//     }
//     if (filters.isPaid !== null) {
//       if (filters.isPaid && !event.isPaidEvent) return false;
//       if (!filters.isPaid && event.isPaidEvent) return false;
//     }
//     return true;
//   });

//   const handleClearFilters = () => {
//     setFilters({
//       search: '',
//       eventType: 'ALL',  // Reset to 'ALL' instead of empty string
//       location: '',
//       date: '',
//       isPaid: null,
//     });
//   };

//   // Get unique locations for filter
//   const uniqueLocations = [...new Set(events.map(e => e.location).filter(Boolean))];

//   if (loading) {
//     return (
//       <div className="container mx-auto py-8 px-4">
//         <div className="mb-8 space-y-2">
//           <Skeleton className="h-8 w-64" />
//           <Skeleton className="h-4 w-96" />
//         </div>
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {[1, 2, 3].map((i) => (
//             <Card key={i} className="overflow-hidden">
//               <Skeleton className="h-48 w-full" />
//               <CardHeader>
//                 <Skeleton className="h-6 w-3/4" />
//                 <Skeleton className="h-4 w-full" />
//                 <Skeleton className="h-4 w-2/3" />
//               </CardHeader>
//               <CardContent>
//                 <Skeleton className="h-10 w-full" />
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
//           Book Events
//         </h1>
//         <p className="text-muted-foreground mt-2">
//           Browse and book events that interest you
//         </p>
//       </div>

//       {/* Error Alert */}
//       {error && (
//         <Alert variant="destructive" className="mb-6">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {/* Filters */}
//       <Card className="mb-6">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Filter className="h-5 w-5" />
//               <CardTitle>Filters</CardTitle>
//             </div>
//             <Button 
//               variant="outline" 
//               size="sm" 
//               onClick={handleClearFilters}
//             >
//               Clear All
//             </Button>
//           </div>
//           <CardDescription>
//             Filter events to find exactly what you're looking for
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <EventFilters
//             mode="BOOK_EVENTS"
//             filters={filters}
//             onFiltersChange={setFilters}
//             onClear={handleClearFilters}
//             locations={uniqueLocations}
//           />
//         </CardContent>
//       </Card>

//       {/* Results Header */}
//       <div className="mb-6 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <CalendarDays className="h-5 w-5 text-muted-foreground" />
//           <span className="text-sm text-muted-foreground">
//             Showing{' '}
//             <span className="font-medium text-foreground">
//               {filteredEvents.length}
//             </span>{' '}
//             events available for booking
//           </span>
//         </div>
        
//         {filteredEvents.length > 0 && (
//           <Badge variant="secondary">
//             {filteredEvents.filter(e => e.isPaidEvent).length} Paid •{' '}
//             {filteredEvents.filter(e => !e.isPaidEvent).length} Free
//           </Badge>
//         )}
//       </div>

//       {/* Events Grid */}
//       {filteredEvents.length > 0 ? (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {filteredEvents.map((event) => {
//             const isFull = event.maxParticipants && event._count?.participants && 
//                           event._count.participants >= event.maxParticipants;
            
//             return (
//               <Card key={event.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
//                 <EventCard event={event} />
                
//                 <Separator className="my-4" />
                
//                 <CardContent className="pb-4">
//                   <div className="flex flex-col gap-3">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4 text-muted-foreground" />
//                         <span className="text-sm font-medium">
//                           {event.date.toLocaleDateString('en-US', {
//                             month: 'short',
//                             day: 'numeric',
//                           })}
//                         </span>
//                       </div>
//                       {event.isPaidEvent ? (
//                         <Badge variant="default" className="font-semibold">
//                           ${event.fee.toFixed(2)}
//                         </Badge>
//                       ) : (
//                         <Badge variant="secondary" className="font-semibold">
//                           Free
//                         </Badge>
//                       )}
//                     </div>
                    
//                     {isFull ? (
//                       <Button disabled variant="destructive" className="w-full">
//                         Event Full
//                       </Button>
//                     ) : (
//                       <Button asChild className="w-full">
//                         <Link href={`/events/${event.id}/book`}>
//                           {event.isPaidEvent ? 'Book Now' : 'Join Event'}
//                         </Link>
//                       </Button>
//                     )}
                    
//                     {isFull && (
//                       <p className="text-xs text-center text-destructive">
//                         This event has reached maximum capacity
//                       </p>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       ) : (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-16">
//             <div className="rounded-full bg-muted p-4 mb-4">
//               <Search className="h-8 w-8 text-muted-foreground" />
//             </div>
//             <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
//             <p className="text-muted-foreground text-center mb-4">
//               Try adjusting your filters or check back later for new events
//             </p>
//             <Button variant="outline" onClick={handleClearFilters}>
//               Clear Filters
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }


"use client";

import { Event, EventType } from '@/app/types';
import EventFilters from '@/components/modules/Event/EventFilter';
import { EventCard } from '@/components/shared/EventCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import allEvents from '@/services/event/allEvent';
import userInfo from '@/services/user/userInfo';
import { AlertCircle, Calendar, CalendarDays, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BookEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters state - keep as empty string but handle it properly
  const [filters, setFilters] = useState({
    search: '',
    eventType: '' as EventType | '',  // Keep as empty string for compatibility
    location: '',
    date: '',
    isPaid: null as boolean | null,
  });

  // Fetch events and user data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch user info
        const userData = await userInfo();
        setUser(userData);
        
        // Fetch all events
        const eventsData = await allEvents();
        
        // Filter only OPEN/APPROVED events
        const openEvents = eventsData.filter((event: any) => 
          event.status === 'OPEN' || event.status === 'APPROVED'
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
        console.error('Error fetching data:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter events based on filters
  const filteredEvents = events.filter((event) => {
    if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.eventType && event.eventType !== filters.eventType) {
      return false;
    }
    if (filters.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) {
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
      search: '',
      eventType: '',  // Keep as empty string
      location: '',
      date: '',
      isPaid: null,
    });
  };

  // Get unique locations for filter
  const uniqueLocations = [...new Set(events.map(e => e.location).filter(Boolean))];

  // Now you need to update your EventFilters component
  // The issue is in your EventFilters component where it has a Select.Item with value=""

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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Book Events
        </h1>
        <p className="text-muted-foreground mt-2">
          Browse and book events that interest you
        </p>
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearFilters}
            >
              Clear All
            </Button>
          </div>
          <CardDescription>
            Filter events to find exactly what you're looking for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventFilters
            mode="BOOK_EVENTS"
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
            Showing{' '}
            <span className="font-medium text-foreground">
              {filteredEvents.length}
            </span>{' '}
            events available for booking
          </span>
        </div>
        
        {filteredEvents.length > 0 && (
          <Badge variant="secondary">
            {filteredEvents.filter(e => e.isPaidEvent).length} Paid •{' '}
            {filteredEvents.filter(e => !e.isPaidEvent).length} Free
          </Badge>
        )}
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const isFull = event.maxParticipants && event._count?.participants && 
                          event._count.participants >= event.maxParticipants;
            
            return (
              <Card key={event.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <EventCard event={event} />
                
                <Separator className="my-4" />
                
                <CardContent className="pb-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {event.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
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
                    
                    {isFull ? (
                      <Button disabled variant="destructive" className="w-full">
                        Event Full
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <Link href={`/dashboard/book-events/${event.id}`}>
                          {event.isPaidEvent ? 'Book Now' : 'Join Event'}
                        </Link>
                      </Button>
                    )}
                    
                    {isFull && (
                      <p className="text-xs text-center text-destructive">
                        This event has reached maximum capacity
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
    </div>
  );
}