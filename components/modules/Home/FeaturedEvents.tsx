// import EventCard from "@/components/EventCard"
// You can replace this with real data from your backend later
// import { dummyEvents } from "@/lib/dummy-data"

export default function FeaturedEvents() {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Upcoming Events Near You
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join something exciting this week!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* {dummyEvents.slice(0, 8).map((event) => (
            <EventCard key={event.id} event={event} />
          ))} */}
        </div>
      </div>
    </section>
  );
}
