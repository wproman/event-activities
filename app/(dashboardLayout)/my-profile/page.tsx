/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";

import { EVENT_TYPE_LABELS, Event, Review, User } from "@/app/types";
import ProfileEdit from "@/components/modules/Profie/ProfileEdit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import allEvents from "@/services/event/allEvent";
import getUserEventParticipants from "@/services/eventParticipents.ts/getUserEventParticipents";
import getAllReview from "@/services/review/getAllReview";
import userInfo from "@/services/user/userInfo";
import { Calendar, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Review Card Component matching your Review interface
const ReviewCard = ({ review }: { review: Review }) => (
  
  <Card className="border-border">
    <CardContent className="pt-4">
      <div className="flex items-start gap-3">
  
        {review.reviewer?.avatarUrl && (
          <Image
            src={review.reviewer.avatarUrl}
            alt={review.reviewer.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-sm">
              {review.reviewer?.name || "Anonymous"}
            </h4>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{review.rating}.0</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
          {review.comment && (
            <p className="text-sm text-foreground">{review.comment}</p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Event Card matching your Event interface
const EventCard = ({
  event,
  showHost = true,
}: {
  event: Event;
  showHost?: boolean;
}) => (
  <Card className="hover:shadow-lg transition-shadow h-full">
    <CardContent className="p-4">
      <div className="space-y-3">
        {/* Event Image */}
        {event.imageUrl && (
          <div className="relative h-40 w-full rounded-md overflow-hidden">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
          <Badge variant="secondary">
            {EVENT_TYPE_LABELS[event.eventType] || event.eventType}
          </Badge>
        </div>

        {showHost && event.host && (
          <p className="text-sm text-muted-foreground">
            Host: {event.host.name}
          </p>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          {/* Event Status */}
          <div className="flex items-center gap-2">
            <Badge
              variant={
                event.status === "APPROVED"
                  ? "default"
                  : event.status === "PENDING"
                    ? "outline"
                    : "secondary"
              }
            >
              {event.status}
            </Badge>

            {/* Fee */}
            <Badge variant={event.isPaidEvent ? "default" : "outline"}>
              {event.isPaidEvent ? `$${event.fee}` : "Free"}
            </Badge>
          </div>

          {/* Participants count */}
          {event._count?.participants !== undefined && (
            <div className="text-xs text-muted-foreground">
              {event._count.participants} participant
              {event._count.participants !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProfilePage: React.FC = async () => {
  // Get user response
  const userResponse = await userInfo();
  const events = await allEvents();
  const eventParticipants = await getUserEventParticipants();
  const reviewsData = await getAllReview();

  // Check if user fetch was successful
  if (!userResponse.success || !userResponse.data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {userResponse.message || "Failed to load profile"}
          </h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentUser: User = userResponse.data;

  // Calculate ratings properly
  let totalRating = 0;
  let reviewCount = 0;

  if (Array.isArray(reviewsData)) {
    const hostReviews = reviewsData.filter(
      (review: Review) => review.recipientId === currentUser.id,
    );
    reviewCount = hostReviews.length;
    totalRating = hostReviews.reduce(
      (sum: number, item: Review) => sum + item.rating,
      0,
    );
  }

  const isOwnProfile = true;

  // Safely filter events
  const hostedEvents = Array.isArray(events)
    ? events.filter((e: Event) => e.hostId === currentUser.id)
    : [];

  const joinedEventIds = Array.isArray(eventParticipants)
    ? eventParticipants
        .filter((ep: any) => ep.userId === currentUser.id)
        .map((ep: any) => ep.eventId)
    : [];

  const joinedEvents = Array.isArray(events)
    ? events.filter((e: Event) => joinedEventIds.includes(e.id))
    : [];

  const reviews = Array.isArray(reviewsData)
    ? reviewsData.filter((r: Review) => r.recipientId === currentUser.id)
    : [];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="border-border mb-8 overflow-hidden">
        <div className="h-32 md:h-48 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" />
          <CardContent className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-16">
              <div className="relative">
                <Image
                  src={
                    currentUser.avatarUrl || "https://via.placeholder.com/150"
                  }
                  alt={currentUser.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-card object-cover"
                  width={128}
                  height={128}
                />
                {/* User status badge */}
                <div className="absolute bottom-0 right-0">
                  <Badge
                    variant={
                      currentUser.status === "ACTIVE"
                        ? "default"
                        : currentUser.status === "BLOCKED"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {currentUser.status}
                  </Badge>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {currentUser.name}
                  </h1>
                  <Badge
                    variant={
                      currentUser.role === "HOST"
                        ? "secondary"
                        : currentUser.role === "ADMIN"
                          ? "destructive"
                          : "default"
                    }
                  >
                    {currentUser.role}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  {currentUser.city && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{currentUser.city}</span>
                    </div>
                  )}

                  {reviewCount > 0 && currentUser.role === "HOST" && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-foreground">
                        {(totalRating / reviewCount).toFixed(1)}
                      </span>
                      <span className="text-sm">({reviewCount} reviews)</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined{" "}
                      {new Date(currentUser.createdAt).toLocaleDateString(
                        "en-US",
                        { month: "long", year: "numeric" },
                      )}
                    </span>
                  </div>
                </div>

                {/* User stats */}
                <div className="mt-3 flex gap-4 text-sm">
                  <div>
                    <span className="font-semibold">
                      {currentUser.ratingAvg.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      avg rating
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">
                      {currentUser.ratingCount}
                    </span>
                    <span className="text-muted-foreground ml-1">ratings</span>
                  </div>
                </div>
              </div>

              <ProfileEdit
                isOwnProfile={isOwnProfile}
                currentUser={currentUser}
              />
            </div>

            {currentUser.bio && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-foreground mb-1">
                  Bio
                </h3>
                <p className="text-muted-foreground">{currentUser.bio}</p>
              </div>
            )}

            {currentUser.interests && currentUser.interests.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-foreground mb-2">
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentUser.interests.map((interest: string) => (
                    <Badge key={interest} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Sections */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Hosted Events */}
            {hostedEvents.length > 0 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Hosted Events ({hostedEvents.length})</span>
                    {currentUser.role === "HOST" && (
                      <Badge variant="outline">Host</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {hostedEvents.slice(0, 4).map((event: Event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        showHost={false}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Joined Events */}
            {joinedEvents.length > 0 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Joined Events ({joinedEvents.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {joinedEvents.slice(0, 4).map((event: Event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Activity Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold">
                      {hostedEvents.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Hosted</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold">
                      {joinedEvents.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Joined</div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Average Rating
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {currentUser.ratingAvg.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Reviews</span>
                    <span className="font-semibold">
                      {currentUser.ratingCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge
                      variant={
                        currentUser.status === "ACTIVE"
                          ? "default"
                          : currentUser.status === "BLOCKED"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {currentUser.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            {reviews.length > 0 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Recent Reviews ({reviews.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.slice(0, 3).map((review: Review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </CardContent>
              </Card>
            )}

            {!isOwnProfile && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Send Message</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
