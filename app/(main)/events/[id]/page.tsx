// app/(main)/events/[id]/page.tsx

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, DollarSign, MapPin, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

// Replace with real API fetch later
const dummyEventDetail = {
  id: "1",
  title: "Sunset Beach Yoga & Meditation",
  image: "/placeholder.jpg",
  description: "Join us for a relaxing evening of yoga and meditation as the sun sets over the ocean. Perfect for all levels. Bring your mat and good vibes!",
  date: "2025-12-20T18:00:00",
  location: "Santa Monica Beach, CA",
  category: "Wellness",
  participants: 8,
  maxParticipants: 15,
  price: 20,
  host: {
    name: "Emma Wilson",
    rating: 4.9,
    eventsHosted: 28,
  },
}

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const event = dummyEventDetail // In real app: fetch by params.id

  if (!event) notFound()

  const isFree = event.price === 0
  const spotsLeft = event.maxParticipants - event.participants

  return (
    <div className="container px-4 py-12 max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left: Image + Details */}
        <div className="lg:col-span-2 space-y-8">
          <Image
            src={event.image}
            alt={event.title}
            width={800}
            height={500}
            className="rounded-xl object-cover w-full h-96"
          />

          <div>
            <Badge className="mb-4">{event.category}</Badge>
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          {/* Host Section */}
          <div className="flex items-center gap-4 p-6 bg-muted/50 rounded-xl">
            <Avatar className="h-16 w-16">
              <AvatarFallback>{event.host.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Hosted by {event.host.name}</p>
              <p className="text-sm text-muted-foreground">
                ⭐ {event.host.rating} • {event.host.eventsHosted} events hosted
              </p>
            </div>
            <Button variant="outline" asChild className="ml-auto">
              <Link href={`/profile/${event.host.name.toLowerCase().replace(" ", "-")}`}>View Profile</Link>
            </Button>
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card border rounded-xl p-6 shadow-lg space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-lg">
                <Calendar className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">{new Date(event.date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(event.date).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <p className="font-medium">{event.location}</p>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                <p>
                  <span className="font-medium">{event.participants}</span> going •{" "}
                  <span className={spotsLeft <= 3 ? "text-red-600 font-bold" : ""}>
                    {spotsLeft} spots left
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3 text-2xl font-bold">
                {isFree ? "Free" : `$${event.price}`}
                {!isFree && <DollarSign className="h-6 w-6" />}
              </div>
            </div>

            <div className="space-y-3">
              <Button size="lg" className="w-full text-lg" disabled={spotsLeft === 0}>
                {spotsLeft === 0 ? "Event Full" : "Join Event"}
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                Save Event
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}