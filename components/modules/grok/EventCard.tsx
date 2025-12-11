import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, DollarSign, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


interface EventCardProps {
  event: {
    id: string;
    title: string;
    image: string;
    date: string;
    location: string;
    category: string;
    participants: number;
    maxParticipants: number;
    price: number;
  };
}

export default function EventCard({ event }: EventCardProps) {
  const isFree = event.price === 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Image
        src={event.image || "/placeholder.jpg"}
        alt={event.title}
        width={400}
        height={200}
        className="rounded-t-lg object-cover h-48"
      />
      <CardContent className="p-4">
        <Badge>{event.category}</Badge>
        <h3 className="text-xl font-semibold mt-2">{event.title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm mt-2">
          <Users className="w-4 h-4" />
          <span>{event.participants}/{event.maxParticipants} joined</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-1 font-bold">
          {isFree ? "Free" : `$${event.price}`}
          {!isFree && <DollarSign className="w-4 h-4" />}
        </div>
        <Button asChild>
          <Link href={`/events/${event.id}`}>View Details →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}