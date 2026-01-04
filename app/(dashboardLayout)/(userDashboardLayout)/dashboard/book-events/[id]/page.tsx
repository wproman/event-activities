// app/events/[id]/book/page.tsx
"use client";

import { Event } from "@/app/types";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// For Stripe payment integration (only if you need custom Stripe UI)
// You'll need to install: npm install @stripe/stripe-js @stripe/react-stripe-js
// import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import allEvents from "@/services/event/allEvent";
import createPaymentIntent from "@/services/event/createPaymentIntent";
import eventJoining from "@/services/event/eventJoining";
import userInfo from "@/services/user/userInfo";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
  const [paymentMethod, setPaymentMethod] = useState<string>("card"); // Default to card
  const [stripePaymentData, setStripePaymentData] = useState<any>(null);

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
          // Transform API data to match Event interface
          const transformedEvent: Event = {
            ...foundEvent,
            // Already parsed in allEvents service
          };
          setEvent(transformedEvent);
        } else {
          setError(`Event not found. ID: ${eventId}`);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);
const handleJoinEvent = async () => {
  if (!event || !user) {
    setError("Please log in to join this event");
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

  const handleStripePayment = (paymentData: any) => {
    // If your backend returns a PaymentIntent client secret,
    // you can redirect to Stripe Checkout or show a custom payment form

    if (paymentData.paymentIntent?.client_secret) {
      // Option 1: Redirect to Stripe Checkout
      // window.location.href = paymentData.checkoutUrl;

      // Option 2: Show custom Stripe Elements form
      setStripePaymentData(paymentData);
    }
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    router.push(`/login?redirect=/events/${eventId}/book`);
  };

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
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <title>Error Icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
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
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <title>Success Icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {event?.isPaidEvent
              ? "Payment Successful!"
              : "Successfully Joined!"}
          </h2>
          <p className="text-gray-600 mb-6">
            You have successfully{" "}
            {event?.isPaidEvent ? "paid for and joined" : "joined"} "
            {event?.title}"
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/my-events"
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

  // Check if event is already full
  const isFull =
    event.maxParticipants &&
    event._count?.participants &&
    event._count.participants >= event.maxParticipants;

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
              aria-hidden="true"
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
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-700">{error}</p>
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
                        {event.date.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-gray-600">
                        {event.date.toLocaleTimeString("en-US", {
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

                  <div>
                    <p className="text-sm text-gray-500">Hosted by</p>
                    <div className="flex items-center mt-2">
                      {event.host?.avatarUrl && (
                        <Image
                          src={event.host.avatarUrl}
                          alt={event.host.name}
                          width={40} // Add this
                          height={40} // Add this
                          className="w-10 h-10 rounded-full mr-3"
                        />
                      )}
                      <div>
                        <p className="font-medium">{event.host?.name}</p>
                        <p className="text-sm text-gray-600">Event Host</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information for paid events */}
            {event.isPaidEvent && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Payment Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Select Payment Method
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => setPaymentMethod("card")}
                        className={`p-4 border rounded-lg text-center ${
                          paymentMethod === "card"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Visa, Mastercard, etc.
                        </div>
                      </Button>

                      <Button
                        onClick={() => setPaymentMethod("wallet")}
                        className={`p-4 border rounded-lg text-center ${
                          paymentMethod === "wallet"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="font-medium">Digital Wallet</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Apple Pay, Google Pay
                        </div>
                      </Button>
                    </div>
                  </div>

                  {/* Stripe Card Element (if using custom Stripe integration)
                  {paymentMethod === 'card' && stripePaymentData && (
                    <div className="mt-4">
                      <CardElement 
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#32325d',
                            },
                          },
                        }}
                      />
                    </div>
                  )}
                  */}
                </div>
              </div>
            )}
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
                      {event.isPaidEvent ? `$${event.fee.toFixed(2)}` : "Free"}
                    </span>
                  </div>

                  {event.isPaidEvent && paymentMethod === "card" && (
                    <div className="pt-4">
                      <p className="text-sm text-gray-500 mb-2">Card Details</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>• Payment processed securely via Stripe</p>
                        <p>
                          • Your card details are never stored on our servers
                        </p>
                        <p>• 256-bit SSL encryption</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-900 font-medium">
                        Total Amount
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {event.isPaidEvent
                          ? `$${event.fee.toFixed(2)}`
                          : "Free"}
                      </span>
                    </div>

                    {(() => {
                      // Calculate isFull properly as boolean
                      const maxParticipants = event.maxParticipants ?? Infinity;
                      const currentParticipants =
                        event._count?.participants ?? 0;
                      const isFull = currentParticipants >= maxParticipants;

                      if (isFull) {
                        return (
                          <div className="text-center py-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                            Event is full
                          </div>
                        );
                      }

                      return user ? (
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
                            `Pay $${event.fee.toFixed(2)}`
                          ) : (
                            "Join Event"
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={handleLoginRedirect}
                          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Login to {event.isPaidEvent ? "Book" : "Join"}
                        </Button>
                      );
                    })()}

                    <p className="mt-4 text-xs text-gray-500 text-center">
                      {event.isPaidEvent
                        ? "Your payment is secured by Stripe [citation:6]"
                        : "No payment required for this event"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
