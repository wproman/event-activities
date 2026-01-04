"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { AlertCircle, ExternalLink, Home, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <Card className="border-yellow-200 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
          <CardDescription>
            No charges were made to your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert variant="default" className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Payment Not Completed</AlertTitle>
            <AlertDescription className="text-yellow-700">
              You cancelled the payment process. Your event registration is not complete.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You can:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-4">
              <li>Return to the event to try again</li>
              <li>Browse other available events</li>
              <li>Contact support if you need assistance</li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          <Button asChild variant="default" className="w-full">
            <Link href="/explore">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Browse Events
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard">
              <ExternalLink className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
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