import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bookmark, Calendar, Users } from "lucide-react"
import Link from "next/link"

export default function UserDashboard() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
        {/* Replace with real joined events */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Sunset Beach Yoga</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Dec 20, 2025 • Santa Monica</p>
              <Button asChild className="mt-4 w-full">
                <Link href="/events/1">View Details</Link>
              </Button>
            </CardContent>
          </Card>
          {/* More cards... */}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <Calendar className="h-10 w-10 mx-auto text-primary mb-3" />
          <p className="text-2xl font-bold">5</p>
          <p className="text-muted-foreground">Upcoming Events</p>
        </Card>
        <Card className="text-center p-6">
          <Users className="h-10 w-10 mx-auto text-primary mb-3" />
          <p className="text-2xl font-bold">23</p>
          <p className="text-muted-foreground">Past Events Attended</p>
        </Card>
        <Card className="text-center p-6">
          <Bookmark className="h-10 w-10 mx-auto text-primary mb-3" />
          <p className="text-2xl font-bold">8</p>
          <p className="text-muted-foreground">Saved Events</p>
        </Card>
      </section>

      <div className="text-center">
        <Button size="lg" asChild>
          <Link href="/events">Browse More Events</Link>
        </Button>
      </div>
    </div>
  )
}