// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Progress } from "@/components/ui/progress";
// import { Skeleton } from "@/components/ui/skeleton";
// import { format } from "date-fns";
// import {
//   AlertCircle,
//   BarChart3,
//   Calendar,
//   CheckCircle,
//   Clock,
//   DollarSign,
//   Edit,
//   Eye,
//   MoreVertical,
//   PlusCircle,
//   Star,
//   TrendingUp,
//   Users
// } from "lucide-react";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// interface DashboardStats {
//   totalEvents: number;
//   upcomingEvents: number;
//   totalParticipants: number;
//   totalRevenue: number;
//   pendingEvents: number;
//   approvalRate: number;
// }

// interface HostEvent {
//   id: string;
//   title: string;
//   date: Date;
//   location: string;
//   status: string;
//   isApproved: boolean;
//   participants: number;
//   maxParticipants?: number;
//   fee: number;
//   eventType: string;
//   category?: string;
// }

// interface RecentParticipant {
//   id: string;
//   name: string;
//   email: string;
//   eventTitle: string;
//   joinedAt: Date;
// }

// const HostDashboardPage = () => {
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [recentEvents, setRecentEvents] = useState<HostEvent[]>([]);
//   const [upcomingEvents, setUpcomingEvents] = useState<HostEvent[]>([]);
//   const [recentParticipants, setRecentParticipants] = useState<RecentParticipant[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Mock data - replace with actual API calls
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       // Simulate API call delay
//       setTimeout(() => {
//         setStats({
//           totalEvents: 24,
//           upcomingEvents: 8,
//           totalParticipants: 342,
//           totalRevenue: 2450.75,
//           pendingEvents: 3,
//           approvalRate: 87.5
//         });

//         setRecentEvents([
//           {
//             id: "1",
//             title: "Weekend Hiking Adventure",
//             date: new Date("2024-12-15"),
//             location: "Mountain Trail",
//             status: "APPROVED",
//             isApproved: true,
//             participants: 12,
//             maxParticipants: 15,
//             fee: 25,
//             eventType: "HIKE",
//             category: "Outdoor"
//           },
//           {
//             id: "2",
//             title: "Jazz Night Live",
//             date: new Date("2024-12-20"),
//             location: "City Jazz Club",
//             status: "PENDING",
//             isApproved: false,
//             participants: 0,
//             maxParticipants: 50,
//             fee: 40,
//             eventType: "CONCERT",
//             category: "Music"
//           },
//           {
//             id: "3",
//             title: "Board Game Night",
//             date: new Date("2024-12-10"),
//             location: "Community Center",
//             status: "COMPLETED",
//             isApproved: true,
//             participants: 8,
//             maxParticipants: 10,
//             fee: 0,
//             eventType: "GAME_NIGHT",
//             category: "Social"
//           }
//         ]);

//         setUpcomingEvents([
//           {
//             id: "4",
//             title: "Cooking Masterclass",
//             date: new Date("2024-12-25"),
//             location: "Culinary Studio",
//             status: "OPEN",
//             isApproved: true,
//             participants: 6,
//             maxParticipants: 12,
//             fee: 75,
//             eventType: "OTHER",
//             category: "Food"
//           },
//           {
//             id: "5",
//             title: "Morning Yoga Session",
//             date: new Date("2024-12-22"),
//             location: "Beach Park",
//             status: "OPEN",
//             isApproved: true,
//             participants: 15,
//             maxParticipants: 20,
//             fee: 15,
//             eventType: "OTHER",
//             category: "Wellness"
//           }
//         ]);

//         setRecentParticipants([
//           {
//             id: "p1",
//             name: "Alex Johnson",
//             email: "alex@example.com",
//             eventTitle: "Weekend Hiking Adventure",
//             joinedAt: new Date("2024-12-05")
//           },
//           {
//             id: "p2",
//             name: "Sam Wilson",
//             email: "sam@example.com",
//             eventTitle: "Cooking Masterclass",
//             joinedAt: new Date("2024-12-04")
//           },
//           {
//             id: "p3",
//             name: "Taylor Smith",
//             email: "taylor@example.com",
//             eventTitle: "Morning Yoga Session",
//             joinedAt: new Date("2024-12-03")
//           }
//         ]);

//         setLoading(false);
//       }, 1000);
//     };

//     fetchDashboardData();
//   }, []);

