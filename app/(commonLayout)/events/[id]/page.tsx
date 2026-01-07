"use client";

import { Event } from "@/app/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import allEvents from "@/services/event/allEvent";
import createPaymentIntent from "@/services/event/createPaymentIntent";
import eventJoining from "@/services/event/eventJoining";
import userInfo from "@/services/user/userInfo";
import { AlertCircle, CheckCircle, LogIn, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch event and user data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch user info
        const userData = await userInfo();
        setUser(userData);

        // Fetch all events
        const events = await allEvents();

        // Find the specific event
        const foundEvent = events.find((e: any) => e.id === eventId);

        if (foundEvent) {
          const transformedEvent: Event = {
            ...foundEvent,
          };
          setEvent(transformedEvent);
        } else {
          setError(`Event not found. ID: ${eventId}`);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        // User not logged in - that's okay
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleJoinEvent = async () => {
    if (!event) {
      setError("Event not found");
      return;
    }

    // Check if user is logged in
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setJoining(true);
    setError(null);

    try {
      console.log("Attempting to join event:", eventId);

      if (event.isPaidEvent) {
        // For paid events: Create payment intent first
        console.log("Creating payment intent for paid event...");
        const paymentResult = await createPaymentIntent(eventId);
        console.log("Payment intent result:", paymentResult);
        
        if (paymentResult.success && paymentResult.data?.paymentUrl) {
          // Redirect to Stripe Checkout
          window.location.href = paymentResult.data.paymentUrl;
          return;
        } else {
          setError(paymentResult.message || "Failed to create payment");
        }
      } else {
        // For free events: Use existing eventJoining service
        const result = await eventJoining(eventId);
        console.log("Free event join result:", result);
        
        if (result.success) {
          setSuccess(true);
          setTimeout(() => {
            router.push("/dashboard/my-events");
          }, 2000);
        } else {
          setError(result.message || "Failed to join event");
        }
      }
    } catch (err: any) {
      console.error("Join error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setJoining(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push(`/login?redirect=/events/${eventId}/book`);
  };

  const handleRegisterRedirect = () => {
    router.push(`/register?redirect=/events/${eventId}/book`);
  };

  // Calculate if event is full
  const isFull = event?.maxParticipants && event._count?.participants &&
    event._count.participants >= event.maxParticipants;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/explore"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {event?.isPaidEvent ? "Payment Successful!" : "Successfully Joined!"}
          </h2>
          <p className="text-gray-600 mb-6">
            You have successfully{" "}
            {event?.isPaidEvent ? "paid for and joined" : "joined"} "
            {event?.title}"
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/dashboard/my-events"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View My Events
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Browse More Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href={`/events/${eventId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Event
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {event.isPaidEvent ? "Book Event" : "Join Event"}
          </h1>
          <p className="mt-2 text-gray-600">
            {event.isPaidEvent ? "Complete your booking for" : "Join"} "
            {event.title}"
          </p>
        </div>

        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Login Required Banner for Non-Logged Users */}
        {!user && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <LogIn className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">Login Required</h3>
                <p className="text-blue-700 text-sm">
                  You need to login or create an account to join this event.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Event Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Event Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{event.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-medium">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-gray-600">
                        {new Date(event.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{event.location}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Event Type</p>
                      <p className="font-medium">{event.eventType}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Current Participants
                      </p>
                      <p className="font-medium">
                        {event._count?.participants || 0} /{" "}
                        {event.maxParticipants || "Unlimited"}
                      </p>
                    </div>
                  </div>

                  {event.host && (
                    <div>
                      <p className="text-sm text-gray-500">Hosted by</p>
                      <div className="flex items-center mt-2">
                        {event.host.avatarUrl && (
                          <Image
                            src={event.host.avatarUrl}
                            alt={event.host.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                        )}
                        <div>
                          <p className="font-medium">{event.host.name}</p>
                          <p className="text-sm text-gray-600">Event Host</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Booking Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Event Fee</span>
                    <span className="text-lg font-semibold">
                      {event.isPaidEvent ? `$${parseFloat(event.fee.toString()).toFixed(2)}` : "Free"}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-900 font-medium">
                        Total Amount
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {event.isPaidEvent
                          ? `$${parseFloat(event.fee.toString()).toFixed(2)}`
                          : "Free"}
                      </span>
                    </div>

                    {isFull ? (
                      <div className="text-center py-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                        Event is full
                      </div>
                    ) : user ? (
                      <Button
                        onClick={handleJoinEvent}
                        disabled={joining}
                        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        {joining ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Processing...
                          </>
                        ) : event.isPaidEvent ? (
                          `Pay $${parseFloat(event.fee.toString()).toFixed(2)}`
                        ) : (
                          "Join Event"
                        )}
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          onClick={handleLoginRedirect}
                          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <LogIn className="w-4 h-4" />
                          Login to {event.isPaidEvent ? "Book" : "Join"}
                        </Button>
                        <Button
                          onClick={handleRegisterRedirect}
                          variant="outline"
                          className="w-full py-3 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          Create Account
                        </Button>
                      </div>
                    )}

                    <p className="mt-4 text-xs text-gray-500 text-center">
                      {event.isPaidEvent
                        ? "Your payment is secured by Stripe"
                        : "No payment required for this event"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to login to join this event. If you don&apos;t have an account, you can create one.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-sm text-gray-600">
              <p>To join &quot;{event?.title}&quot;, you need to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Login to your existing account, or</li>
                <li>Create a new account if you&apos;re new here</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleLoginRedirect}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </Button>
              <Button
                onClick={handleRegisterRedirect}
                variant="outline"
                className="w-full py-3 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Create New Account
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowLoginModal(false)}
                className="w-full text-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}