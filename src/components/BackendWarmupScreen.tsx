import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface BackendWarmupScreenProps {
  checkCount: number;
}

const BackendWarmupScreen: React.FC<BackendWarmupScreenProps> = ({ checkCount }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
      <div className="text-center px-6">
        <div className="mb-8">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Warming up the server…
        </h1>
        
        <p className="text-gray-600 mb-4">
          {checkCount > 1 
            ? `Still loading… (Attempt ${checkCount})`
            : 'Please wait while we wake up the backend server. *This may take a couple minutes.'
          }
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default BackendWarmupScreen;