//   const getEventStatusBadge = (status: string, isApproved: boolean) => {
//     if (!isApproved) {
//       return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
//     }
    
//     switch (status) {
//       case "OPEN":
//         return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Open</Badge>;
//       case "FULL":
//         return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Full</Badge>;
//       case "CANCELLED":
//         return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Cancelled</Badge>;
//       case "COMPLETED":
//         return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Completed</Badge>;
//       default:
//         return <Badge variant="outline">{status}</Badge>;
//     }
//   };

//   const getEventTypeIcon = (eventType: string) => {
//     switch (eventType) {
//       case "CONCERT":
//         return "🎵";
//       case "HIKE":
//         return "🥾";
//       case "DINNER":
//         return "🍽️";
//       case "GAME_NIGHT":
//         return "🎮";
//       case "SPORT":
//         return "⚽";
//       case "ART":
//         return "🎨";
//       default:
//         return "🎉";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8 space-y-6">
//         {/* Header Skeleton */}
//         <div className="flex justify-between items-center">
//           <div>
//             <Skeleton className="h-8 w-48" />
//             <Skeleton className="h-4 w-64 mt-2" />
//           </div>
//           <Skeleton className="h-10 w-32" />
//         </div>

//         {/* Stats Grid Skeleton */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {[1, 2, 3, 4].map((i) => (
//             <Card key={i}>
//               <CardHeader className="pb-2">
//                 <Skeleton className="h-4 w-24" />
//                 <Skeleton className="h-8 w-16 mt-2" />
//               </CardHeader>
//               <CardContent>
//                 <Skeleton className="h-4 w-32" />
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Content Grid Skeleton */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-6">
//             <Card>
//               <CardHeader>
//                 <Skeleton className="h-6 w-32" />
//                 <Skeleton className="h-4 w-48 mt-1" />
//               </CardHeader>
//               <CardContent>
//                 {[1, 2, 3].map((i) => (
//                   <div key={i} className="flex items-center justify-between py-3">
//                     <Skeleton className="h-4 w-48" />
//                     <Skeleton className="h-8 w-20" />
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           </div>
//           <div className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <Skeleton className="h-6 w-32" />
//                 <Skeleton className="h-4 w-48 mt-1" />
//               </CardHeader>
//               <CardContent>
//                 {[1, 2].map((i) => (
//                   <div key={i} className="py-3">
//                     <Skeleton className="h-4 w-32 mb-2" />
//                     <Skeleton className="h-2 w-full" />
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Host Dashboard</h1>
//           <p className="text-muted-foreground mt-2">
//             Manage your events, track performance, and connect with participants
//           </p>
//         </div>
//         <Button asChild className="gap-2">
//           <Link href="/dashboard/crate-event">
//             <PlusCircle className="h-4 w-4" />
//             Create New Event
//           </Link>
//         </Button>
//       </div>

