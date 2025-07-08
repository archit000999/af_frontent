
import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          {/* Animated spinner */}
          <div className="mb-8">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          </div>
          
          {/* Loading text */}
          <h2 className="text-base font-semibold text-gray-900 mb-2">
            {message}
          </h2>
          
          <p className="text-sm text-gray-600">
            Please wait while we set up your copilot...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
