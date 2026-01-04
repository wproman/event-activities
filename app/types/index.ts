// User Roles - Match your Prisma Role enum
export type UserRole = 'USER' | 'HOST' | 'ADMIN'

// Event Types - Match your Prisma EventType enum
export type EventType = 
  | 'CONCERT'
  | 'HIKE' 
  | 'DINNER'
  | 'GAME_NIGHT'
  | 'MEETUP'
  | 'SPORT'
  | 'ART'
  | 'OTHER'

// Event Status - Match your Prisma EventStatus enum
export type EventStatus = 'PENDING' | 'OPEN' | 'FULL' | 'CANCELLED' | 'COMPLETED' | 'REJECTED'

// User Status - Match your Prisma UserStatus enum
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED'

// Payment Status - Based on your schema
export type PaymentStatus = 'pending' | 'completed' | 'failed'

// User Interface - Match your Prisma User model
export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  bio?: string
  avatarUrl?: string
  interests: string[]
  city?: string
  ratingAvg: number
  ratingCount: number
  status: UserStatus
  needPasswordChange: boolean
  createdAt: Date
  updatedAt: Date
  
  // Optional relations
  writtenReviews?: Review[]
  receivedReviews?: Review[]
  eventsHosted?: Event[]
}

// Event Interface - Match your Prisma Event model
export interface Event {
  id: string
  title: string
  description?: string
  date: Date
  location: string
  category?: string
  imageUrl?: string
  fee: number  // Decimal in Prisma, number in TypeScript
  isPaidEvent: boolean
  eventType: EventType
  status: string  // Your schema uses string for now
  isApproved: boolean
  hostId: string
  maxParticipants?: number
  host?: User
  createdAt: Date
  updatedAt: Date
  
  // Optional relations
  participants?: EventParticipant[]
  payments?: Payment[]
  _count?: {
    participants: number
  }
}

// Review Interface - Match your Prisma Review model
export interface Review {
  id: string
  rating: number
  comment?: string
  reviewerId: string
  reviewer: User
  recipientId: string
  recipient: User
  createdAt: Date
}

// Event Participant Interface - Match your Prisma EventParticipant model
export interface EventParticipant {
  id: string
  eventId: string
  userId: string
  event: Event
  user: User
  createdAt: Date
}

// Payment Interface - Match your Prisma Payment model
export interface Payment {
  id: string
  userId: string
  eventId: string
  amount: number  // Decimal in Prisma, number in TypeScript
  currency: string
  status: PaymentStatus
  stripePaymentIntentId?: string
  transactionId?: string
  user: User
  event: Event
  createdAt: Date
  updatedAt: Date
}

// Event Type Labels
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  CONCERT: 'Concert',
  HIKE: 'Hiking',
  DINNER: 'Dinner',
  GAME_NIGHT: 'Game Night',
  MEETUP: 'Meetup',
  SPORT: 'Sport',
  ART: 'Art',
  OTHER: 'Other',
}

// Event Status Labels
export const EVENT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  OPEN: 'Open',
  FULL: 'Full',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
  APPROVED: 'Approved' // Added for your API response
}

// User Status Labels
export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  BLOCKED: 'Blocked',
}

// User Role Labels
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  USER: 'User',
  HOST: 'Host',
  ADMIN: 'Admin',
}

// All Event Types Array
export const ALL_EVENT_TYPES: EventType[] = [
  'CONCERT',
  'HIKE',
  'DINNER',
  'GAME_NIGHT',
  'MEETUP',
  'SPORT',
  'ART',
  'OTHER',
]

// All User Roles Array
export const ALL_USER_ROLES: UserRole[] = ['USER', 'HOST', 'ADMIN']

// All User Statuses Array
export const ALL_USER_STATUSES: UserStatus[] = ['ACTIVE', 'INACTIVE', 'BLOCKED']

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
  isPaid: boolean | null
}