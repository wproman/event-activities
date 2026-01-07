
export interface Category {

  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category[];
}

// If your API returns different structure, adjust accordingly
export interface SingleCategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string | Date;
  location: string;
  category?: Category | null; // Now it's a full Category object, not just string
  categoryId?: string;
  imageUrl?: string | null;
  fee: string;
  isPaidEvent: boolean;
  eventType: string;
  status: string;
  hostId: string;
  maxParticipants?: number | null;
  createdAt: string;
  updatedAt: string;
  host: "HOST";
  _count: {
    participants: number;
  };
}

export interface EventParticipant {
  id: string;
  userId: string;
  eventId: string;  // Add this
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    city?: string;
    interests: string[];
    ratingAvg?: number;
  };
  // Remove this nested event object:
  // event: {
  //   id: string;
  //   title: string;
  //   date: Date;
  //   location: string;
  //   fee: number;
  //   maxParticipants?: number;
  // };
  createdAt: Date;  // Changed from joinedAt
  status: string;
  payment?: {  // Changed from paymentStatus
    id: string;
    status: string;
    amount: number;
    transactionId?: string;
  };
}