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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
    AlertCircle,
    BarChart3,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    Eye,
    Filter,
    MoreVertical,
    RefreshCw,
    TrendingUp,
    Users
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  eventId: string;
  eventTitle: string;
  amount: number;
  status: "completed" | "pending" | "failed" | "refunded";
  currency: string;
  stripePaymentIntentId?: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentStats {
  totalRevenue: number;
  pendingAmount: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  monthlyGrowth: number;
  averageTransaction: number;
}

const HostPaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch payment stats
        const statsResponse = await fetch("/api/host/payments/stats");
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch payments
        const paymentsResponse = await fetch("/api/host/payments");
        const paymentsData = await paymentsResponse.json();
        setPayments(paymentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const csvContent = [
        ["Date", "User", "Event", "Amount", "Status", "Transaction ID"],
        ...payments.map(p => [
          format(p.createdAt, "yyyy-MM-dd"),
          p.userName,
          p.eventTitle,
          p.amount.toString(),
          p.status,
          p.transactionId || "N/A"
        ])
      ].map(row => row.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payments_${format(new Date(), "yyyy-MM-dd")}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const paymentsResponse = await fetch("/api/host/payments");
      const paymentsData = await paymentsResponse.json();
      setPayments(paymentsData);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: { label: "Completed", variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
      pending: { label: "Pending", variant: "secondary", icon: <Clock className="h-3 w-3" /> },
      failed: { label: "Failed", variant: "destructive", icon: <AlertCircle className="h-3 w-3" /> },
      refunded: { label: "Refunded", variant: "outline", icon: <RefreshCw className="h-3 w-3" /> }
    };

    const config = variants[status] || { label: status, variant: "outline", icon: null };
    
    return (
      <Badge variant={config.variant as any} className="gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "pending": return "text-amber-600";
      case "failed": return "text-red-600";
      case "refunded": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filterStatus !== "all" && payment.status !== filterStatus) return false;
    if (selectedEvent !== "all" && payment.eventId !== selectedEvent) return false;
    return true;
  });

  const uniqueEvents = Array.from(new Set(payments.map(p => ({ id: p.eventId, title: p.eventTitle }))));

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
                <Skeleton className="h-8 w-16 mt-2" />
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
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-16 w-full mb-2" />
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
          <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage payments for your events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportCSV} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" />
            {exporting ? "Exporting..." : "Export CSV"}
          </Button>
          <Button asChild>
            <Link href="/dashboard/host/events">
              <Users className="h-4 w-4 mr-2" />
              View Events
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">${stats?.totalRevenue?.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">{stats?.monthlyGrowth}%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              This month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Amount
            </CardTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <span className="text-2xl font-bold">${stats?.pendingAmount?.toFixed(2)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {stats?.pendingPayments} pending payments
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Payments
            </CardTitle>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{stats?.completedPayments}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Avg: ${stats?.averageTransaction?.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed/Refunded
            </CardTitle>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold">{stats?.failedPayments}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Requires attention
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" onValueChange={setFilterStatus}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter by Event
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedEvent("all")}>
                  All Events
                </DropdownMenuItem>
                <Separator />
                {uniqueEvents.map(event => (
                  <DropdownMenuItem key={event.id} onClick={() => setSelectedEvent(event.id)}>
                    {event.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <PaymentsList payments={filteredPayments} />
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <PaymentsList payments={filteredPayments} />
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <PaymentsList payments={filteredPayments} />
        </TabsContent>
        <TabsContent value="failed" className="space-y-4">
          <PaymentsList payments={filteredPayments} />
        </TabsContent>
      </Tabs>

      {/* Withdrawal Section */}
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Earnings</CardTitle>
          <CardDescription>
            Transfer your earnings to your bank account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium mb-2">Available Balance</div>
              <div className="text-3xl font-bold text-green-600">
                ${((stats?.totalRevenue || 0) - (stats?.pendingAmount || 0)).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Pending: ${stats?.pendingAmount?.toFixed(2)}
              </div>
            </div>
            <div>
              <Button className="w-full" size="lg">
                <CreditCard className="h-5 w-5 mr-2" />
                Request Withdrawal
              </Button>
              <div className="text-xs text-muted-foreground mt-2 text-center">
                Processed within 3-5 business days
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Analytics</CardTitle>
              <CardDescription>
                Monthly payment trends and insights
              </CardDescription>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ${stats?.averageTransaction?.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Average Transaction</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((stats?.completedPayments || 0) / (payments.length || 1) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                ${(stats?.totalRevenue || 0) / 6}
              </div>
              <div className="text-sm text-muted-foreground">Monthly Average</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Payments List Component
const PaymentsList = ({ payments }: { payments: Payment[] }) => {
  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Payments Found</h3>
          <p className="text-muted-foreground">
            No payments match your current filters
          </p>
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
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">User</th>
                <th className="text-left py-3 px-4 font-medium">Event</th>
                <th className="text-left py-3 px-4 font-medium">Amount</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Transaction ID</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="py-3 px-4">
                    <div className="text-sm">{format(payment.createdAt, "MMM d, yyyy")}</div>
                    <div className="text-xs text-muted-foreground">{format(payment.createdAt, "h:mm a")}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{payment.userName}</div>
                    <div className="text-sm text-muted-foreground">{payment.userEmail}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{payment.eventTitle}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold">${payment.amount.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{payment.currency.toUpperCase()}</div>
                  </td>
                  {/* <td className="py-3 px-4">
                    {getStatusBadge(payment.status)}
                  </td> */}
                  <td className="py-3 px-4">
                    <div className="text-sm font-mono">
                      {payment.transactionId || payment.stripePaymentIntentId || "N/A"}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/payments/${payment.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
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
                          {payment.status === "pending" && (
                            <DropdownMenuItem>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Completed
                            </DropdownMenuItem>
                          )}
                          {payment.status === "completed" && (
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Issue Refund
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download Receipt
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

export default HostPaymentsPage;