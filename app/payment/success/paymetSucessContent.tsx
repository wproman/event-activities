/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  Home,
  Loader2,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Inner component that uses useSearchParams
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError("No session ID found in URL");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/verify?session_id=${sessionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const result = await response.json();
        
        if (result.success) {
          setSuccess(true);
          setPaymentData(result.data);
        } else {
          setError(result.message || "Payment verification failed");
        }
      } catch (err: any) {
        console.error("Payment verification error:", err);
        setError(err.message || "Failed to verify payment. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  // Loading State
  if (loading) {
    return (
      <div className="container max-w-2xl mx-auto py-12 px-4">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
            <CardTitle className="text-2xl">Verifying Payment</CardTitle>
            <CardDescription>
              Please wait while we confirm your payment...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="container max-w-2xl mx-auto py-12 px-4">
        <Card className="border-destructive/50 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-destructive">
              Payment Verification Failed
            </CardTitle>
            <CardDescription>
              We encountered an issue verifying your payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                If this issue persists, please:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-4">
                <li>Check your internet connection</li>
                <li>Verify the payment was completed in your bank statement</li>
                <li>Contact support if the problem continues</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default" className="w-full sm:w-auto">
              <Link href="/dashboard/my-event">
                <Ticket className="mr-2 h-4 w-4" />
                View My Events
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/explore">
                <ExternalLink className="mr-2 h-4 w-4" />
                Browse Events
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full sm:w-auto">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Success State
  if (success && paymentData) {
    return (
      <div className="container max-w-2xl mx-auto py-12 px-4">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>
              Your event registration is now complete
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Event Details */}
            {paymentData?.payment?.event && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Event Details</h3>
                  <Badge variant="outline" className="text-sm">
                    Registered
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Event</p>
                    <p className="font-semibold">{paymentData.payment.event.title}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p>
                        {new Date(paymentData.payment.event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p>{paymentData.payment.event.location}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Host</p>
                    <p>{paymentData.payment.event.host?.name || "Unknown Host"}</p>
                  </div>
                </div>
              </div>
            )}
            
            <Separator />
            
            {/* Payment Details */}
            {paymentData?.payment && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Payment Details</h3>
                
                <div className="rounded-lg border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold text-lg">
                        {typeof paymentData.payment.amount === 'number' 
                          ? paymentData.payment.amount.toFixed(2)
                          : paymentData.payment.amount}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <Badge 
                      variant={paymentData.payment.status === 'succeeded' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {paymentData.payment.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Transaction Date</span>
                    <span>
                      {new Date(paymentData.payment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {paymentData.payment.transactionId && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Transaction ID</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {paymentData.payment.transactionId.slice(0, 8)}...
                      </code>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Success Message */}
            <Alert className="bg-primary/5 border-primary/20">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertTitle>Successfully Joined!</AlertTitle>
              <AlertDescription>
                You're all set! A confirmation email has been sent to your registered email address.
              </AlertDescription>
            </Alert>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default" className="w-full sm:w-auto">
              <Link href="/dashboard/my-event">
                <Ticket className="mr-2 h-4 w-4" />
                View My Events
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={`/events/${paymentData?.payment?.eventId}`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                View Event Details
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full sm:w-auto">
              <Link href="/explore">
                <ExternalLink className="mr-2 h-4 w-4" />
                Explore More Events
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Fallback for unexpected state
  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto" />
          <CardTitle className="text-2xl">Unexpected State</CardTitle>
          <CardDescription>
            Something went wrong. Please try again.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PaymentSuccessContent;