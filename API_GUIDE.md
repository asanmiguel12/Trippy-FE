# API Integration Guide for Trippy Frontend

This guide explains how to make API calls to your backend in the Trippy React application.

## Quick Start

### 1. Environment Setup

Create a `.env` file in your project root:

```env
VITE_API_BASE_URL=http://localhost:5173/api
```

### 2. Basic Usage

```tsx
import { usePopularDestinations } from '../hooks/useDestinations';

function MyComponent() {
  const { data, loading, error, refetch } = usePopularDestinations(3);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data.map(destination => (
        <div key={destination.id}>{destination.name}</div>
      ))}
    </div>
  );
}
```

## Architecture Overview

### 1. API Service Layer (`src/services/`)

- **`api.ts`** - Base axios configuration with interceptors
- **`destinationService.ts`** - Destination-specific API calls
- **`tripService.ts`** - Trip-specific API calls

### 2. Type Definitions (`src/types/api.ts`)

TypeScript interfaces for all API requests and responses.

### 3. Custom Hooks (`src/hooks/`)

- **`useApi.ts`** - Generic API hooks for GET requests and mutations
- **`useDestinations.ts`** - Destination-specific hooks
- **`useTrips.ts`** - Trip-specific hooks

### 4. UI Components (`src/components/`)

- **`LoadingSpinner.tsx`** - Loading state component
- **`ErrorMessage.tsx`** - Error state component

## Available Hooks

### Destination Hooks

```tsx
// Get all destinations
const { data, loading, error, refetch } = useDestinations();

// Get popular destinations
const { data, loading, error } = usePopularDestinations(6);

// Search destinations
const { data, loading, error } = useSearchDestinations(query, enabled);

// Get single destination
const { data, loading, error } = useDestination(id, enabled);

// Create destination (mutation)
const createMutation = useCreateDestination();
await createMutation.mutate(destinationData);

// Update destination (mutation)
const updateMutation = useUpdateDestination();
await updateMutation.mutate({ id, data });

// Delete destination (mutation)
const deleteMutation = useDeleteDestination();
await deleteMutation.mutate(id);

// Toggle favorite (mutation)
const favoriteMutation = useToggleFavorite();
await favoriteMutation.mutate(location);
```

### Trip Hooks

```tsx
// Get user's trips
const { data, loading, error, refetch } = useUserTrips();

// Get single trip
const { data, loading, error } = useTrip(id, enabled);

// Get public trips
const { data, loading, error } = usePublicTrips(page, limit);

// Create trip (mutation)
const createMutation = useCreateTrip();
await createMutation.mutate(tripData);

// Update trip (mutation)
const updateMutation = useUpdateTrip();
await updateMutation.mutate({ id, data });

// Delete trip (mutation)
const deleteMutation = useDeleteTrip();
await deleteMutation.mutate(id);

// Clone trip (mutation)
const cloneMutation = useCloneTrip();
await cloneMutation.mutate(tripId);
```

## Usage Patterns

### 1. Fetching Data (GET requests)

```tsx
import { usePopularDestinations } from '../hooks/useDestinations';

function DestinationsList() {
  const { 
    data: destinationsData, 
    loading, 
    error, 
    refetch 
  } = usePopularDestinations(3);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;

  return (
    <div>
      {destinationsData?.data.map(destination => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  );
}
```

### 2. Creating Data (POST requests)

```tsx
import { useCreateDestination } from '../hooks/useDestinations';

function CreateDestinationForm() {
  const createMutation = useCreateDestination();

  const handleSubmit = async (formData) => {
    try {
      await createMutation.mutate(formData);
      // Success! Data is created
      alert('Destination created successfully!');
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to create destination:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button 
        type="submit" 
        disabled={createMutation.loading}
      >
        {createMutation.loading ? 'Creating...' : 'Create'}
      </button>
      {createMutation.error && (
        <ErrorMessage error={createMutation.error} />
      )}
    </form>
  );
}
```

### 3. Conditional Fetching

```tsx
function DestinationDetails({ location }) {
  const { data, loading, error } = useDestination(
    location, 
    !!location // Only fetch if location exists
  );

  if (!location) return <div>No destination selected</div>;
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{data?.data.name}</div>;
}
```

### 4. Search with Debouncing

