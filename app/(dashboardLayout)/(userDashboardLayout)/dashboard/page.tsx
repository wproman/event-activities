/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardUser } from "@/services/user/dashboard";
import { format } from "date-fns";
import {
  Award,
  Bell,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  Heart,
  MapPin,
  Settings,
  Star,
  Ticket,
  Trophy,
  User,
  Users
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


interface UserStats {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalSpent: number;
  averageRating: number;
  reviewsGiven: number;
  achievements: number;
  favoriteEventType: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  hostName: string;
  eventType: string;
  fee: number;
  status: string;
  participants: number;
  maxParticipants?: number;
}

interface RecentActivity {
  id: string;
  type: 'join' | 'review' | 'payment' | 'achievement';
  title: string;
  description: string;
  date: string;
  eventId?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface Recommendation {
  id: string;
  title: string;
  date: string;
  location: string;
  eventType: string;
  fee: number;
  hostRating: number;
  similarity: number;
}

const UserDashboardPage = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Fetch user info using your userInfo function
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user info from server action
        const userData = await getDashboardUser();
        
        // Set user data
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatarUrl: userData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
          city: userData.city || "Unknown",
          ratingAvg: userData.ratingAvg || 0,
          ratingCount: userData.ratingCount || 0,
          interests: userData.interests || [],
          role: userData.role || "USER",
          status: userData.status || "ACTIVE"
        });

        // Set empty stats (all zeros) - you can replace these with real API calls later
        setUserStats({
          totalEvents: 0,
          upcomingEvents: 0,
          completedEvents: 0,
          totalSpent: 0,
          averageRating: userData.ratingAvg || 0,
          reviewsGiven: 0,
          achievements: 0,
          favoriteEventType: "OTHER"
        });

        // Empty arrays for now
        setUpcomingEvents([]);
        setRecentActivities([]);
        
        // Basic locked achievements
        setAchievements([
          {
            id: "ach1",
            name: "First Timer",
            description: "Join your first event",
            icon: "🥇",
            unlocked: false
          },
          {
            id: "ach2",
            name: "Social Butterfly",
            description: "Join 5 different events",
            icon: "🦋",
            unlocked: false
          },
          {
            id: "ach3",
            name: "Review Master",
            description: "Write 10 reviews",
            icon: "📝",
            unlocked: false
          },
          {
            id: "ach4",
            name: "Event Explorer",
            description: "Try 3 different event types",
            icon: "🧭",
            unlocked: false
          },
          {
            id: "ach5",
            name: "Early Bird",
            description: "Register for 3 events 2 weeks early",
            icon: "🐦",
            unlocked: false
          },
          {
            id: "ach6",
            name: "Perfect Attendee",
            description: "Complete 10 events without cancellation",
            icon: "⭐",
            unlocked: false
          }
        ]);

        // Empty recommendations
        setRecommendations([]);

      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback data
        setUser({
          name: "Guest User",
          email: "guest@example.com",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
          city: "Unknown",
          ratingAvg: 0,
          ratingCount: 0,
          interests: [],
          role: "USER",
          status: "ACTIVE"
        });
        
        setUserStats({
          totalEvents: 0,
          upcomingEvents: 0,
          completedEvents: 0,
          totalSpent: 0,
          averageRating: 0,
          reviewsGiven: 0,
          achievements: 0,
          favoriteEventType: "OTHER"
        });
        
        setUpcomingEvents([]);
        setRecentActivities([]);
        setAchievements([]);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Helper functions remain the same
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
      case "MEETUP":
        return "🤝";
      case "SPORT":
        return "⚽";
      case "ART":
        return "🎨";
      default:
        return "🎉";
    }
  };

  const getEventTypeName = (eventType: string) => {
    return eventType.replace("_", " ").toLowerCase();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'join':
        return <Users className="h-4 w-4 text-green-600" />;
      case 'review':
        return <Star className="h-4 w-4 text-yellow-600" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-blue-600" />;
      case 'achievement':
        return <Trophy className="h-4 w-4 text-purple-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      CONFIRMED: { label: "Confirmed", variant: "default" },
      PAID: { label: "Paid", variant: "default" },
      REGISTERED: { label: "Registered", variant: "secondary" },
      PENDING: { label: "Pending", variant: "outline" },
      CANCELLED: { label: "Cancelled", variant: "destructive" }
    };

    const config = variants[status] || { label: status, variant: "outline" };
    
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  // Loading skeleton (same as before)
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* User Profile Skeleton */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.name}! Here's what's happening with your events.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/notifications">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/book-events">
              <Ticket className="h-4 w-4 mr-2" />
              Browse Events
            </Link>
          </Button>
        </div>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary/10">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{user?.city || "No location set"}</span>
                  <span className="text-muted-foreground">•</span>
                  <Badge variant="outline">{user?.role}</Badge>
                  <span className="text-muted-foreground">•</span>
                  <Badge variant={user?.status === "ACTIVE" ? "default" : "destructive"}>
                    {user?.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">{user?.ratingAvg || "0"}</span>
                  <span className="text-sm text-muted-foreground">({user?.ratingCount || 0} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {user?.interests && user.interests.length > 0 ? (
                user.interests.map((interest: string, index: number) => (
                  <Badge key={index} variant="outline" className="gap-1">
                    <Heart className="h-3 w-3" />
                    {interest}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="gap-1">
                  <Heart className="h-3 w-3" />
                  No interests set
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Events
            </CardTitle>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{userStats?.totalEvents || 0}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>No events yet</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Events
            </CardTitle>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold">{userStats?.upcomingEvents || 0}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Join your first event!
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold">${userStats?.totalSpent?.toFixed(2) || "0.00"}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Start exploring events</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your Rating
            </CardTitle>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold">{userStats?.averageRating || 0}/5</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{userStats?.reviewsGiven || 0} reviews given</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upcoming Events & Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    Your registered events happening soon
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/book-events">Browse Events</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl mt-1">{getEventTypeIcon(event.eventType)}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium group-hover:text-primary transition-colors">
                              {event.title}
                            </h4>
                            {getStatusBadge(event.status)}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(event.date), "MMM d, yyyy • h:mm a")}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              Hosted by {event.hostName}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={event.fee > 0 ? "default" : "secondary"}>
                          {event.fee > 0 ? `$${event.fee}` : "Free"}
                        </Badge>
                        <Button size="sm" variant="ghost" asChild className="gap-1">
                          <Link href={`/events/${event.id}`}>
                            View Details
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
                  <p className="text-muted-foreground mb-4">Join your first event to get started!</p>
                  <Button asChild>
                    <Link href="/dashboard/book-events">
                      <Ticket className="h-4 w-4 mr-2" />
                      Browse Events
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest actions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted-foreground">{activity.description}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(activity.date), "MMM d")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No recent activity</h3>
                  <p className="text-muted-foreground">Your activity will appear here once you start using the platform.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Achievements & Recommendations */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>
                    {userStats?.achievements || 0} unlocked
                  </CardDescription>
                </div>
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`flex flex-col items-center p-3 rounded-lg border text-center ${
                      achievement.unlocked 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="font-medium text-xs">{achievement.name}</div>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {format(achievement.unlockedAt, "MMM yyyy")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/dashboard/book-events">Start Unlocking</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Personalized Recommendations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>For You</CardTitle>
                  <CardDescription>
                    Based on your interests
                  </CardDescription>
                </div>
                <Heart className="h-5 w-5 text-pink-600" />
              </div>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{rec.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(rec.date), "MMM d")}
                            </span>
                            <span>•</span>
                            <span className="text-xs text-muted-foreground">{rec.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={rec.fee > 0 ? "default" : "secondary"}>
                            {rec.fee > 0 ? `$${rec.fee}` : "Free"}
                          </Badge>
                          <div className="flex items-center gap-1 mt-1 justify-end">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs">{rec.hostRating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {getEventTypeIcon(rec.eventType)} {getEventTypeName(rec.eventType)}
                        </span>
                        <div className="text-xs text-green-600">
                          {rec.similarity}% match
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Heart className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                  <h4 className="font-medium text-sm mb-1">No recommendations yet</h4>
                  <p className="text-xs text-muted-foreground">Complete your profile and join events to get personalized recommendations</p>
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/dashboard/book-events">Browse More Events</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Your Event Journey</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Events Completed</span>
                  <span>{userStats?.completedEvents || 0}</span>
                </div>
                <Progress value={(userStats?.completedEvents || 0) * 5} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Favorite Category</span>
                  <span className="capitalize">{getEventTypeName(userStats?.favoriteEventType || "none")}</span>
                </div>
                <div className="text-2xl text-center p-2">
                  {getEventTypeIcon(userStats?.favoriteEventType || "OTHER")}
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold">Level 0</div>
                  <div className="text-sm text-muted-foreground">New Member</div>
                  <div className="flex justify-center mt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Award 
                        key={i} 
                        className={`h-4 w-4 ${i <= 0 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;