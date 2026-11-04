
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Generating K-Pop Magic..." }) => {
  return (
    <div className="flex justify-center items-center my-10" role="status" aria-live="polite">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600" aria-hidden="true"></div>
      <p className="ml-4 text-lg text-purple-700 font-semibold">{message}</p>
    </div>
  );
};
