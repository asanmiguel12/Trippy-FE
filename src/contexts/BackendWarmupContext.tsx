import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface BackendWarmupContextType {
  isWarmingUp: boolean;
  checkCount: number;
  showWarmup: () => void;
  hideWarmup: () => void;
  incrementCheckCount: () => void;
}

const BackendWarmupContext = createContext<BackendWarmupContextType | undefined>(undefined);

export const useBackendWarmup = () => {
  const context = useContext(BackendWarmupContext);
  if (!context) {
    throw new Error('useBackendWarmup must be used within BackendWarmupProvider');
  }
  return context;
};

interface BackendWarmupProviderProps {
  children: ReactNode;
}

export const BackendWarmupProvider: React.FC<BackendWarmupProviderProps> = ({ children }) => {
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const [checkCount, setCheckCount] = useState(0);

  const showWarmup = useCallback(() => {
    setIsWarmingUp(true);
  }, []);

  const hideWarmup = useCallback(() => {
    setIsWarmingUp(false);
    setCheckCount(0);
  }, []);

  const incrementCheckCount = useCallback(() => {
    setCheckCount(prev => prev + 1);
  }, []);

  return (
    <BackendWarmupContext.Provider
      value={{
        isWarmingUp,
        checkCount,
        showWarmup,
        hideWarmup,
        incrementCheckCount,
      }}
    >
      {children}
    </BackendWarmupContext.Provider>
  );
};
