'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 animate-slide-up"
      role="alert"
      aria-live="polite"
    >
      <div
        onClick={onClose}
        className={`
          rounded-lg px-4 py-3 shadow-lg cursor-pointer
          transform transition-all duration-300
          hover:scale-105 hover:shadow-xl
          ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}
          text-white
        `}
      >
        <div className="flex items-center space-x-2">
          <span className="text-xl" aria-hidden="true">
            {type === 'success' ? '✓' : '✕'}
          </span>
          <p className="pr-2">{message}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="ml-auto text-white/80 hover:text-white transition-colors"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
