import { useApi, useMutation } from './useApi';
import { tripService } from '../services/tripService';
import { Trip, CreateTripRequest, ApiResponse } from '../types/api';
import { tokenStorage } from '../auth/tokenStorage';
import { authService } from '../services/authService';

// Hook to get user's trips
export function useUserTrips() {
  return useApi<ApiResponse<Trip[]>>(
    async () => {
      const token = tokenStorage.get();

      if (!token) {
        return {
          data: [],
          success: true,
          message: 'No user logged in'
        };
      }

      const userId = await authService.getUserId(token);

      return tripService.getUserTripById(userId);
    },
    [],
    true
  );
}

// Hook to get trip by ID
export function useTrip(id: string, enabled: boolean = true) {
  return useApi<ApiResponse<Trip>>(
    () => tripService.getById(id),
    [id],
    enabled && !!id
  );
}

// Hook to get user's trip by ID
export function useUserTrip(id: string) {
  return useApi<ApiResponse<Trip>>(
    () => tripService.getById(id),
    [id],
  );
}

// Hook to get public trips
export function usePublicTrips(page: number = 1, limit: number = 10) {
  return useApi<ApiResponse<Trip[]>>(
    () => tripService.getPublicTrips(page, limit),
    [page, limit],
    true
  );
}

// Hook to create trip
export function useCreateTrip() {
  return useMutation<Trip, CreateTripRequest>(
    tripService.create
  );
}

// Hook to update trip
export function useUpdateTrip() {
  return useMutation<Trip, { id: string; data: Partial<CreateTripRequest> }>(
    ({ id, data }) => tripService.update(id, data)
  );
}

// Hook to delete trip
export function useDeleteTrip() {
  return useMutation<void, string>(
    tripService.delete
  );
}

// Hook to clone trip
export function useCloneTrip() {
  return useMutation<Trip, string>(
    tripService.cloneTrip
  );
}
