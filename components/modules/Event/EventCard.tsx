"use client";


import { Event } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar, DollarSign, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  // Ensure date is always a string before formatting
  const formatDate = (dateInput: string | Date): string => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateInput: string | Date): string => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Convert event.date to Date object for comparison
  const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date;
  const isPastEvent = eventDate < new Date();
  const isFreeEvent = event.fee === 0 || !event.isPaidEvent;

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Event Image */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
            <div className="text-4xl">🎉</div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={
              isPastEvent
                ? "secondary"
                : event.status === "APPROVED"
                ? "default"
                : "outline"
            }
            className="font-medium"
          >
            {isPastEvent ? "PAST" : event.status}
          </Badge>
        </div>
        
        {/* Fee Badge */}
        {!isFreeEvent && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-linear-to-r from-green-500 to-emerald-600 text-white font-medium">
              <DollarSign className="w-3 h-3 mr-1" />
              {event.fee}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-bold text-lg leading-tight line-clamp-1">
              {event.title}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {event._count?.participants || 0} joined
              </span>
              {event.maxParticipants && (
         <>
         </>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3 grow">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {event.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
            <div>
              <span className="font-medium">{formatDate(eventDate)}</span>
              <span className="text-muted-foreground ml-2">
                at {formatTime(eventDate)}
              </span>
            </div>
          </div>

          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          {/* Host Info */}
          <div className="flex items-center pt-2">
            {event.host?.avatarUrl ? (
              <Image
                src={event.host.avatarUrl}
                alt={event.host.name}
                width={24}
                height={24}
                className="rounded-full mr-2"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-2" />
            )}
            <span className="text-sm text-muted-foreground">
              Hosted by{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {event.host?.name || "Anonymous"}
              </span>
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full" disabled={isPastEvent}>
          <Link href={`/events/${event.id}`}>
            {isPastEvent ? "Event Ended" : "View Details"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;