import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://trippy-be.onrender.com/api';
const BACKEND_HEALTH_URL = API_BASE_URL.replace('/api', '');

interface BackendStatus {
  isReady: boolean;
  isChecking: boolean;
  checkCount: number;
}

export const useBackendStatus = () => {
  const [status, setStatus] = useState<BackendStatus>({
    isReady: false,
    isChecking: true,
    checkCount: 0,
  });

  const checkBackend = async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

      const response = await axios.get(BACKEND_HEALTH_URL, {
        signal: controller.signal,
        timeout: 2000,
      });

      clearTimeout(timeoutId);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;
    let retryInterval: NodeJS.Timeout | null = null;

    const attemptConnection = async () => {
      if (!isMounted) return;

      setStatus(prev => ({ ...prev, isChecking: true }));
      const isReady = await checkBackend();

      if (isMounted) {
        if (isReady) {
          setStatus({
            isReady: true,
            isChecking: false,
            checkCount: status.checkCount + 1,
          });
          if (retryInterval) {
            clearInterval(retryInterval);
          }
        } else {
          setStatus(prev => ({
            ...prev,
            isReady: false,
            isChecking: false,
            checkCount: prev.checkCount + 1,
          }));

          // Retry every 5 seconds
          if (!retryInterval) {
            retryInterval = setInterval(attemptConnection, 5000);
          }
        }
      }
    };

    // Initial check
    attemptConnection();

    return () => {
      isMounted = false;
      if (retryInterval) {
        clearInterval(retryInterval);
      }
    };
  }, [status.isReady]); // Re-run when isReady changes

  return status;
};
