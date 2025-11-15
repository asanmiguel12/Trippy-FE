import { api } from './api';
import { Trip, CreateTripRequest, ApiResponse } from '../types/api';

// Mock data for development
const mockTrips: Trip[] = [
  {
    id: '1',
    name: 'Tokyo Adventure',
    description: 'A week-long exploration of Tokyo\'s best attractions, food, and culture.',
    startDate: '2024-06-15',
    endDate: '2024-06-22',
    destination: {
      id: '1',
      name: 'Tokyo',
      country: 'Japan',
      description: 'Experience the perfect blend of traditional culture and modern innovation.',
      price: 1200,
      rating: 4.8,
      reviewCount: 2300,
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      isFavorite: false,
    },
    activities: [
      {
        id: '1',
        name: 'Visit Senso-ji Temple',
        description: 'Explore Tokyo\'s oldest temple',
        startTime: '09:00',
        endTime: '11:00',
        cost: 0,
        location: 'Asakusa',
        type: 'attraction',
      },
      {
        id: '2',
        name: 'Lunch at Tsukiji Market',
        description: 'Fresh sushi and local delicacies',
        startTime: '12:00',
        endTime: '14:00',
        cost: 50,
        location: 'Tsukiji',
        type: 'restaurant',
      },
    ],
    totalCost: 1800,
    isPublic: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const tripService = {
  // Get user's trips
  getUserTrips: async (): Promise<ApiResponse<Trip[]>> => {
    try {
      return await api.get<Trip[]>('/trips');
    } catch (error) {
      // Fallback to mock data
      await delay(400);
      return {
        data: mockTrips,
        success: true,
        message: 'Using mock data - API not available'
      };
    }
  },

  // Get trip by ID
  getById: async (id: string): Promise<ApiResponse<Trip>> => {
    try {
      return await api.get<Trip>(`/trips/${id}`);
    } catch (error) {
      // Fallback to mock data
      await delay(300);
      const trip = mockTrips.find(t => t.id === id);
      if (!trip) {
        throw new Error('Trip not found');
      }
      return {
        data: trip,
        success: true,
        message: 'Using mock data - API not available'
      };
    }
  },

  // Create new trip
  create: async (data: CreateTripRequest): Promise<Trip> => {
    try {
      const response = await api.post<Trip>('/trips', data);
      return response.data;
    } catch (error) {
      // Fallback to mock creation
      await delay(500);
      const newTrip: Trip = {
        id: Date.now().toString(),
        ...data,
        destination: {
          id: data.location,
          name: 'Unknown Destination',
          country: 'Unknown',
          description: 'Destination details not available',
          price: 0,
          rating: 4.0,
          reviewCount: 0,
          imageUrl: '',
          isFavorite: false,
        },
        activities: data.activities.map((activity, index) => ({
          ...activity,
          id: `${Date.now()}-${index}`,
        })),
        totalCost: data.activities.reduce((sum, activity) => sum + activity.cost, 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: ''
      };
      return newTrip;
    }
  },

  // Update trip
  update: async (id: string, data: Partial<CreateTripRequest>): Promise<Trip> => {
    try {
      const response = await api.put<Trip>(`/trips/${id}`, data);
      return response.data;
    } catch (error) {
      // Fallback to mock update
      await delay(400);
      const trip = mockTrips.find(t => t.id === id);
      if (!trip) {
        throw new Error('Trip not found');
      }
      const updatedTrip = {
        ...trip,
        name: data.title ?? trip.name,
        description: data.description ?? trip.description,
        startDate: data.startDate ?? trip.startDate,
        endDate: data.endDate ?? trip.endDate,
        isPublic: data.isPublic ?? trip.isPublic,
        updatedAt: new Date().toISOString(),
      };
      return updatedTrip;
    }
  },

  // Delete trip
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete<void>(`/trips/${id}`);
    } catch (error) {
      // Mock deletion
      await delay(300);
      console.log(`Mock: Deleted trip ${id}`);
    }
  },

  // Get public trips
  getPublicTrips: async (page: number = 1, limit: number = 10): Promise<ApiResponse<Trip[]>> => {
    try {
      return await api.get<Trip[]>(`/trips/public?page=${page}&limit=${limit}`);
    } catch (error) {
      // Fallback to mock public trips
      await delay(400);
      const publicTrips = mockTrips.filter(trip => trip.isPublic);
      return {
        data: publicTrips,
        success: true,
        message: 'Using mock data - API not available'
      };
    }
  },

  // Clone a public trip
  cloneTrip: async (tripId: string): Promise<Trip> => {
    try {
      const response = await api.post<Trip>(`/trips/${tripId}/clone`);
      return response.data;
    } catch (error) {
      // Fallback to mock clone
      await delay(400);
      const originalTrip = mockTrips.find(t => t.id === tripId);
      if (!originalTrip) {
        throw new Error('Trip not found');
      }
      const clonedTrip: Trip = {
        ...originalTrip,
        id: Date.now().toString(),
        name: `${originalTrip.name} (Copy)`,
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return clonedTrip;
    }
  },
};
