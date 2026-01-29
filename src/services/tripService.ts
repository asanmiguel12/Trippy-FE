import { api } from './api';
import { Trip, CreateTripRequest, ApiResponse } from '../types/api';

// Mock data for development
const mockTrips: Trip[] = [
  {
    id: '1',
    name: '(Sample) Tokyo Adventure',
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

  // ───────────────────────────────
  {
    id: '2',
    name: '(Sample) Santorini Getaway',
    description: 'Relaxing island escape with sunsets, beaches, and Greek cuisine.',
    startDate: '2024-08-05',
    endDate: '2024-08-12',
    destination: {
      id: '2',
      name: 'Santorini',
      country: 'Greece',
      description: 'Whitewashed villages, blue domes, and stunning sunsets.',
      price: 1500,
      rating: 4.7,
      reviewCount: 1800,
      imageUrl: 'https://images.unsplash.com/photo-1505731132164-cca903c93345?w=800',
      isFavorite: false,
    },
    activities: [
      {
        id: '3',
        name: 'Sunset in Oia',
        description: 'Watch the famous Santorini sunset',
        startTime: '18:30',
        endTime: '20:00',
        cost: 0,
        location: 'Oia',
        type: 'attraction',
      },
      {
        id: '4',
        name: 'Boat Tour',
        description: 'Sail around the caldera and hot springs',
        startTime: '10:00',
        endTime: '15:00',
        cost: 120,
        location: 'Caldera',
        type: 'transport',
      },
    ],
    totalCost: 2100,
    isPublic: true,
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-02-10T09:00:00Z',
  },

  // ───────────────────────────────
  {
    id: '3',
    name: '(Sample) Bali Wellness Retreat',
    description: 'A peaceful retreat focused on yoga, nature, and relaxation.',
    startDate: '2024-09-01',
    endDate: '2024-09-10',
    destination: {
      id: '3',
      name: 'Bali',
      country: 'Indonesia',
      description: 'Tropical paradise known for temples and lush landscapes.',
      price: 1000,
      rating: 4.9,
      reviewCount: 3200,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      isFavorite: true,
    },
    activities: [
      {
        id: '5',
        name: 'Morning Yoga',
        description: 'Daily guided yoga sessions',
        startTime: '07:00',
        endTime: '08:30',
        cost: 20,
        location: 'Ubud',
        type: 'other',
      },
      {
        id: '6',
        name: 'Rice Terrace Walk',
        description: 'Explore Tegallalang rice terraces',
        startTime: '16:00',
        endTime: '18:00',
        cost: 0,
        location: 'Tegallalang',
        type: 'attraction',
      },
    ],
    totalCost: 1700,
    isPublic: false,
    createdAt: '2024-03-05T12:00:00Z',
    updatedAt: '2024-03-05T12:00:00Z',
  },

  // ───────────────────────────────
  {
    id: '4',
    name: '(Sample) New York City Weekend',
    description: 'Fast-paced city break packed with sights, shows, and food.',
    startDate: '2024-11-15',
    endDate: '2024-11-18',
    destination: {
      id: '4',
      name: 'New York City',
      country: 'USA',
      description: 'The city that never sleeps.',
      price: 900,
      rating: 4.6,
      reviewCount: 5400,
      imageUrl: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800',
      isFavorite: false,
    },
    activities: [
      {
        id: '7',
        name: 'Broadway Show',
        description: 'Watch a live Broadway performance',
        startTime: '19:00',
        endTime: '22:00',
        cost: 150,
        location: 'Manhattan',
        type: 'attraction',
      },
      {
        id: '8',
        name: 'Central Park Walk',
        description: 'Explore Central Park on foot',
        startTime: '10:00',
        endTime: '12:00',
        cost: 0,
        location: 'Central Park',
        type: 'attraction',
      },
    ],
    totalCost: 1300,
    isPublic: true,
    createdAt: '2024-04-01T08:30:00Z',
    updatedAt: '2024-04-01T08:30:00Z',
  },
];


// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const tripService = {
  // Get user's trips
  getUserTrips: async (): Promise<ApiResponse<Trip[]>> => {
    const token = sessionStorage.getItem('access_token');
  
    // 👇 NOT LOGGED IN → return mock data immediately
    if (!token) {
      await delay(300);
      return {
        data: mockTrips,
        success: true,
        message: 'Mock trips (user not logged in)'
      };
    }
  
    // 👇 LOGGED IN → call real API
    try {
      return await api.get<Trip[]>('/trips');
    } catch (error) {
      console.error('API error, falling back to mock trips', error);
      await delay(400);
      return {
        data: mockTrips,
        success: true,
        message: 'Mock trips (API unavailable)'
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
        name: data.name ?? trip.name,
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
