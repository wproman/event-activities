// components/modules/event/EventFilterClient.tsx
"use client";


import { Event } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  DollarSign,
  Edit,
  Eye,
  MapPin,
  Search,
  Trash2,
  Users,
  X
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface EventFilterClientProps {
  events: Event[];
}

const EventFilterClient = ({ events }: EventFilterClientProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Event statuses for tabs
  const eventTabs = [
    { value: "all", label: "All Events", count: events.length },
    { value: "PENDING", label: "Pending", count: events.filter(e => e.status === "PENDING").length },
    { value: "APPROVED", label: "Approved", count: events.filter(e => e.status === "APPROVED").length },
    { value: "REJECTED", label: "Rejected", count: events.filter(e => e.status === "REJECTED").length },
    { value: "OPEN", label: "Open", count: events.filter(e => e.status === "OPEN").length },
  ];

  // Filter events based on search, tab, and type
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Tab filter
      const matchesTab = activeTab === "all" || event.status === activeTab;

      // Type filter
      const matchesType = selectedType === "all" || event.eventType === selectedType;

      return matchesSearch && matchesTab && matchesType;
    });
  }, [events, searchTerm, activeTab, selectedType]);

  // Get unique event types
  const eventTypes = useMemo(() => {
    const types = new Set(events.map(event => event.eventType));
    return Array.from(types);
  }, [events]);

  const clearFilters = () => {
    setSearchTerm("");
    setActiveTab("all");
    setSelectedType("all");
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Check if event is upcoming
  const isUpcoming = (date: Date) => {
    return new Date(date) > new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Events</h2>
          <p className="text-muted-foreground">
            Manage all events you&apos;ve created
          </p>
        </div>
        <Button asChild>
          <Link href="/host/create-event">
            + Create New Event
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{events.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {events.filter(e => e.status === "PENDING").length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {events.filter(e => e.status === "APPROVED").length}
              </p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {events.filter(e => isUpcoming(e.date)).length}
              </p>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("all")}
              >
                All Types
              </Button>
              {eventTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>

            {/* Clear Filters */}
            {(searchTerm !== "" || selectedType !== "all") && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          {eventTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="relative">
              {tab.label}
              {tab.count > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {tab.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Results */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </h3>
            <Badge variant="outline">
              {activeTab === "all" ? "All Statuses" : activeTab}
            </Badge>
          </div>

          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No events match your filters</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base line-clamp-1">
                        {event.title}
                      </CardTitle>
                      <Badge variant={
                        event.status === "APPROVED" ? "default" :
                        event.status === "PENDING" ? "secondary" :
                        event.status === "REJECTED" ? "destructive" :
                        "outline"
                      }>
                        {event.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.date)}</span>
                      {isUpcoming(event.date) && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Upcoming
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {event.isPaidEvent ? `$${event.fee}` : "Free"}
                      </Badge>
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        {event.maxParticipants || "∞"}
                      </Badge>
                      <Badge variant="outline">
                        {event.eventType}
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" asChild>
                        <Link href={`/host/dashboard/my-events/${event.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" asChild>
                        <Link href={`/host/dashboard/my-events/${event.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" asChild>
                        <Link href={`/host/dashboard/my-events/${event.id}/delete`}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default EventFilterClient;