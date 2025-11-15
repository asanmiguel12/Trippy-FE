import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '../types/api';

// Generic API hook state
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

// Generic API hook return type
interface ApiHookReturn<T> extends ApiState<T> {
  refetch: () => void;
  reset: () => void;
}

// Generic API hook
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  immediate: boolean = true
): ApiHookReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const executeApiCall = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall();
      setState({
        data: result,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as ApiError,
      });
    }
  }, dependencies);

  const refetch = useCallback(() => {
    executeApiCall();
  }, [executeApiCall]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      executeApiCall();
    }
  }, [executeApiCall, immediate]);

  return {
    ...state,
    refetch,
    reset,
  };
}

// Mutation hook for POST/PUT/DELETE operations
interface MutationState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface MutationReturn<T, TVariables> extends MutationState<T> {
  mutate: (variables: TVariables) => Promise<T>;
  reset: () => void;
}

export function useMutation<T, TVariables>(
  apiCall: (variables: TVariables) => Promise<T>
): MutationReturn<T, TVariables> {
  const [state, setState] = useState<MutationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (variables: TVariables): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall(variables);
      setState({
        data: result,
        loading: false,
        error: null,
      });
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      setState({
        data: null,
        loading: false,
        error: apiError,
      });
      throw apiError;
    }
  }, [apiCall]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}
