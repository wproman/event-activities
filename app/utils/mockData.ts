import { Event, EventParticipant, Payment, Review, User } from "../types/index";

// Helper functions to safely find objects
function findUser(userId: string): User {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) throw new Error(`User ${userId} not found`);
  return user;
}

function findEvent(eventId: string): Event {
  const event = mockEvents.find((e) => e.id === eventId);
  if (!event) throw new Error(`Event ${eventId} not found`);
  return event;
}

// Sample Users - Fixed to match User interface
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "USER",
    bio: "Adventure seeker and music lover. Always looking for new experiences!",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    interests: ["MUSIC", "HIKING"],
    city: "New York, NY",
    ratingAvg: 4.5,
    ratingCount: 12,
    status: "ACTIVE",
    needPasswordChange: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "user-2",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    password: "password123",
    role: "HOST",
    bio: "Sports enthusiast and casual gamer. Love meeting new people!",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    interests: ["SPORTS", "GAMING"],
    city: "Los Angeles, CA",
    ratingAvg: 4.8,
    ratingCount: 28,
    status: "ACTIVE",
    needPasswordChange: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "user-3",
    name: "Mike Johnson",
    email: "mike@example.com",
    password: "password123",
    role: "HOST",
    bio: "Art curator and concert enthusiast. Creating memorable experiences.",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    interests: ["ART", "MUSIC"],
    city: "Chicago, IL",
    ratingAvg: 4.9,
    ratingCount: 45,
    status: "ACTIVE",
    needPasswordChange: false,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "user-4",
    name: "Emily Chen",
    email: "emily@example.com",
    password: "password123",
    role: "HOST",
    bio: "Outdoor adventurer and fitness coach. Let's explore together!",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    interests: ["HIKING", "SPORTS"],
    city: "Denver, CO",
    ratingAvg: 4.7,
    ratingCount: 32,
    status: "ACTIVE",
    needPasswordChange: false,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
  },
  {
    id: "user-10",
    name: "Chris Martinez",
    email: "chris@example.com",
    password: "password123",
    role: "HOST",
    bio: "Outdoor guide and fitness instructor.",
    avatarUrl:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face",
    interests: ["HIKING", "SPORTS"],
    city: "Phoenix, AZ",
    ratingAvg: 4.9,
    ratingCount: 52,
    status: "ACTIVE",
    needPasswordChange: false,
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
];

