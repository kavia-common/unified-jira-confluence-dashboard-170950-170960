'use client';

import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

// PUBLIC_INTERFACE
export function Notifications() {
  /**
   * Global notification component that displays app-wide notifications.
   * Automatically removes notifications after their duration expires.
   */
  
  const { state, removeNotification } = useApp();

  // Auto-remove notifications after their duration
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    state.ui.notifications.forEach((notification) => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [state.ui.notifications, removeNotification]);

  if (state.ui.notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {state.ui.notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            max-w-sm rounded-lg border p-4 shadow-lg transition-all duration-300
            ${getNotificationStyles(notification.type)}
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">
                {notification.title}
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Close notification"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function getNotificationStyles(type: 'success' | 'error' | 'warning' | 'info'): string {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200';
    case 'error':
      return 'bg-red-50 border-red-200';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200';
    case 'info':
      return 'bg-blue-50 border-blue-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
}