//       {/* Quick Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Total Events
//             </CardTitle>
//             <div className="flex items-center gap-2">
//               <Calendar className="h-5 w-5 text-blue-600" />
//               <span className="text-2xl font-bold">{stats?.totalEvents}</span>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-1 text-sm text-green-600">
//               <TrendingUp className="h-4 w-4" />
//               <span>+12% from last month</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Total Participants
//             </CardTitle>
//             <div className="flex items-center gap-2">
//               <Users className="h-5 w-5 text-green-600" />
//               <span className="text-2xl font-bold">{stats?.totalParticipants}</span>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-1 text-sm text-green-600">
//               <TrendingUp className="h-4 w-4" />
//               <span>+8 this week</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Total Revenue
//             </CardTitle>
//             <div className="flex items-center gap-2">
//               <DollarSign className="h-5 w-5 text-purple-600" />
//               <span className="text-2xl font-bold">${stats?.totalRevenue?.toFixed(2)}</span>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-1 text-sm text-green-600">
//               <TrendingUp className="h-4 w-4" />
//               <span>+24% from last month</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Approval Rate
//             </CardTitle>
//             <div className="flex items-center gap-2">
//               <CheckCircle className="h-5 w-5 text-orange-600" />
//               <span className="text-2xl font-bold">{stats?.approvalRate}%</span>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-1 text-sm text-muted-foreground">
//               <AlertCircle className="h-4 w-4" />
//               <span>{stats?.pendingEvents} pending approval</span>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Recent Events & Actions */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Recent Events */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <CardTitle>Recent Events</CardTitle>
//                   <CardDescription>
//                     Your recently created and updated events
//                   </CardDescription>
//                 </div>
//                 <Button variant="outline" size="sm" asChild>
//                   <Link href="/dashboard/host/events">View All</Link>
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {recentEvents.map((event) => (
//                   <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
//                     <div className="flex items-start gap-3">
//                       <div className="text-2xl">{getEventTypeIcon(event.eventType)}</div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <h4 className="font-medium">{event.title}</h4>
//                           {getEventStatusBadge(event.status, event.isApproved)}
//                         </div>
//                         <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
//                           <span className="flex items-center gap-1">
//                             <Calendar className="h-3 w-3" />
//                             {format(event.date, "MMM d, yyyy")}
//                           </span>
//                           <span>•</span>
//                           <span>{event.location}</span>
//                           <span>•</span>
//                           <span className="flex items-center gap-1">
//                             <Users className="h-3 w-3" />
//                             {event.participants}/{event.maxParticipants || "∞"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Badge variant={event.fee > 0 ? "default" : "secondary"}>
//                         {event.fee > 0 ? `$${event.fee}` : "Free"}
//                       </Badge>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="icon">
//                             <MoreVertical className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem asChild>
//                             <Link href={`/dashboard/host/events/${event.id}`}>
//                               <Eye className="h-4 w-4 mr-2" />
//                               View Details
//                             </Link>
//                           </DropdownMenuItem>
//                           <DropdownMenuItem asChild>
//                             <Link href={`/dashboard/host/events/${event.id}/edit`}>
//                               <Edit className="h-4 w-4 mr-2" />
//                               Edit Event
//                             </Link>
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Quick Actions */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Quick Actions</CardTitle>
//               <CardDescription>
//                 Common tasks for managing your events
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Button variant="outline" className="h-auto py-4 justify-start" asChild>
//                   <Link href="/dashboard/host/events/create">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                         <PlusCircle className="h-5 w-5 text-blue-600" />
//                       </div>
//                       <div className="text-left">
//                         <div className="font-medium">Create Event</div>
//                         <div className="text-sm text-muted-foreground">Start a new event</div>
//                       </div>
//                     </div>
//                   </Link>
//                 </Button>

//                 <Button variant="outline" className="h-auto py-4 justify-start" asChild>
//                   <Link href="/dashboard/host/events">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                         <Eye className="h-5 w-5 text-green-600" />
//                       </div>
//                       <div className="text-left">
//                         <div className="font-medium">Manage Events</div>
//                         <div className="text-sm text-muted-foreground">View all your events</div>
//                       </div>
//                     </div>
//                   </Link>
//                 </Button>

//                 <Button variant="outline" className="h-auto py-4 justify-start" asChild>
//                   <Link href="/dashboard/host/participants">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
//                         <Users className="h-5 w-5 text-purple-600" />
//                       </div>
//                       <div className="text-left">
//                         <div className="font-medium">Participants</div>
//                         <div className="text-sm text-muted-foreground">Manage attendees</div>
//                       </div>
//                     </div>
//                   </Link>
//                 </Button>

//                 <Button variant="outline" className="h-auto py-4 justify-start" asChild>
//                   <Link href="/dashboard/host/analytics">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
//                         <BarChart3 className="h-5 w-5 text-orange-600" />
//                       </div>
//                       <div className="text-left">
//                         <div className="font-medium">Analytics</div>
//                         <div className="text-sm text-muted-foreground">View insights & reports</div>
//                       </div>
//                     </div>
//                   </Link>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Column - Upcoming & Recent */}
//         <div className="space-y-6">
//           {/* Upcoming Events */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Upcoming Events</CardTitle>
//               <CardDescription>
//                 Events happening soon
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {upcomingEvents.map((event) => (
//                   <div key={event.id} className="p-3 border rounded-lg">
//                     <div className="flex items-center gap-3">
//                       <div className="text-xl">{getEventTypeIcon(event.eventType)}</div>
//                       <div className="flex-1">
//                         <h4 className="font-medium text-sm">{event.title}</h4>
//                         <div className="flex items-center gap-2 mt-1">
//                           <Clock className="h-3 w-3 text-muted-foreground" />
//                           <span className="text-xs text-muted-foreground">
//                             {format(event.date, "MMM d • h:mm a")}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="font-medium text-sm">
//                           {event.participants}/{event.maxParticipants || "∞"}
//                         </div>
//                         <div className="text-xs text-muted-foreground">spots filled</div>
//                       </div>
//                     </div>
//                     <Progress 
//                       value={(event.participants / (event.maxParticipants || 100)) * 100} 
//                       className="mt-2 h-1"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Recent Participants */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Recent Participants</CardTitle>
//               <CardDescription>
//                 Latest joiners to your events
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {recentParticipants.map((participant) => (
//                   <div key={participant.id} className="flex items-center justify-between">
//                     <div>
//                       <div className="font-medium">{participant.name}</div>
//                       <div className="text-sm text-muted-foreground">
//                         Joined {participant.eventTitle}
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-xs text-muted-foreground">
//                         {format(participant.joinedAt, "MMM d")}
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                         <span className="text-xs">4.8</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Host Rating */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Host Rating</CardTitle>
//               <CardDescription>
//                 Your performance as a host
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center gap-4">
//                 <div className="text-center">
//                   <div className="text-3xl font-bold">4.8</div>
//                   <div className="flex items-center gap-1">
//                     {[1, 2, 3, 4, 5].map((i) => (
//                       <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                     ))}
//                   </div>
//                 </div>
//                 <div className="flex-1">
//                   <div className="text-sm text-muted-foreground mb-1">Based on 42 reviews</div>
//                   <div className="space-y-1">
//                     {[5, 4, 3, 2, 1].map((rating) => (
//                       <div key={rating} className="flex items-center gap-2">
//                         <span className="text-xs w-4">{rating}</span>
//                         <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//                         <Progress value={rating * 20} className="h-1.5" />
//                         <span className="text-xs w-8 text-right">{rating * 8}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HostDashboardPage;


"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getHostDashboardUser } from "@/services/user/dashboard";
import { format } from "date-fns";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  MoreVertical,
  PlusCircle,
  Star,
  Users
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalParticipants: number;
  totalRevenue: number;
  pendingEvents: number;
  approvalRate: number;
}

interface HostEvent {
  id: string;
  title: string;
  date: Date;
  location: string;
  status: string;
  isApproved: boolean;
  participants: number;
  maxParticipants?: number;
  fee: number;
  eventType: string;
  category?: string;
}

interface RecentParticipant {
  id: string;
  name: string;
  email: string;
  eventTitle: string;
  joinedAt: Date;
}

const HostDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<HostEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<HostEvent[]>([]);
  const [recentParticipants, setRecentParticipants] = useState<RecentParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Fetch host user info
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get host user info
        const userData = await getHostDashboardUser();
        setUser(userData);

        // Set empty stats
        setStats({
          totalEvents: 0,
          upcomingEvents: 0,
          totalParticipants: 0,
          totalRevenue: 0,
          pendingEvents: 0,
          approvalRate: 0
        });

        // Empty arrays
        setRecentEvents([]);
        setUpcomingEvents([]);
        setRecentParticipants([]);

      } catch (error) {
        console.error("Error fetching host dashboard data:", error);
        // Set fallback data
        setStats({
          totalEvents: 0,
          upcomingEvents: 0,
          totalParticipants: 0,
          totalRevenue: 0,
          pendingEvents: 0,
          approvalRate: 0
        });
        setRecentEvents([]);
        setUpcomingEvents([]);
        setRecentParticipants([]);
        setUser({
          name: "Guest Host",
          email: "host@example.com",
          role: "HOST"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getEventStatusBadge = (status: string, isApproved: boolean) => {
    if (!isApproved) {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    }
    
    switch (status) {
      case "OPEN":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Open</Badge>;
      case "FULL":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Full</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Cancelled</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case "CONCERT":
        return "🎵";
      case "HIKE":
        return "🥾";
      case "DINNER":
        return "🍽️";
      case "GAME_NIGHT":
        return "🎮";
      case "SPORT":
        return "⚽";
      case "ART":
        return "🎨";
      default:
        return "🎉";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48 mt-1" />
              </CardHeader>
              <CardContent>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48 mt-1" />
              </CardHeader>
              <CardContent>
                {[1, 2].map((i) => (
                  <div key={i} className="py-3">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Host Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome, {user?.name}! Manage your events and track performance
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="gap-1">
              <Star className="h-3 w-3" />
              Host Account
            </Badge>
            {user?.ratingAvg > 0 && (
              
                <Badge variant="outline" className="gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {user.ratingAvg.toFixed(1)} ({user.ratingCount} reviews)
                </Badge>
              
            )}
          </div>
        </div>
        <Button asChild className="gap-2">
          <Link href="/host/dashboard/create-event">
            <PlusCircle className="h-4 w-4" />
            Create New Event
          </Link>
        </Button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Events
            </CardTitle>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{stats?.totalEvents || 0}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>No events created yet</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Participants
            </CardTitle>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">{stats?.totalParticipants || 0}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>No participants yet</span>
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
              <span className="text-2xl font-bold">${stats?.totalRevenue?.toFixed(2) || "0.00"}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Start creating paid events</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approval Rate
            </CardTitle>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold">{stats?.approvalRate || 0}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>{stats?.pendingEvents || 0} pending events</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Events & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Events</CardTitle>
                  <CardDescription>
                    Your recently created and updated events
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/host/events">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentEvents.length > 0 ? (
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{getEventTypeIcon(event.eventType)}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{event.title}</h4>
                            {getEventStatusBadge(event.status, event.isApproved)}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(event.date, "MMM d, yyyy")}
                            </span>
                            <span>•</span>
                            <span>{event.location}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.participants}/{event.maxParticipants || "∞"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={event.fee > 0 ? "default" : "secondary"}>
                          {event.fee > 0 ? `$${event.fee}` : "Free"}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/host/events/${event.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/host/events/${event.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Event
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No events yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first event to get started!</p>
                  <Button asChild>
                    <Link href="/host/dashboard/create-event">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Event
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks for managing your events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-4 justify-start" asChild>
                  <Link href="/host/dashboard/create-event">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <PlusCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Create Event</div>
                        <div className="text-sm text-muted-foreground">Start a new event</div>
                      </div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto py-4 justify-start" asChild>
                  <Link href="/dashboard/host/events">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Eye className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Manage Events</div>
                        <div className="text-sm text-muted-foreground">View all your events</div>
                      </div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto py-4 justify-start" asChild>
                  <Link href="/dashboard/host/participants">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Participants</div>
                        <div className="text-sm text-muted-foreground">Manage attendees</div>
                      </div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto py-4 justify-start" asChild>
                  <Link href="/dashboard/host/analytics">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Analytics</div>
                        <div className="text-sm text-muted-foreground">View insights & reports</div>
                      </div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Upcoming & Recent */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Events happening soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-xl">{getEventTypeIcon(event.eventType)}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {format(event.date, "MMM d • h:mm a")}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-sm">
                            {event.participants}/{event.maxParticipants || "∞"}
                          </div>
                          <div className="text-xs text-muted-foreground">spots filled</div>
                        </div>
                      </div>
                      <Progress 
                        value={(event.participants / (event.maxParticipants || 100)) * 100} 
                        className="mt-2 h-1"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                  <h4 className="font-medium text-sm mb-1">No upcoming events</h4>
                  <p className="text-xs text-muted-foreground">Create events to see them here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Participants */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Participants</CardTitle>
              <CardDescription>
                Latest joiners to your events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentParticipants.length > 0 ? (
                <div className="space-y-4">
                  {recentParticipants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{participant.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Joined {participant.eventTitle}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {format(participant.joinedAt, "MMM d")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">4.8</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                  <h4 className="font-medium text-sm mb-1">No participants yet</h4>
                  <p className="text-xs text-muted-foreground">Participants will appear here once they join your events</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Host Rating */}
          <Card>
            <CardHeader>
              <CardTitle>Host Rating</CardTitle>
              <CardDescription>
                Your performance as a host
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user?.ratingCount > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{user.ratingAvg.toFixed(1)}</div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className={`h-3 w-3 ${i <= Math.round(user.ratingAvg) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Based on {user.ratingCount} reviews</div>
                    <div className="space-y-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-xs w-4">{rating}</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Progress value={rating === 5 ? 80 : rating === 4 ? 15 : 5} className="h-1.5" />
                          <span className="text-xs w-8 text-right">
                            {rating === 5 ? '80%' : rating === 4 ? '15%' : '5%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Star className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                  <h4 className="font-medium text-sm mb-1">No ratings yet</h4>
                  <p className="text-xs text-muted-foreground">Your rating will appear here once you get reviews</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HostDashboardPage;