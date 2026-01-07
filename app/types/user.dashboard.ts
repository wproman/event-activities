export interface UserStats {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalSpent: number;
  averageRating: number;
  reviewsGiven: number;
  achievements: number;
  favoriteEventType: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: Date;
  location: string;
  hostName: string;
  eventType: string;
  fee: number;
  status: string;
  participants: number;
  maxParticipants?: number;
}

export interface RecentActivity {
  id: string;
  type: 'join' | 'review' | 'payment' | 'achievement';
  title: string;
  description: string;
  date: Date;
  eventId?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Recommendation {
  id: string;
  title: string;
  date: Date;
  location: string;
  eventType: string;
  fee: number;
  hostRating: number;
  similarity: number;
}