// Sample Events - Fixed to match Event interface
export const mockEvents: Event[] = [
  {
    id: "event-1",
    title: "Summer Music Festival",
    description:
      "Join us for an amazing outdoor music festival featuring local bands and artists. Food trucks, drinks, and great vibes guaranteed!",
    date: new Date("2025-02-15T18:00:00"),
    location: "Los Angeles, CA",
    category: "CONCERT",
    imageUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop",
    fee: 25,
    isPaidEvent: true,
    eventType: "CONCERT",
    status: "OPEN",
    isApproved: true,
    hostId: "user-2",
    maxParticipants: 100,
    host: findUser("user-2"),
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "event-2",
    title: "Mountain Trail Hiking",
    description:
      "Explore beautiful mountain trails with fellow hiking enthusiasts. All skill levels welcome. Bring your own gear and snacks.",
    date: new Date("2025-02-20T07:00:00"),
    location: "Denver, CO",
    category: "HIKE",
    imageUrl:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=400&fit=crop",
    fee: 0,
    isPaidEvent: false,
    eventType: "HIKE",
    status: "OPEN",
    isApproved: true,
    hostId: "user-4",
    maxParticipants: 20,
    host: findUser("user-4"),
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "event-3",
    title: "Board Game Night",
    description:
      "Weekly board game night at the community center. We have a huge collection of games from classics to modern favorites.",
    date: new Date("2025-02-10T19:00:00"),
    location: "Chicago, IL",
    category: "GAME_NIGHT",
    imageUrl:
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&h=400&fit=crop",
    fee: 5,
    isPaidEvent: true,
    eventType: "GAME_NIGHT",
    status: "OPEN",
    isApproved: true,
    hostId: "user-3",
    maxParticipants: 16,
    host: findUser("user-3"),
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
  },
  {
    id: "event-4",
    title: "Tech Startup Meetup",
    description:
      "Network with fellow entrepreneurs and tech enthusiasts. Pitch your ideas, find co-founders, and learn from industry experts.",
    date: new Date("2025-02-25T18:30:00"),
    location: "Boston, MA",
    category: "MEETUP",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    fee: 10,
    isPaidEvent: true,
    eventType: "MEETUP",
    status: "OPEN",
    isApproved: true,
    hostId: "user-3", // Changed to existing user
    maxParticipants: 50,
    host: findUser("user-3"),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "event-5",
    title: "Desert Marathon Training",
    description:
      "Prepare for the upcoming desert marathon with group training sessions. Professional coaching and hydration stations provided.",
    date: new Date("2025-03-01T06:00:00"),
    location: "Phoenix, AZ",
    category: "SPORT",
    imageUrl:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=400&fit=crop",
    fee: 15,
    isPaidEvent: true,
    eventType: "SPORT",
    status: "FULL",
    isApproved: true,
    hostId: "user-10",
    maxParticipants: 30,
    host: findUser("user-10"),
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "event-6",
    title: "Modern Art Exhibition Tour",
    description:
      "Guided tour of the latest modern art exhibition. Includes exclusive access to artist meet-and-greet session.",
    date: new Date("2025-02-18T14:00:00"),
    location: "Chicago, IL",
    category: "ART",
    imageUrl:
      "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&h=400&fit=crop",
    fee: 20,
    isPaidEvent: true,
    eventType: "ART",
    status: "OPEN",
    isApproved: true,
    hostId: "user-3",
    maxParticipants: 25,
    host: findUser("user-3"),
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "event-7",
    title: "Beach Volleyball Tournament",
    description:
      "Friendly beach volleyball tournament for all skill levels. Teams will be formed on the spot. Prizes for winners!",
    date: new Date("2025-02-22T10:00:00"),
    location: "Los Angeles, CA",
    category: "SPORT",
    imageUrl:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=400&fit=crop",
    fee: 0,
    isPaidEvent: false,
    eventType: "SPORT",
    status: "OPEN",
    isApproved: true,
    hostId: "user-2",
    maxParticipants: 24,
    host: findUser("user-2"),
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "event-8",
    title: "Weekend Camping Trip",
    description:
      "Two-day camping adventure in the Rocky Mountains. Includes campfire cooking, stargazing, and morning yoga.",
    date: new Date("2025-03-08T08:00:00"),
    location: "Denver, CO",
    category: "HIKE",
    imageUrl:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=400&fit=crop",
    fee: 50,
    isPaidEvent: true,
    eventType: "HIKE",
    status: "OPEN",
    isApproved: true,
    hostId: "user-4",
    maxParticipants: 15,
    host: findUser("user-4"),
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: "event-9",
    title: "Cycling Club Meetup",
    description:
      "Weekly cycling meetup for enthusiasts. 30-mile route through scenic countryside. All bikes welcome.",
    date: new Date("2025-02-12T07:30:00"),
    location: "Boston, MA",
    category: "SPORT",
    imageUrl:
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&h=400&fit=crop",
    fee: 0,
    isPaidEvent: false,
    eventType: "SPORT",
    status: "OPEN",
    isApproved: true,
    hostId: "user-3",
    maxParticipants: 20,
    host: findUser("user-3"),
    createdAt: new Date("2024-01-28"),
    updatedAt: new Date("2024-01-28"),
  },
  {
    id: "event-10",
    title: "Outdoor Yoga & Picnic",
    description:
      "Relaxing yoga session followed by a community picnic. Bring your own mat and a dish to share.",
    date: new Date("2025-02-28T09:00:00"),
    location: "Phoenix, AZ",
    category: "MEETUP",
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
    fee: 5,
    isPaidEvent: true,
    eventType: "MEETUP",
    status: "OPEN",
    isApproved: true,
    hostId: "user-10",
    maxParticipants: 30,
    host: findUser("user-10"),
    createdAt: new Date("2024-01-30"),
    updatedAt: new Date("2024-01-30"),
  },
];

