import { Star } from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const topHosts = [
  { name: "Sarah K.", rating: 4.9, events: 42, avatar: "" },
  { name: "Mike Chen", rating: 5.0, events: 38, avatar: "" },
  { name: "Emma L.", rating: 4.8, events: 51, avatar: "" },
]

export default function TopHosts() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Top-Rated Hosts</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {topHosts.map((host) => (
            <div key={host.name} className="bg-card rounded-xl p-6 text-center shadow-md">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarFallback>{host.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{host.name}</h3>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">{host.rating}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{host.events} events hosted</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}