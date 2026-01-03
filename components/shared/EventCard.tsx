// @/components/EventCard.tsx - A likely structure


import { Event } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

interface EventCardProps {
  event: Event;
  showHost?: boolean; // This prop controls if the host's info is shown
}

export function EventCard({ event, showHost = true }: EventCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Event Image */}
      <div className="relative h-48 w-full">
        <Image
          src={event.imageUrl || "/placeholder-event.jpg"}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{event.title}</h3>
          <Badge variant="secondary">{event.eventType}</Badge>
        </div>
        {/* Conditionally show host info based on the prop */}
        {showHost && event.host && (
          <p className="text-sm text-muted-foreground">
            Hosted by {event.host.name}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{event.location}</span>
        </div>
        {/* Other event details like fee, participants count... */}
      </CardContent>

      <CardFooter>
        <Badge variant={event.isPaidEvent ? "default" : "outline"}>
          {event.isPaidEvent ? `$${event.fee}` : "Free"}
        </Badge>
      </CardFooter>
    </Card>
  );
}