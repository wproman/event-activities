/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCookie } from "@/services/auth/tokenHandlers";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  Filter,
  MapPin,
  MessageSquare,
  MoreVertical,
  Search,
  TrendingUp,
  UserCheck,
  User as UserIcon,
  Users,
  UserX
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface EventParticipant {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    city?: string;
  };
  event: {
    id: string;
    title: string;
    date: Date;
    location: string;
    fee: number;
    maxParticipants?: number;
  };
  joinedAt: Date;
  status: string;
  paymentStatus?: string;
}

interface Stats {
  totalParticipants: number;
  activeEvents: number;
  totalRevenue: number;
  pendingPayments: number;
}

const ManageParticipantsPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

 useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      // Call your Express backend API to get host's events
      const accessToken = await getCookie("accessToken");
      
      // First, get the host's events
      const eventsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/events/my-events`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        
        if (eventsData.success) {
          // Transform the data to match your interface
          const transformedParticipants = eventsData.data.flatMap((item: any) => {
            if (!item.event) return [];
            
            return {
              id: item.id,
              userId: item.userId,
              eventId: item.eventId,
              user: {
                id: item.userId,
                name: item.event.host?.name || "Unknown",
                email: item.user?.email || "",
                avatarUrl: item.user?.avatarUrl,
                city: item.user?.city,
                interests: item.user?.interests || [],
                ratingAvg: item.user?.ratingAvg
              },
              createdAt: new Date(item.createdAt),
              status: item.status || "REGISTERED",
              payment: item.payment
            };
          });

          setParticipants(transformedParticipants);
          
          // Calculate stats
          const totalParticipants = transformedParticipants.length;
          const paidParticipants = transformedParticipants.filter((p: { payment: { status: string; }; }) => 
            p.payment?.status === "completed"
          ).length;
          const pendingPayments = transformedParticipants
            .filter((p: { payment: { status: string; }; }) => p.payment?.status === "pending")
            .reduce((sum: any, p: { payment: { amount: any; }; }) => sum + (p.payment?.amount || 0), 0);
          
          setStats({
            totalParticipants,
            activeEvents: new Set(transformedParticipants.map((p: { eventId: any; }) => p.eventId)).size,
            totalRevenue: transformedParticipants
              .filter((p: { payment: { status: string; }; }) => p.payment?.status === "completed")
              .reduce((sum: any, p: { payment: { amount: any; }; }) => sum + (p.payment?.amount || 0), 0),
            pendingPayments
          });
        }
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
      // Keep mock data as fallback
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge variant="default">Paid</Badge>;
      case "REGISTERED":
        return <Badge variant="secondary">Registered</Badge>;
      case "PENDING":
        return <Badge variant="outline">Pending</Badge>;
      case "WAITLIST":
        return <Badge variant="outline">Waitlist</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (paymentStatus?: string) => {
    switch (paymentStatus) {
      case "completed":
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" /> Paid</Badge>;
      case "pending":
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case "free":
        return <Badge variant="secondary">Free</Badge>;
      default:
        return <Badge variant="outline">N/A</Badge>;
    }
  };

  const filteredParticipants = participants.filter(participant => {
    // Search filter
    const matchesSearch = searchTerm === "" ||
      participant.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.event.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Tab filter
    const matchesTab = activeTab === "all" || 
      (activeTab === "paid" && participant.status === "PAID") ||
      (activeTab === "pending" && participant.status === "PENDING") ||
      (activeTab === "waitlist" && participant.status === "WAITLIST");

    return matchesSearch && matchesTab;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-20 w-full mb-4" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Participants</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all participants across your events
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/host/dashboard/my-events">
            View My Events
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Participants
            </CardTitle>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{stats?.totalParticipants}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+12 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Events
            </CardTitle>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">{stats?.activeEvents}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              With participants
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold">${stats?.totalRevenue}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              From paid events
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold">${stats?.pendingPayments}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Requires attention
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search participants by name, email, event, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All Participants
            <Badge variant="secondary" className="ml-1">
              {participants.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="paid" className="flex items-center gap-2">
            Paid
            <Badge variant="default" className="ml-1">
              {participants.filter(p => p.status === "PAID").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            Pending
            <Badge variant="outline" className="ml-1">
              {participants.filter(p => p.status === "PENDING").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="waitlist" className="flex items-center gap-2">
            Waitlist
            <Badge variant="outline" className="ml-1">
              {participants.filter(p => p.status === "WAITLIST").length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ParticipantsList participants={filteredParticipants} />
        </TabsContent>
        <TabsContent value="paid" className="mt-6">
          <ParticipantsList participants={filteredParticipants} />
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <ParticipantsList participants={filteredParticipants} />
        </TabsContent>
        <TabsContent value="waitlist" className="mt-6">
          <ParticipantsList participants={filteredParticipants} />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common participant management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 justify-start" asChild>
              <Link href="/host/dashboard/my-events">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">View All Events</div>
                    <div className="text-sm text-muted-foreground">Manage events and participants</div>
                  </div>
                </div>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto py-4 justify-start" asChild>
              <Link href="/host/dashboard/my-payments">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Payment Analytics</div>
                    <div className="text-sm text-muted-foreground">View payment reports</div>
                  </div>
                </div>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto py-4 justify-start">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Bulk Messaging</div>
                  <div className="text-sm text-muted-foreground">Send updates to all participants</div>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Participants List Component
const ParticipantsList = ({ participants }: { participants: EventParticipant[] }) => {
  if (participants.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Participants Found</h3>
          <p className="text-muted-foreground mb-4">
            No participants match your current filters
          </p>
          <Button variant="outline" asChild>
            <Link href="/host/dashboard/my-events">
              View Your Events
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Participant</th>
                <th className="text-left py-3 px-4 font-medium">Event</th>
                <th className="text-left py-3 px-4 font-medium">Joined Date</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Payment</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <tr key={participant.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.user.avatarUrl} />
                        <AvatarFallback>{participant.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{participant.user.name}</div>
                        <div className="text-sm text-muted-foreground">{participant.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{participant.event.title}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(participant.event.date, "MMM d")}
                        <span className="mx-1">•</span>
                        <MapPin className="h-3 w-3" />
                        {participant.event.location}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      {format(participant.joinedAt, "MMM d, yyyy")}
                    </div>
                  </td>
                  {/* <td className="py-3 px-4">
                    {getStatusBadge(participant.status)}
                  </td>
                  <td className="py-3 px-4">
                    {getPaymentBadge(participant.paymentStatus)}
                    {participant.event.fee > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        ${participant.event.fee}
                      </div>
                    )}
                  </td> */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/host/dashboard/my-events/${participant.event.id}/participants`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {/* <Button size="sm" variant="ghost" onClick={() => window.location.href = `mailto:${participant.user.email}`}>
                        <Mail className="h-4 w-4" />
                      </Button> */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/profile/${participant.user.id}`}>
                              <UserIcon className="h-4 w-4 mr-2" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <DollarSign className="h-4 w-4 mr-2" />
                            Mark as Paid
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <UserX className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManageParticipantsPage;