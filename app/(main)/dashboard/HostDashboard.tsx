import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarCheck, DollarSign, Users } from "lucide-react"
import Link from "next/link"

export default function HostDashboard() {
  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Hosted Events</h2>
          <Button asChild>
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Board Game Night</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Dec 25, 2025 • 12/15 joined</p>
              <div className="flex gap-2 mt-4">
                <Button asChild size="sm">
                  <Link href="/events/2">Manage</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/events/edit/2">Edit</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* More hosted events */}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <CalendarCheck className="h-10 w-10 mx-auto text-primary mb-3" />
          <p className="text-2xl font-bold">8</p>
          <p className="text-muted-foreground">Total Events Hosted</p>
        </Card>
        <Card className="text-center p-6">
          <Users className="h-10 w-10 mx-auto text-primary mb-3" />
          <p className="text-2xl font-bold">87</p>
          <p className="text-muted-foreground">Total Participants</p>
        </Card>
        <Card className="text-center p-6">
          <DollarSign className="h-10 w-10 mx-auto text-primary mb-3" />
          <p className="text-2xl font-bold">$1,240</p>
          <p className="text-muted-foreground">Total Earnings</p>
        </Card>
      </section>
    </div>
  )
}