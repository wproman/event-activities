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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Filter,
  MoreVertical,
  Settings,
  Shield,
  Trash2,
  TrendingUp,
  Users,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";

interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalRevenue: number;
  pendingApprovals: number;
  activeUsers: number;
  conversionRate: number;
  avgEventRating: number;
  totalPayments: number;
}

interface PendingApproval {
  id: string;
  type: 'event' | 'user';
  title: string;
  submittedBy: string;
  submittedAt: Date;
  details?: string;
  status: string;
}

interface RecentActivity {
  id: string;
  type: 'user_signup' | 'event_created' | 'payment' | 'approval' | 'issue';
  title: string;
  description: string;
  timestamp: Date;
  userId?: string;
  eventId?: string;
}

interface UserGrowth {
  month: string;
  users: number;
  hosts: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  events: number;
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowth[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchAdminData = async () => {
      // Simulate API call delay
      setTimeout(() => {
        setStats({
          totalUsers: 1562,
          totalEvents: 342,
          totalRevenue: 28450.75,
          pendingApprovals: 18,
          activeUsers: 1245,
          conversionRate: 23.5,
          avgEventRating: 4.3,
          totalPayments: 845
        });

        setPendingApprovals([
          {
            id: "1",
            type: 'event',
            title: "Weekend Music Festival",
            submittedBy: "john.doe@example.com",
            submittedAt: new Date("2024-12-05"),
            details: "Large outdoor music event with multiple stages",
            status: "PENDING"
          },
          {
            id: "2",
            type: 'user',
            title: "Host Application",
            submittedBy: "alice.smith@example.com",
            submittedAt: new Date("2024-12-04"),
            details: "Requesting host privileges",
            status: "REVIEW"
          },
          {
            id: "3",
            type: 'event',
            title: "Tech Conference 2024",
            submittedBy: "tech.events@example.com",
            submittedAt: new Date("2024-12-03"),
            details: "Annual technology conference",
            status: "PENDING"
          },
          {
            id: "4",
            type: 'event',
            title: "Charity Gala Dinner",
            submittedBy: "charity.org@example.com",
            submittedAt: new Date("2024-12-02"),
            details: "Fundraising event for local charity",
            status: "PENDING"
          }
        ]);

        setRecentActivities([
          {
            id: "a1",
            type: 'user_signup',
            title: "New User Registered",
            description: "Michael Brown joined as a host",
            timestamp: new Date("2024-12-05T10:30:00"),
            userId: "u123"
          },
          {
            id: "a2",
            type: 'event_created',
            title: "Event Created",
            description: "Yoga Retreat by Sarah Wilson",
            timestamp: new Date("2024-12-05T09:15:00"),
            eventId: "e456"
          },
          {
            id: "a3",
            type: 'payment',
            title: "Large Payment Processed",
            description: "$450 payment for Music Festival",
            timestamp: new Date("2024-12-04T16:45:00"),
            eventId: "e789"
          },
          {
            id: "a4",
            type: 'approval',
            title: "Event Approved",
            description: "Cooking Workshop approved",
            timestamp: new Date("2024-12-04T14:20:00"),
            eventId: "e101"
          },
          {
            id: "a5",
            type: 'issue',
            title: "User Report",
            description: "Reported inappropriate content",
            timestamp: new Date("2024-12-03T11:10:00"),
            userId: "u202"
          }
        ]);

        setUserGrowth([
          { month: "Jan", users: 120, hosts: 15 },
          { month: "Feb", users: 245, hosts: 32 },
          { month: "Mar", users: 380, hosts: 48 },
          { month: "Apr", users: 520, hosts: 65 },
          { month: "May", users: 680, hosts: 85 },
          { month: "Jun", users: 850, hosts: 110 },
          { month: "Jul", users: 1040, hosts: 135 },
          { month: "Aug", users: 1250, hosts: 165 },
          { month: "Sep", users: 1450, hosts: 195 },
          { month: "Oct", users: 1562, hosts: 210 }
        ]);

        setRevenueData([
          { month: "Jan", revenue: 1850, events: 12 },
          { month: "Feb", revenue: 2450, events: 18 },
          { month: "Mar", revenue: 3120, events: 24 },
          { month: "Apr", revenue: 3850, events: 30 },
          { month: "May", revenue: 4520, events: 35 },
          { month: "Jun", revenue: 5210, events: 42 },
          { month: "Jul", revenue: 5980, events: 48 },
          { month: "Aug", revenue: 6840, events: 56 },
          { month: "Sep", revenue: 7650, events: 62 },
          { month: "Oct", revenue: 8540, events: 70 }
        ]);

        setLoading(false);
      }, 1000);
    };

    fetchAdminData();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      PENDING: { label: "Pending", variant: "secondary", icon: <Clock className="h-3 w-3" /> },
      REVIEW: { label: "Under Review", variant: "outline", icon: <AlertCircle className="h-3 w-3" /> },
      APPROVED: { label: "Approved", variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
      REJECTED: { label: "Rejected", variant: "destructive", icon: <XCircle className="h-3 w-3" /> }
    };

    const config = variants[status] || { label: status, variant: "outline", icon: null };
    
    return (
      <Badge variant={config.variant as any} className="gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      user_signup: <Users className="h-4 w-4 text-green-600" />,
      event_created: <Calendar className="h-4 w-4 text-blue-600" />,
      payment: <CreditCard className="h-4 w-4 text-purple-600" />,
      approval: <CheckCircle className="h-4 w-4 text-green-600" />,
      issue: <AlertCircle className="h-4 w-4 text-red-600" />
    };
    
    return icons[type] || <Activity className="h-4 w-4 text-gray-600" />;
  };