```tsx
import { useState, useEffect } from 'react';
import { useSearchDestinations } from '../hooks/useDestinations';

function SearchDestinations() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);

  const { data, loading, error } = useSearchDestinations(
    debouncedQuery, 
    debouncedQuery.length > 2
  );

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search destinations..."
      />
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {data?.data.map(destination => (
        <div key={destination.id}>{destination.name}</div>
      ))}
    </div>
  );
}
```

## Direct API Calls

For cases where hooks aren't suitable, you can use the API service directly:

```tsx
import { api } from '../services/api';

// GET request
const fetchDestinations = async () => {
  try {
    const response = await api.get('/destinations');
    return response.data;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
};

// POST request
const createDestination = async (destinationData) => {
  try {
    const response = await api.post('/destinations', destinationData);
    return response.data;
  } catch (error) {
    console.error('Error creating destination:', error);
    throw error;
  }
};

// PUT request
const updateDestination = async (id, data) => {
  try {
    const response = await api.put(`/destinations/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating destination:', error);
    throw error;
  }
};

// DELETE request
const deleteDestination = async (id) => {
  try {
    const response = await api.delete(`/destinations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting destination:', error);
    throw error;
  }
};
```

## Error Handling

The API system includes comprehensive error handling:

### 1. Network Errors
- Connection timeouts
- Network connectivity issues
- Server unavailability

### 2. HTTP Status Errors
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Internal Server Error

### 3. Error Object Structure

```tsx
interface ApiError {
  message: string;        // Human-readable error message
  code: string;          // Error code or HTTP status
  details?: Record<string, any>; // Additional error details
}
```

### 4. Error Display

```tsx
import ErrorMessage from '../components/ErrorMessage';

function MyComponent() {
  const { data, loading, error, refetch } = useDestinations();

  if (error) {
    return (
      <ErrorMessage 
        error={error} 
        onRetry={refetch} // Optional retry function
      />
    );
  }

  return <div>{/* component content */}</div>;
}
```

## Authentication

The API client automatically includes authentication tokens:

```tsx
// Token is automatically added to requests
localStorage.setItem('authToken', 'your-jwt-token');

// All subsequent API calls will include:
// Authorization: Bearer your-jwt-token
```

## Environment Variables

Configure your API endpoints using environment variables:

```env
# .env
VITE_API_BASE_URL=http://localhost:5173/api
VITE_API_TIMEOUT=10000
```

## Best Practices

### 1. Use Hooks for React Components
- Prefer custom hooks over direct API calls in components
- Hooks provide loading states, error handling, and caching

### 2. Handle Loading States
- Always show loading indicators for better UX
- Use the provided `LoadingSpinner` component

### 3. Handle Errors Gracefully
- Display meaningful error messages
- Provide retry functionality when appropriate
- Use the provided `ErrorMessage` component

### 4. Optimize API Calls
- Use conditional fetching to avoid unnecessary requests
- Implement debouncing for search functionality
- Cache data when appropriate

### 5. Type Safety
- Always use TypeScript interfaces for API data
- Leverage the provided types in `src/types/api.ts`

## Example Component

See `src/components/ApiExample.tsx` for a comprehensive example demonstrating all the patterns described in this guide.

## Backend API Endpoints

The frontend expects these backend endpoints:

### Destinations
- `GET /destinations` - Get all destinations
- `GET /destinations/:id` - Get destination by ID
- `POST /destinations` - Create destination
- `PUT /destinations/:id` - Update destination
- `DELETE /destinations/:id` - Delete destination
- `GET /destinations/search?q=query` - Search destinations
- `GET /destinations/popular?limit=n` - Get popular destinations
- `POST /destinations/:id/favorite` - Toggle favorite

### Trips
- `GET /trips` - Get user's trips
- `GET /trips/:id` - Get trip by ID
- `POST /trips` - Create trip
- `PUT /trips/:id` - Update trip
- `DELETE /trips/:id` - Delete trip
- `GET /trips/public?page=n&limit=n` - Get public trips
- `POST /trips/:id/clone` - Clone trip

All endpoints should return data in this format:

```json
{
  "data": <response_data>,
  "message": "Optional success message",
  "success": true
}
```

Error responses should include:

```json
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```
