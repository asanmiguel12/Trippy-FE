import { useApi, useMutation } from './useApi';
import { destinationService } from '../services/destinationService';
import { Destination, CreateDestinationRequest, ApiResponse } from '../types/api';

// Hook to get all destinations
export function useDestinations() {
  return useApi<ApiResponse<Destination[]>>(
    () => destinationService.getAll(),
    [],
    true
  );
}

// Hook to get popular destinations
export function usePopularDestinations(limit: number = 6) {
  return useApi<ApiResponse<Destination[]>>(
    () => destinationService.getPopular(limit),
    [limit],
    true
  );
}

// Hook to search destinations
export function useSearchDestinations(query: string, enabled: boolean = false) {
  return useApi<ApiResponse<Destination[]>>(
    () => destinationService.search(query),
    [query],
    enabled && query.length > 0
  );
}

// Hook to get destination by ID
export function useDestination(id: string, enabled: boolean = true) {
  return useApi<ApiResponse<Destination>>(
    () => destinationService.getById(id),
    [id],
    enabled && !!id
  );
}

// Hook to create destination
export function useCreateDestination() {
  return useMutation<Destination, CreateDestinationRequest>(
    destinationService.create
  );
}

// Hook to update destination
export function useUpdateDestination() {
  return useMutation<Destination, { id: string; data: Partial<CreateDestinationRequest> }>(
    ({ id, data }) => destinationService.update(id, data)
  );
}

// Hook to delete destination
export function useDeleteDestination() {
  return useMutation<void, string>(
    destinationService.delete
  );
}

// Hook to toggle favorite
export function useToggleFavorite() {
  return useMutation<Destination, string>(
    destinationService.toggleFavorite
  );
}