  const handleApprove = (id: string) => {
    console.log("Approve", id);
    // Add approval logic
  };

  const handleReject = (id: string) => {
    console.log("Reject", id);
    // Add rejection logic
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

        {/* Tabs Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
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
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Manage platform activities, users, and events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/reports">
              <FileText className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/moderation">
              <Shield className="h-4 w-4 mr-2" />
              Moderation Panel
            </Link>
          </Button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Platform Status: Active
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              {stats?.pendingApprovals} items require attention • Last backup: Today 02:00 AM
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold">{stats?.totalUsers?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+12%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Active:</span>
              <span className="font-medium">{stats?.activeUsers?.toLocaleString()}</span>
              <span className="text-green-600">({Math.round((stats?.activeUsers || 0) / (stats?.totalUsers || 1) * 100)}%)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Events
            </CardTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">{stats?.totalEvents?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+8%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Avg Rating:</span>
              <StarRating rating={stats?.avgEventRating || 0} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold">${stats?.totalRevenue?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+24%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Payments:</span>
              <span className="font-medium">{stats?.totalPayments}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Approvals
            </CardTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <span className="text-2xl font-bold">{stats?.pendingApprovals}</span>
              </div>
              <div className="flex items-center gap-1 text-red-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">+3</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Conversion:</span>
              <span className="font-medium">{stats?.conversionRate}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Approvals */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Pending Approvals</CardTitle>
                      <CardDescription>
                        Items requiring administrative review
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/admin/approvals">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingApprovals.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            item.type === 'event' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-green-50 dark:bg-green-900/20'
                          }`}>
                            {item.type === 'event' ? (
                              <Calendar className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Users className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{item.title}</h4>
                              {getStatusBadge(item.status)}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Submitted by {item.submittedBy}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.details}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="default" onClick={() => handleApprove(item.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject(item.id)}>
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/admin/users">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Users
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/admin/events">
                        <Calendar className="h-4 w-4 mr-2" />
                        Manage Events
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/admin/payments">
                        <CreditCard className="h-4 w-4 mr-2" />
                        View Payments
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/admin/reports">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Generate Reports
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/admin/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        System Settings
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Pending Approvals</CardTitle>
                  <CardDescription>
                    Review and manage all pending items
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-left py-3 px-4 font-medium">Title</th>
                      <th className="text-left py-3 px-4 font-medium">Submitted By</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingApprovals.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                        <td className="py-3 px-4">
                          <Badge variant={item.type === 'event' ? 'default' : 'secondary'}>
                            {item.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-medium">{item.title}</td>
                        <td className="py-3 px-4">{item.submittedBy}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {format(item.submittedAt, "MMM d, yyyy")}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleApprove(item.id)}>
                              Approve
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleReject(item.id)}>
                              Reject
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
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
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  Platform user acquisition over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userGrowth.slice(-6).map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{data.month}</span>
                        <span className="text-sm text-muted-foreground">
                          {data.users} users • {data.hosts} hosts
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <div 
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${(data.users / 1600) * 100}%` }}
                        />
                        <div 
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: `${(data.hosts / 250) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>
                  Monthly revenue and event count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.slice(-6).map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{data.month}</span>
                        <span className="text-sm text-muted-foreground">
                          ${data.revenue.toLocaleString()} • {data.events} events
                        </span>
                      </div>
                      <Progress value={(data.revenue / 9000) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Metrics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Platform Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats?.conversionRate}%</div>
                    <div className="text-sm text-muted-foreground">Conversion Rate</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      ${Math.round((stats?.totalRevenue || 0) / (stats?.totalEvents || 1))}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Revenue/Event</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round((stats?.totalUsers || 0) / 10)}
                    </div>
                    <div className="text-sm text-muted-foreground">New Users/Month</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round((stats?.pendingApprovals || 0) / 3)} days
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Approval Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Log</CardTitle>
              <CardDescription>
                System-wide activities and events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-muted-foreground">{activity.description}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(activity.timestamp, "MMM d, h:mm a")}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Create Ticket
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>
            Platform performance and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">99.8%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1.2s</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">2.4K</div>
              <div className="text-sm text-muted-foreground">Daily Active Users</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300 fill-gray-300'
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

export default AdminDashboardPage;
