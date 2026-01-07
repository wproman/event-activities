import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
      <div className="container px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Never Go to Events <span className="text-primary">Alone</span> Again
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Find like-minded people to join you for concerts, hiking, board games,
          sports, dinners, tech meetups — anything!
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="text-lg px-8">
            <Link href="/events">
              Find Activities <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-lg px-8">
            <Link href="/events/create">Create Event</Link>
          </Button>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span>10k+ Happy Members</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>500+ Events This Week</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>50+ Cities</span>
          </div>
        </div>
      </div>
    </section>
  );
}
