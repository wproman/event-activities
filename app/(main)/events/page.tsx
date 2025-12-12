// app/(main)/events/page.tsx
// import EventCard from "@/components/EventCard"
// import EventFilters from "@/components/EventFilters"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"

// Dummy data - replace with real API fetch later
// import { dummyEvents } from "@/lib/dummy-data"

export default function EventsPage() {
  return (
    <div className="container px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold">Explore Events</h1>
            <p className="text-muted-foreground mt-2">Find activities you'll love with great people</p>
          </div>
          <Button asChild size="lg">
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search events by name, location, or keyword..."
            className="pl-10"
          />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <EventFilters />
          </aside>

          {/* Events Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {dummyEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {dummyEvents.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No events found matching your criteria.</p>
                <Button asChild className="mt-6">
                  <Link href="/events/create">Be the first to create one!</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}