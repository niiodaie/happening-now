import React from 'react';
import { Newspaper } from 'lucide-react';

const LoadingFallback = ({ message = "Loading Happening Now..." }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <div className="relative">
            <Newspaper className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <div className="absolute inset-0 animate-pulse">
              <Newspaper className="h-16 w-16 text-blue-300 mx-auto mb-4" />
            </div>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {message}
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          We're fetching the latest news from around the world. This should only take a moment.
        </p>
        
        <div className="mt-6 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingFallback;

