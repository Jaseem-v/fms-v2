'use client';

import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const baseClasses = "fixed top-4 right-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto transform transition-all duration-300";
  const visibilityClasses = isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0";

  const typeClasses = {
    success: "border-l-4 border-green-500",
    error: "border-l-4 border-red-500",
    warning: "border-l-4 border-yellow-500",
    info: "border-l-4 border-blue-500"
  };

  const iconClasses = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500"
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${visibilityClasses}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 w-6 h-6 ${iconClasses[type]} text-lg font-bold`}>
            {icons[type]}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
