/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = 'force-dynamic'

import EventFilterClient from "@/components/modules/Event/EventfiterClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import getHostCreatedAllEvents from "@/services/host/getHostCreatedAllEvents";
import { AlertCircle, Calendar, DollarSign, PlusCircle, Users } from "lucide-react";
import Link from "next/link";

const MyEventPage = async () => {
  const events = await getHostCreatedAllEvents();

  // Calculate some stats
  const totalPaidEvents = events.filter((e: any) => e.isPaidEvent).length;
  const upcomingEvents = events.filter((e: any) => 
    new Date(e.date) > new Date()
  ).length;

  if (events.length === 0) {
    return (
      <div className="flex justify-center mt-16 px-4">
        <Card className="max-w-md w-full border-border">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl">No Events Created</CardTitle>
            <CardDescription>
              Start creating events to manage them here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Events you create will appear here for management
              </p>
              <Button asChild className="w-full">
                <Link href="/host/dashboard/create-event">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Event
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
          <p className="text-muted-foreground">
            Manage all your created events in one place
          </p>
        </div>
        <Button asChild className="sm:w-auto w-full">
          <Link href="/host/dashboard/create-event">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Event
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid Events</p>
                <p className="text-2xl font-bold">{totalPaidEvents}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingEvents}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Management Card */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Event Management</CardTitle>
              <CardDescription>
                Filter and manage all your created events
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 mt-2 md:mt-0">
              <Badge variant="secondary">
                {events.length} event{events.length !== 1 ? 's' : ''}
              </Badge>
              <Button asChild variant="outline" size="sm" className="hidden sm:flex">
                <Link href="/host/dashboard/create-event">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Event
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* CLIENT FILTERING COMPONENT */}
          <EventFilterClient events={events} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MyEventPage;