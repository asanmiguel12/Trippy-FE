import { api } from './api';
import { Destination, CreateDestinationRequest, ApiResponse } from '../types/api';

// Mock data for development
const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Tokyo',
    country: 'Japan',
    description: 'Experience the perfect blend of traditional culture and modern innovation in Japan\'s bustling capital.',
    price: 1200,
    rating: 4.8,
    reviewCount: 2300,
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Santorini',
    country: 'Greece',
    description: 'Discover stunning sunsets, white-washed buildings, and crystal-clear waters in this Aegean paradise.',
    price: 950,
    rating: 4.9,
    reviewCount: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    isFavorite: false,
  },
  {
    id: '3',
    name: 'Bali',
    country: 'Indonesia',
    description: 'Immerse yourself in tropical paradise with pristine beaches, lush jungles, and rich cultural heritage.',
    price: 800,
    rating: 4.7,
    reviewCount: 3100,
    imageUrl: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800',
    isFavorite: false,
  },
  {
    id: '4',
    name: 'Paris',
    country: 'France',
    description: 'The City of Light offers iconic landmarks, world-class cuisine, and unparalleled romance.',
    price: 1100,
    rating: 4.6,
    reviewCount: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800',
    isFavorite: false,
  },
  {
    id: '5',
    name: 'New York',
    country: 'USA',
    description: 'The city that never sleeps with iconic skyscrapers, Broadway shows, and endless possibilities.',
    price: 1300,
    rating: 4.5,
    reviewCount: 4200,
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    isFavorite: false,
  },
  {
    id: '6',
    name: 'Sydney',
    country: 'Australia',
    description: 'Harbor views, iconic opera house, and vibrant culture in Australia\'s largest city.',
    price: 1400,
    rating: 4.4,
    reviewCount: 1900,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    isFavorite: false,
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export const destinationService = {
  // Get all destinations
  getAll: async (): Promise<ApiResponse<Destination[]>> => {
    try {
      console.log('Attempting to fetch destinations from API...');
      const result = await api.get<Destination[]>('/destinations');
      console.log('API call successful:', result);
      return result;
    } catch (error) {
      console.log('API call failed, using mock data:', error);
      // Fallback to mock data if API is not available
      await delay(500);
      return {
        data: mockDestinations,
        success: true,
        message: 'Using mock data - API not available'
      };
    }
  },

  // Get destination by ID
  getById: async (id: string): Promise<ApiResponse<Destination>> => {
    try {
      return await api.get<Destination>(`/destinations/${id}`);
    } catch (error) {
      // Fallback to mock data
      await delay(300);
      const destination = mockDestinations.find(d => d.id === id);
      if (!destination) {
        throw new Error('Destination not found');
      }
      return {
        data: destination,
        success: true,
        message: 'Using mock data - API not available'
      };
    }
  },

  // Create new destination (admin only)
  create: async (data: CreateDestinationRequest): Promise<Destination> => {
    try {
      const response = await api.post<Destination>('/destinations', data);
      return response.data;
    } catch (error) {
      // Fallback to mock creation
      await delay(500);
      const newDestination: Destination = {
        id: Date.now().toString(),
        ...data,
        rating: 4.5,
        reviewCount: 0,
        isFavorite: false,
      };
      return newDestination;
    }
  },

  // Update destination (admin only)
  update: async (id: string, data: Partial<CreateDestinationRequest>): Promise<Destination> => {
    try {
      const response = await api.put<Destination>(`/destinations/${id}`, data);
      return response.data;
    } catch (error) {
      // Fallback to mock update
      await delay(400);
      const destination = mockDestinations.find(d => d.id === id);
      if (!destination) {
        throw new Error('Destination not found');
      }
      return { ...destination, ...data };
    }
  },

  // Delete destination (admin only)
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete<void>(`/destinations/${id}`);
    } catch (error) {
      // Mock deletion
      await delay(300);
      console.log(`Mock: Deleted destination ${id}`);
    }
  },

  // Search destinations
  search: async (query: string): Promise<ApiResponse<Destination[]>> => {
    try {
      return await api.get<Destination[]>(`/destinations/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      // Fallback to mock search
      await delay(400);
      const filtered = mockDestinations.filter(d => 
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.country.toLowerCase().includes(query.toLowerCase()) ||
        d.description.toLowerCase().includes(query.toLowerCase())
      );
      return {
        data: filtered,
        success: true,
        message: 'Using mock data - API not available'
      };
    }
  },

  // Get popular destinations
  getPopular: async (limit: number = 6): Promise<ApiResponse<Destination[]>> => {
    try {
      console.log('Attempting to fetch popular destinations from API...');
      const result = await api.get<Destination[]>(`/destinations/popular?limit=${limit}`);
      console.log('Popular destinations API call successful:', result);
      return result;
    } catch (error) {
      console.log('Popular destinations API call failed, using mock data:', error);
      // Fallback to mock popular destinations (first N destinations sorted by rating)
      await delay(300);
      const popular = [...mockDestinations]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
      console.log('Returning mock popular destinations:', popular);
      return {
        data: popular,
        success: true,
        message: 'Using mock data - API not available'
      };
    }
  },

  // Toggle favorite status
  toggleFavorite: async (id: string): Promise<Destination> => {
    try {
      const response = await api.post<Destination>(`/destinations/${id}/favorite`);
      return response.data;
    } catch (error) {
      // Fallback to mock toggle
      await delay(200);
      const destination = mockDestinations.find(d => d.id === id);
      if (!destination) {
        throw new Error('Destination not found');
      }
      return { ...destination, isFavorite: !destination.isFavorite };
    }
  },
};
