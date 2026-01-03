// User Roles
export type UserRole = 'USER' | 'ADMIN' | 'HOST'
export const eventTypes: string[] = [
  'CONCERT',
  'HIKE',
  'DINNER',
  'SPORTS',
  'WORKSHOP',
  'MEETUP',
  'BOARD_GAME_NIGHT',
  'TECH_TALK',
  'CYCLING',
  'MOVIE_NIGHT',
  'PICNIC',
  'ART_EXHIBITION',
  'MARATHON',
  'CAMPING',
  'BOOK_CLUB',
  'NETWORKING_EVENT'
];
// Event Types
export type EventType =
  | 'CONCERT'
  | 'HIKE'
  | 'DINNER'
  | 'SPORTS'
  | 'WORKSHOP'
  | 'MEETUP'
  | 'BOARD_GAME_NIGHT'
  | 'TECH_TALK'
  | 'CYCLING'
  | 'MOVIE_NIGHT'
  | 'PICNIC'
  | 'ART_EXHIBITION'
  | 'MARATHON'
  | 'CAMPING'
  | 'BOOK_CLUB'
  | 'NETWORKING_EVENT'

// Event Status
export type EventStatus = 'OPEN' | 'FULL' | 'CANCELLED' | 'COMPLETED'

// Payment Status
export type PaymentStatus = 'PAID' | 'UNPAID'

// User Interests
export type Interest = 'MUSIC' | 'HIKING' | 'SPORTS' | 'ART' | 'GAMING'

// User Interface
export interface User {
  id: string
  name: string
  email: string
  password: string
  interests: Interest[]
  image?: string
  bio?: string
  location?: string
  role: UserRole
  isBlocked: boolean
  createdAt: Date
  updatedAt: Date
  rating?: number
  reviewCount?: number
}

// Event Interface
export interface Event {
  id: string
  hostId: string
  host?: User
  name: string
  description?: string
  eventType: EventType
  dateTime: Date
  location: string
  minParticipants: number
  maxParticipants: number
  currentParticipants: number
  image: string
  joiningFee: number
  status: EventStatus
  isFeatured: boolean
  isApproved: boolean
  createdAt: Date
  updatedAt: Date
}

// Payment Interface
export interface Payment {
  id: string
  amount: number
  paymentStatus: PaymentStatus
  transactionId?: string
  userId: string
  user?: User
  eventId: string
  event?: Event
  createdAt: Date
  updatedAt: Date
}

// Review Interface
export interface Review {
  id: string
  rating: number
  comment?: string
  reviewerId: string
  reviewer?: User
  hostId: string
  host?: User
  eventId: string
  event?: Event
  createdAt: Date
  updatedAt: Date
}

// Event Participants Interface
export interface EventParticipant {
  id: string
  eventId: string
  event?: Event
  userId: string
  user?: User
  createdAt: Date


}

// Saved Event Interface
export interface SavedEvent {
  id: string
  eventId: string
  event?: Event
  userId: string
  user?: User
  createdAt: Date
}

// Auth Context Type
export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

// Filter State
export interface EventFilters {
  search: string
  eventType: EventType | ''
  location: string
  date: string
  isFeatured: boolean
  timeFilter: 'upcoming' | 'past' | 'all'
}

// Event Type Labels
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  CONCERT: 'Concert',
  HIKE: 'Hiking',
  DINNER: 'Dinner',
  SPORTS: 'Sports',
  WORKSHOP: 'Workshop',
  MEETUP: 'Meetup',
  BOARD_GAME_NIGHT: 'Board Game Night',
  TECH_TALK: 'Tech Talk',
  CYCLING: 'Cycling',
  MOVIE_NIGHT: 'Movie Night',
  PICNIC: 'Picnic',
  ART_EXHIBITION: 'Art Exhibition',
  MARATHON: 'Marathon',
  CAMPING: 'Camping',
  BOOK_CLUB: 'Book Club',
  NETWORKING_EVENT: 'Networking Event',
}


// Event Status Labels
export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  OPEN: 'Open',
  FULL: 'Full',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
}

// Interest Labels
export const INTEREST_LABELS: Record<Interest, string> = {
  MUSIC: 'Music',
  HIKING: 'Hiking',
  SPORTS: 'Sports',
  ART: 'Art',
  GAMING: 'Gaming',
}

// All Event Types Array
export const ALL_EVENT_TYPES: EventType[] = [
  'CONCERT',
  'HIKE',
  'DINNER',
  'SPORTS',
  'WORKSHOP',
  'MEETUP',
  'BOARD_GAME_NIGHT',
  'TECH_TALK',
  'CYCLING',
  'MOVIE_NIGHT',
  'PICNIC',
  'ART_EXHIBITION',
  'MARATHON',
  'CAMPING',
  'BOOK_CLUB',
  'NETWORKING_EVENT',
]

// All Interests Array
export const ALL_INTERESTS: Interest[] = [
  'MUSIC',
  'HIKING',
  'SPORTS',
  'ART',
  'GAMING',
]