// Sample Payments - Fixed to match Payment interface
export const mockPayments: Payment[] = [
  {
    id: "payment-1",
    userId: "user-1",
    eventId: "event-1",
    amount: 25,
    currency: "USD",
    status: "completed",
    transactionId: "TXN-001-ABC",
    user: findUser("user-1"),
    event: findEvent("event-1"),
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "payment-2",
    userId: "user-1", // Changed to existing user
    eventId: "event-4",
    amount: 10,
    currency: "USD",
    status: "completed",
    transactionId: "TXN-002-DEF",
    user: findUser("user-1"),
    event: findEvent("event-4"),
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "payment-3",
    userId: "user-1", // Changed to existing user
    eventId: "event-8",
    amount: 50,
    currency: "USD",
    status: "pending",
    user: findUser("user-1"),
    event: findEvent("event-8"),
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
];

// Sample Reviews - Fixed to match Review interface
export const mockReviews: Review[] = [
  {
    id: "review-1",
    rating: 5,
    comment:
      "Amazing event! Sarah is an incredible host. Everything was well organized.",
    reviewerId: "user-1",
    reviewer: findUser("user-1"),
    recipientId: "user-2",
    recipient: findUser("user-2"),
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "review-2",
    rating: 4,
    comment:
      "Great hiking experience. Would recommend to anyone who loves nature.",
    reviewerId: "user-1",
    reviewer: findUser("user-1"),
    recipientId: "user-4",
    recipient: findUser("user-4"),
    createdAt: new Date("2024-01-28"),
  },
  {
    id: "review-3",
    rating: 5,
    comment: "Mike knows his art! The tour was informative and fun.",
    reviewerId: "user-1",
    reviewer: findUser("user-1"),
    recipientId: "user-3",
    recipient: findUser("user-3"),
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "review-4",
    rating: 5,
    comment: "Best camping trip ever! Chris is a fantastic guide.",
    reviewerId: "user-1",
    reviewer: findUser("user-1"),
    recipientId: "user-10",
    recipient: findUser("user-10"),
    createdAt: new Date("2024-02-05"),
  },
];

// Sample Event Participants - Fixed to match EventParticipant interface
export const mockEventParticipants: EventParticipant[] = [
  {
    id: "ep-1",
    eventId: "event-1",
    userId: "user-1",
    event: findEvent("event-1"),
    user: findUser("user-1"),
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "ep-2",
    eventId: "event-1",
    userId: "user-1",
    event: findEvent("event-1"),
    user: findUser("user-1"),
    createdAt: new Date("2024-01-21"),
  },
  {
    id: "ep-3",
    eventId: "event-2",
    userId: "user-1",
    event: findEvent("event-2"),
    user: findUser("user-1"),
    createdAt: new Date("2024-01-22"),
  },
  {
    id: "ep-4",
    eventId: "event-2",
    userId: "user-1",
    event: findEvent("event-2"),
    user: findUser("user-1"),
    createdAt: new Date("2024-01-23"),
  },
  {
    id: "ep-5",
    eventId: "event-4",
    userId: "user-1",
    event: findEvent("event-4"),
    user: findUser("user-1"),
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "ep-6",
    eventId: "event-6",
    userId: "user-1",
    event: findEvent("event-6"),
    user: findUser("user-1"),
    createdAt: new Date("2024-01-26"),
  },
  {
    id: "ep-7",
    eventId: "event-8",
    userId: "user-1",
    event: findEvent("event-8"),
    user: findUser("user-1"),
    createdAt: new Date("2024-01-27"),
  },
];

// Note: SavedEvent is not in your types, so I'm commenting it out
// You need to add SavedEvent to your types first
// export const mockSavedEvents: SavedEvent[] = [...]

// Unique Locations
export const uniqueLocations = [...new Set(mockEvents.map((e) => e.location))];

// Helper Functions
export function getEventsByHost(hostId: string): Event[] {
  return mockEvents.filter((e) => e.hostId === hostId);
}

export function getEventParticipants(eventId: string): EventParticipant[] {
  return mockEventParticipants.filter((ep) => ep.eventId === eventId);
}

// Remove or fix this when SavedEvent is added to types
// export function getSavedEventsByUser(userId: string): SavedEvent[] {
//   return mockSavedEvents.filter((se) => se.userId === userId)
// }

export function getPaymentsByHost(hostId: string): Payment[] {
  const hostEvents = mockEvents
    .filter((e) => e.hostId === hostId)
    .map((e) => e.id);
  return mockPayments.filter((p) => hostEvents.includes(p.eventId));
}

export function getReviewsByHost(hostId: string): Review[] {
  return mockReviews.filter((r) => r.recipientId === hostId);
}

export function getUserById(userId: string): User | undefined {
  return mockUsers.find((u) => u.id === userId);
}

export function getEventById(eventId: string): Event | undefined {
  return mockEvents.find((e) => e.id === eventId);
}
