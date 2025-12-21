import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, ApiError } from '../types/api';

// API Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://trippy-be.onrender.com/api';
const API_TIMEOUT = 2000; // 2 seconds

// Check if we're in production (not localhost)
const isProduction = () => {
  const baseUrl = API_BASE_URL.toLowerCase();
  return !baseUrl.includes('localhost') && !baseUrl.includes('127.0.0.1');
};

// Global warmup handlers
let warmupHandlers: {
  showWarmup: () => void;
  hideWarmup: () => void;
  incrementCheckCount: () => void;
} | null = null;

export const setWarmupHandlers = (handlers: typeof warmupHandlers) => {
  warmupHandlers = handlers;
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track retry attempts per request (include data hash for POST/PUT)
const retryAttempts = new Map<string, Promise<AxiosResponse>>();

// Create a unique key for requests (include data for POST/PUT)
const getRequestKey = (config: InternalAxiosRequestConfig): string => {
  const method = config.method?.toUpperCase() || 'GET';
  const url = config.url || '';
  
  // For POST/PUT/PATCH, include a hash of the data to differentiate requests
  if (['POST', 'PUT', 'PATCH'].includes(method) && config.data) {
    const dataStr = JSON.stringify(config.data);
    // Simple hash (you could use a proper hash function)
    const dataHash = dataStr.length > 50 ? dataStr.substring(0, 50) : dataStr;
    return `${method}-${url}-${dataHash}`;
  }
  
  return `${method}-${url}`;
};

const retryRequest = async (
  config: InternalAxiosRequestConfig,
  retryCount: number = 0,
  maxRetries: number = 10
): Promise<AxiosResponse> => {
  if (retryCount >= maxRetries) {
    throw new Error('Max retries reached');
  }

  // Wait 5 seconds before retry
  await new Promise(resolve => setTimeout(resolve, 5000));

  try {
    warmupHandlers?.incrementCheckCount();
    return await axios.request(config);
  } catch (error) {
    if (retryCount < maxRetries - 1) {
      return retryRequest(config, retryCount + 1, maxRetries);
    }
    throw error;
  }
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with warmup detection
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Backend is ready, hide warmup screen
    if (isProduction()) {
      warmupHandlers?.hideWarmup();
    }
    return response;
  },
  async (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message || 'An unexpected error occurred',
      code: error.code || 'UNKNOWN_ERROR',
    };

    if (error.response) {
      // Server responded - hide warmup
      if (isProduction()) {
        warmupHandlers?.hideWarmup();
      }
      const responseData = error.response.data as any;
      apiError.message = responseData?.message || error.message;
      apiError.code = error.response.status.toString();
      apiError.details = responseData;
    } else if (error.request) {
      // No response received (timeout/network error)
      if (isProduction()) {
        const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');
        const isNetworkError = error.code === 'ERR_NETWORK';
        
        if (isTimeout || isNetworkError) {
          const config = error.config as InternalAxiosRequestConfig;
          const requestKey = getRequestKey(config);
          
          // Show warmup
          warmupHandlers?.showWarmup();
          warmupHandlers?.incrementCheckCount();
          
          // Check if we're already retrying this exact request
          if (config && !retryAttempts.has(requestKey)) {
            // Create a retry promise and store it
            const retryPromise = retryRequest(config)
              .then((response) => {
                retryAttempts.delete(requestKey);
                warmupHandlers?.hideWarmup();
                return response;
              })
              .catch((retryError) => {
                retryAttempts.delete(requestKey);
                warmupHandlers?.hideWarmup();
                throw retryError;
              });
            
            retryAttempts.set(requestKey, retryPromise);
            return retryPromise;
          } else if (retryAttempts.has(requestKey)) {
            // If already retrying, return the existing promise
            return retryAttempts.get(requestKey)!;
          }
        }
      }
      apiError.message = 'Network error - please check your connection';
      apiError.code = 'NETWORK_ERROR';
    }

    return Promise.reject(apiError);
  }
);

// Generic API methods
export const api = {
  get: async <T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> => {
    const response = await apiClient.get(url, { params });
    return response.data;
  },

  post: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    const response = await apiClient.post(url, data);
    return response.data;
  },

  put: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    const response = await apiClient.put(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    const response = await apiClient.delete(url);
    return response.data;
  },

  patch: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    const response = await apiClient.patch(url, data);
    return response.data;
  },
};

export default apiClient;
