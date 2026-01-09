// src/app/host/dashboard/revenue-payments/page.tsx
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation */
/** biome-ignore-all lint/suspicious/noAssignInExpressions: <explanation*/
"use client";

import { format } from "date-fns";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Mail,
  MoreVertical,
  PieChart,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
// Types - CORRECTED IMPORTS
import {
  FormattedPayment,
  HostRevenueStats,
  PAYMENT_STATUS_LABELS,
  PaymentStats
} from "@/app/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportPayments, getHostPayments, getHostRevenueStats, getPaymentStats, updatePaymentStatus } from "@/services/payment/paymentService";


const RevenuePaymentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  
  // Data states
  const [revenueStats, setRevenueStats] = useState<HostRevenueStats | null>(null);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [payments, setPayments] = useState<FormattedPayment[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const [error, setError] = useState<string | null>(null);

  // Fetch payments with filters - DECLARE THIS FIRST
  const fetchPayments = useCallback(async (page: number = 1) => {
    try {
      const filters: any = {};
      if (statusFilter !== "all") filters.status = statusFilter;
      if (dateFilter === "today") {
        filters.dateFrom = format(new Date(), "yyyy-MM-dd");
      } else if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filters.dateFrom = format(weekAgo, "yyyy-MM-dd");
      } else if (dateFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filters.dateFrom = format(monthAgo, "yyyy-MM-dd");
      }

      const response = await getHostPayments(page, pagination.limit, filters);
      
      if (response.success && response.data) {
        setPayments(response.data.payments || []);
        setPagination(response.data.meta || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        });
      }
    } catch (err: any) {
    toast.error(err.message || "Failed to fetch payments");
    }
  }, [statusFilter, dateFilter, pagination.limit]); // Already has dependencies listed

  // Fetch all data - DECLARE THIS AFTER fetchPayments
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch revenue stats
      const revenueResponse = await getHostRevenueStats();
      if (revenueResponse.success) {
        setRevenueStats(revenueResponse.data);
      }
      
      // Fetch payment stats - FIXED: Use proper type
      const statsResponse = await getPaymentStats();
      if (statsResponse.success) {
        setPaymentStats(statsResponse.data);
      }
      
      // Fetch payments
      await fetchPayments(1);
      
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load revenue data");
    } finally {
      setLoading(false);
    }
  }, [fetchPayments]); // Add fetchPayments as dependency

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]); // fetchAllData already has fetchPayments as dependency

  // Rest of your component...
  // Handle status update - FIXED: Use proper status type
  const handleUpdateStatus = async (paymentId: string, status: "pending" | "completed" | "failed" | "succeeded") => {
    try {
      const result = await updatePaymentStatus(paymentId, status);
      
      if (result.success) {
       toast.success("Payment status updated successfully");
        
        // Refresh data
        fetchPayments(pagination.page);
        
        // Refresh stats
        const [revenueResponse, statsResponse] = await Promise.all([
          getHostRevenueStats(),
          getPaymentStats()
        ]);
        
        if (revenueResponse.success) setRevenueStats(revenueResponse.data);
        if (statsResponse.success) setPaymentStats(statsResponse.data);
      }
    } catch (error: any) {
  toast.error(error.message || "Failed to update payment status");
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
    toast.loading("Exporting payments...");

      const filters: any = {};
      if (statusFilter !== "all") filters.status = statusFilter;

      const blob = await exportPayments(filters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
     toast.loading("Export successful!");
    } catch (error: any) {
     toast.error(error.message || "Failed to export payments");
    }
  };

  // Helper function to get status badge - FIXED: Use PAYMENT_STATUS_LABELS
  const getStatusBadge = (status: string) => {
    const statusLabel = PAYMENT_STATUS_LABELS[status as keyof typeof PAYMENT_STATUS_LABELS] || status;
    
    switch (status.toLowerCase()) {
      case "completed":
      case "succeeded":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            {statusLabel}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-700">
            <Clock className="h-3 w-3 mr-1" />
            {statusLabel}
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            {statusLabel}
          </Badge>
        );
      case "refunded":
        return (
          <Badge variant="outline" className="border-red-500 text-red-700">
            {statusLabel}
          </Badge>
        );
      default:
        return <Badge variant="outline">{statusLabel}</Badge>;
    }
  };

  // Helper function to get payment method badge
  const getPaymentMethodBadge = (payment: FormattedPayment) => {
    if (payment.stripePaymentIntentId) {
      return <Badge variant="secondary">Stripe</Badge>;
    }
    return <Badge variant="outline">Manual</Badge>;
  };

  // Filter payments based on search - FIXED: Safe access to properties
  const filteredPayments = payments.filter(payment => {
    const searchLower = searchTerm.toLowerCase();
    const userName = payment.user?.name || "";
    const userEmail = payment.user?.email || "";
    const eventTitle = payment.event?.title || "";
    const transactionId = payment.transactionId || "";

    return searchTerm === "" ||
      userName.toLowerCase().includes(searchLower) ||
      userEmail.toLowerCase().includes(searchLower) ||
      eventTitle.toLowerCase().includes(searchLower) ||
      transactionId.toLowerCase().includes(searchLower);
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
        
        {/* Stats cards skeleton */}
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
            <h3 className="text-lg font-semibold mb-2">Error Loading Revenue Data</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
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
          <h1 className="text-3xl font-bold tracking-tight">Revenue & Payments</h1>
          <p className="text-muted-foreground mt-2">
            Track your earnings and manage payments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={fetchAllData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview - FIXED: Use correct property names */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">
                ${revenueStats?.totalRevenue?.toLocaleString() || 0}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {paymentStats?.totalPayments || 0} total payments
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">
                ${paymentStats?.monthRevenue?.toLocaleString() || 0}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Monthly earnings
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Payments
            </CardTitle>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">
                {revenueStats?.completedPayments || 0}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              ${revenueStats?.completedRevenue?.toLocaleString() || 0} earned
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold">
                {revenueStats?.pendingPayments || 0}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              ${revenueStats?.pendingRevenue?.toLocaleString() || 0} pending
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Payments
            <Badge variant="secondary" className="ml-1">
              {pagination.total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab - FIXED: Check for data existence */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Revenue by Month */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>
                Monthly revenue over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {revenueStats?.revenueByMonth && revenueStats.revenueByMonth.length > 0 ? (
                <div className="space-y-4">
                  {revenueStats.revenueByMonth.map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="font-medium">{month.month}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${month.revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {month.paymentCount} payments
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No revenue data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Revenue by Event */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Event</CardTitle>
              <CardDescription>
                Earnings distribution across your events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {revenueStats?.revenueByEvent && revenueStats.revenueByEvent.length > 0 ? (
                <div className="space-y-4">
                  {revenueStats.revenueByEvent
                    .filter(event => event.totalRevenue > 0)
                    .map((event, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{event.eventTitle}</div>
                          <div className="text-sm text-muted-foreground">
                            {event.paymentCount} payments • {event.completedPayments} completed
                          </div>
                        </div>
                        <div className="font-bold">${event.totalRevenue.toLocaleString()}</div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No event revenue data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="mt-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search payments by user, event, or transaction ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-45">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="succeeded">Succeeded</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-45">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fetchPayments(1)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payments Table - FIXED: Safe property access */}
          {filteredPayments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Payments Found</h3>
                <p className="text-muted-foreground mb-4">
                  {payments.length === 0 
                    ? "You don't have any payments yet. Payments will appear here when users join your paid events."
                    : "No payments match your current filters"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50 dark:bg-gray-900">
                        <th className="text-left py-3 px-4 font-medium">Payment</th>
                        <th className="text-left py-3 px-4 font-medium">Event</th>
                        <th className="text-left py-3 px-4 font-medium">User</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">#{payment.id.slice(0, 8)}</div>
                              <div className="flex items-center gap-2 mt-1">
                                {getPaymentMethodBadge(payment)}
                                {payment.transactionId && (
                                  <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                                    {payment.transactionId}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{payment.event?.title || 'Unknown Event'}</div>
                              <div className="text-sm text-muted-foreground">
                                {payment.event?.date ? format(new Date(payment.event.date), "MMM d, yyyy") : 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={payment.user?.avatarUrl || ""} />
                                <AvatarFallback>
                                  {payment.user?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{payment.user?.name || 'Unknown User'}</div>
                                <div className="text-sm text-muted-foreground">
                                  {payment.user?.email || 'No email'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              {format(new Date(payment.createdAt), "MMM d, yyyy")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(payment.createdAt), "h:mm a")}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold">
                              ${payment.amount.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {payment.currency.toUpperCase()}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" asChild>
                                <Link href={`/host/dashboard/events/${payment.event?.id}/participants`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => window.location.href = `mailto:${payment.user?.email}`}
                                disabled={!payment.user?.email}
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
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(payment.id, "completed")}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(payment.id, "succeeded")}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Succeeded
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUpdateStatus(payment.id, "pending")}>
                                    <Clock className="h-4 w-4 mr-2" />
                                    Mark as Pending
                                  </DropdownMenuItem>
                                  {payment.isRefundable && (
                                    <DropdownMenuItem className="text-red-600">
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Refund Payment
                                    </DropdownMenuItem>
                                  )}
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} payments
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchPayments(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchPayments(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

    
<TabsContent value="analytics" className="mt-6">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Payment Status Distribution */}
    <Card>
      <CardHeader>
        <CardTitle>Payment Status</CardTitle>
        <CardDescription>
          Distribution of payments by status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {paymentStats?.statusCounts ? (
          <div className="space-y-4">
            {Object.entries(paymentStats.statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: 
                        status === 'completed' || status === 'succeeded' ? '#10b981' :
                        status === 'pending' ? '#f59e0b' :
                        status === 'failed' ? '#ef4444' : '#6b7280'
                    }}
                  />
                  <span className="capitalize">{PAYMENT_STATUS_LABELS[status as keyof typeof PAYMENT_STATUS_LABELS] || status}</span>
                </div>
                <div className="font-bold">{count}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No status data available
          </div>
        )}
      </CardContent>
    </Card>

    {/* Revenue by Event Type - FIXED: Using revenueByEventType from PaymentStats type */}
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Event Type</CardTitle>
        <CardDescription>
          Earnings by event category
        </CardDescription>
      </CardHeader>
      <CardContent>
        {paymentStats?.revenueByEventType ? (
          <div className="space-y-4">
            {Object.entries(paymentStats.revenueByEventType).map(([eventType, revenue]) => (
              <div key={eventType} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: '#6366f1'
                    }}
                  />
                  <span className="capitalize">
                    {eventType.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <div className="font-bold">${revenue?.toLocaleString() || 0}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No event type revenue data available
          </div>
        )}
      </CardContent>
    </Card>

    {/* Revenue by Status */}
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Status</CardTitle>
        <CardDescription>
          Amount earned by payment status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {paymentStats?.revenueByStatus ? (
          <div className="space-y-4">
            {Object.entries(paymentStats.revenueByStatus).map(([status, revenue]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: 
                        status === 'completed' || status === 'succeeded' ? '#10b981' :
                        status === 'pending' ? '#f59e0b' :
                        status === 'failed' ? '#ef4444' : '#6b7280'
                    }}
                  />
                  <span className="capitalize">{PAYMENT_STATUS_LABELS[status as keyof typeof PAYMENT_STATUS_LABELS] || status}</span>
                </div>
                <div className="font-bold">${revenue?.toLocaleString() || 0}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No revenue by status data available
          </div>
        )}
      </CardContent>
    </Card>

    {/* Average Transaction Value */}
    <Card>
      <CardHeader>
        <CardTitle>Transaction Statistics</CardTitle>
        <CardDescription>
          Statistics about your payment values
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Total Payments</span>
            <div className="font-bold">
              {paymentStats?.totalPayments || 0}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Average Payment</span>
            <div className="font-bold">
              ${paymentStats?.averagePaymentAmount?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Today's Revenue</span>
            <div className="font-bold">
              ${paymentStats?.todayRevenue?.toLocaleString() || '0.00'}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>This Month's Revenue</span>
            <div className="font-bold">
              ${paymentStats?.monthRevenue?.toLocaleString() || '0.00'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Quick Actions */}
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks and operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Generate Monthly Report
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Revenue Forecast
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Users className="h-4 w-4 mr-2" />
            Top Paying Users
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming Payouts
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</TabsContent>
      </Tabs>
    </div>
  );
};

export default RevenuePaymentsPage;