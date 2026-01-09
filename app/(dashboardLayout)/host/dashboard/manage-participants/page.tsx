/** biome-ignore-all lint/suspicious/noAssignInExpressions: <explanation> */
"use client";

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
    Mail,
    MapPin,
    MessageSquare,
    MoreVertical,
    Search,
    UserCheck,
    User as UserIcon,
    Users,
    UserX
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// Types
import { EventParticipant, ParticipantStats } from "@/app/types";
// UI Components
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
import { getAllHostEventParticipants, markParticipantAsPaid, removeParticipant, updateParticipantStatus } from "@/services/eventParticipents/participantsService";

// Stats interface
interface Stats extends ParticipantStats {}

const ManageParticipantsPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

// ManageParticipantsPage.tsx - fetchData function

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching participants data...");
      
      // Call the service
      const participantsResponse = await getAllHostEventParticipants();
      console.log("API Response received:", participantsResponse);
      
      // ✅ Check the structure properly
      if (participantsResponse && participantsResponse.success) {
        // Make sure data exists
        if (participantsResponse.data) {
          setParticipants(participantsResponse.data.participants || []);
          setStats(participantsResponse.data.stats || null);
        } else {
          console.warn("API returned success but no data");
          setParticipants([]);
          setStats(null);
        }
      } else {
        throw new Error(participantsResponse?.message || "Failed to load participants");
      }

    } catch (err: any) {
      console.error("❌ Error fetching data:", err);
      setError(err.message || "Failed to load participants data");
      setParticipants([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
// ManageParticipantsPage.tsx - fetchData function-এ
const fetchData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    console.log("Fetching participants data...");
    
    // Test endpoint directly
    const testUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/participants/host/all`;
    console.log("API URL:", testUrl);
    
    const participantsResponse = await getAllHostEventParticipants();
    console.log("API Response:", participantsResponse);
    
    if (participantsResponse.success && participantsResponse.data) {
      setParticipants(participantsResponse.data.participants || []);
      setStats(participantsResponse.data.stats);
    } else {
      throw new Error(participantsResponse.message || "Failed to load participants");
    }

  } catch (err: any) {
    console.error("Error fetching data:", err);
    setError(err.message || "Failed to load participants data");
    setParticipants([]);
    setStats(null);
    setLoading(false); // ✅ Error হতেই loading stop
    return; // Early return
  }
  
  setLoading(false); // ✅ Success হলে loading stop
};

  // Helper function to get status badge
  const getStatusBadge = (participant: EventParticipant) => {
    const status = participant.status?.toUpperCase();
    const paymentStatus = participant.payment?.status?.toLowerCase();

    // If payment is completed, show as PAID
    if (paymentStatus === "completed" || paymentStatus === "succeeded") {
      return (
        <Badge className="bg-green-500 hover:bg-green-600 text-white">
          <CheckCircle className="h-3 w-3 mr-1" />
          Paid
        </Badge>
      );
    }

    // Otherwise use the participant status
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Confirmed</Badge>;
      case "PENDING":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "WAITLIST":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-700">
            Waitlist
          </Badge>
        );
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  // Helper function to get payment badge
  const getPaymentBadge = (participant: EventParticipant) => {
    const fee = typeof participant.event.fee === 'string' ? parseFloat(participant.event.fee) : participant.event.fee || 0;
    const paymentStatus = participant.payment?.status?.toLowerCase();

    if (fee === 0) {
      return <Badge variant="secondary">Free</Badge>;
    }

    const amount = participant.payment?.amount || fee;

    switch (paymentStatus) {
      case "completed":
      case "succeeded":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            ${amount}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-700">
            <Clock className="h-3 w-3 mr-1" />
            ${amount}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-600">
            ${amount} (Unpaid)
          </Badge>
        );
    }
  };

  // Handle status update
  const handleUpdateStatus = async (participantId: string, status: string) => {
    try {
      const result = await updateParticipantStatus(participantId, status);
      
      if (result.success) {
        toast.success(result.message);
        
        // Update local state
        setParticipants(prev => prev.map(p => 
          p.id === participantId ? { ...p, status } : p
        ));
        
        fetchData(); // Refresh data
      }
    } catch (error: any) {
     toast.error(error.message);
    }
  };

  // Handle mark as paid
  const handleMarkAsPaid = async (participantId: string) => {
    try {
      const result = await markParticipantAsPaid(participantId, {
        transactionId: `manual-${Date.now()}`,
      });
      
      if (result.success) {
       toast.success(result.message);
        
        fetchData(); // Refresh data
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Handle remove participant
  const handleRemoveParticipant = async (participantId: string) => {
    if (!confirm("Are you sure you want to remove this participant?")) {
      return;
    }
    
    try {
      const result = await removeParticipant(participantId);
      
      if (result.success) {
        toast.success(result.message);
        
        // Remove from local state
        setParticipants(prev => prev.filter(p => p.id !== participantId));
        
        // Update stats
        if (stats) {
          setStats({
            ...stats,
            totalParticipants: stats.totalParticipants - 1,
          });
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Filter participants based on search and active tab
  const filteredParticipants = participants.filter(participant => {
    const searchLower = searchTerm.toLowerCase();
    const userName = participant.user?.name || "";
    const userEmail = participant.user?.email || "";
    const eventTitle = participant.event?.title || "";
    const eventLocation = participant.event?.location || "";

    // Search filter
    const matchesSearch = searchTerm === "" ||
      userName.toLowerCase().includes(searchLower) ||
      userEmail.toLowerCase().includes(searchLower) ||
      eventTitle.toLowerCase().includes(searchLower) ||
      eventLocation.toLowerCase().includes(searchLower);

    // Tab filter
    const paymentStatus = participant.payment?.status?.toLowerCase();
    const participantStatus = participant.status?.toUpperCase();
    let matchesTab = true;

    if (activeTab !== "all") {
      switch (activeTab) {
        case "paid":
          matchesTab = paymentStatus === "completed" || paymentStatus === "succeeded";
          break;
        case "pending":
          matchesTab = paymentStatus === "pending" || participantStatus === "PENDING";
          break;
        case "confirmed":
          matchesTab = participantStatus === "CONFIRMED";
          break;
      }
    }

    return matchesSearch && matchesTab;
  });

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
        
        {/* Table skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-20 w-full mb-4" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Participants</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchData}>
              Try Again
            </Button>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Participants
            </CardTitle>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{stats?.totalParticipants || 0}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Across all events
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
              <span className="text-2xl font-bold">{stats?.activeEvents || 0}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              With registered participants
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
              <span className="text-2xl font-bold">${stats?.totalRevenue || 0}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {stats?.paidParticipants || 0} paid participants
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
              <span className="text-2xl font-bold">${stats?.pendingPayments || 0}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {stats?.pendingParticipants || 0} pending payments
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

      {/* Tabs and Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All Participants
            <Badge variant="secondary" className="ml-1">
              {participants.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="paid" className="flex items-center gap-2">
            Paid
            <Badge variant="default" className="ml-1">
              {participants.filter(p => p.payment?.status === "completed" || p.payment?.status === "succeeded").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            Pending
            <Badge variant="outline" className="ml-1">
              {participants.filter(p => p.payment?.status === "pending" || p.status?.toUpperCase() === "PENDING").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="flex items-center gap-2">
            Confirmed
            <Badge variant="outline" className="ml-1">
              {participants.filter(p => p.status?.toUpperCase() === "CONFIRMED").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="free" className="flex items-center gap-2">
            Free Events
            <Badge variant="outline" className="ml-1">
              {participants.filter(p => p.event.fee === 0).length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredParticipants.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Participants Found</h3>
                <p className="text-muted-foreground mb-4">
                  {participants.length === 0 
                    ? "You don't have any participants yet. Create events to get participants."
                    : "No participants match your current filters"}
                </p>
                <Button variant="outline" asChild>
                  <Link href="/host/dashboard/create-event">
                    Create New Event
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50 dark:bg-gray-900">
                        <th className="text-left py-3 px-4 font-medium">Participant</th>
                        <th className="text-left py-3 px-4 font-medium">Event</th>
                        <th className="text-left py-3 px-4 font-medium">Joined Date</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Payment</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredParticipants.map((participant) => (
                        <tr key={`${participant.id}-${participant.eventId}`} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={participant.user?.avatarUrl || ""} />
                                <AvatarFallback>
                                  {participant.user?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{participant.user?.name || "Unknown"}</div>
                                <div className="text-sm text-muted-foreground">
                                  {participant.user?.email || "No email"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{participant.event?.title || "Unknown Event"}</div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(participant.event?.date || new Date()), "MMM d, yyyy")}
                                <span className="mx-1">•</span>
                                <MapPin className="h-3 w-3" />
                                {participant.event?.location || "Unknown location"}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              {format(new Date(participant.createdAt), "MMM d, yyyy")}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(participant)}
                          </td>
                          <td className="py-3 px-4">
                            {getPaymentBadge(participant)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" asChild>
                                <Link href={`/host/dashboard/events/${participant.eventId}/participants`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => window.location.href = `mailto:${participant.user?.email}`}
                                disabled={!participant.user?.email}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/profile/${participant.userId}`}>
                                      <UserIcon className="h-4 w-4 mr-2" />
                                      View Profile
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(participant.id, "CONFIRMED")}>
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Confirm
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleMarkAsPaid(participant.id)}>
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Mark as Paid
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleRemoveParticipant(participant.id)}
                                  >
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
          )}
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
              <Link href="/host/dashboard/analytics">
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

            <Button 
              variant="outline" 
              className="h-auto py-4 justify-start"
              onClick={() => {
                // Bulk messaging functionality
                const emails = participants.map(p => p.user?.email).filter(Boolean).join(',');
                window.location.href = `mailto:?bcc=${emails}`;
              }}
              disabled={participants.length === 0}
            >
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

export default ManageParticipantsPage;