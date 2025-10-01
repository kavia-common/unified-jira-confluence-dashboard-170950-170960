'use client';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// PUBLIC_INTERFACE
export default function Loading({ message = 'Loading...', size = 'md', className = '' }: LoadingProps) {
  /**
   * Reusable loading component with spinner and customizable message.
   * Supports different sizes and custom styling.
   */
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="text-center">
        <svg 
          className={`animate-spin ${sizeClasses[size]} text-blue-600 mx-auto`} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {message && (
          <p className={`mt-2 text-gray-600 ${textSizeClasses[size]}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
