// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Destination Types
export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  isFavorite?: boolean;
}

export interface CreateDestinationRequest {
  name: string;
  country: string;
  description: string;
  price: number;
  imageUrl: string;
}

// Trip Types
export interface Trip {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  destination: Destination;
  activities: Activity[];
  totalCost: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  cost: number;
  location: string;
  type: 'attraction' | 'restaurant' | 'transport' | 'accommodation' | 'other';
}

export interface CreateTripRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  activities: Omit<Activity, 'id'>[];
  isPublic: boolean;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  budget: number;
  interests: string[];
  travelStyle: 'budget' | 'luxury' | 'adventure' | 'cultural' | 'relaxation';
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}
