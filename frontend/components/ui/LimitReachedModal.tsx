'use client';

import { useEffect, useState } from 'react';
import Button from './Button';
import { useRouter } from 'next/navigation';

interface LimitReachedModalProps {
  isOpen: boolean;
  resetTime: number | null;
  onClose: () => void;
}

export default function LimitReachedModal({ isOpen, resetTime, onClose }: LimitReachedModalProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const router = useRouter();

  const handleUpgradeClick = () => {
    onClose();
    router.push('/premium');
  };

  useEffect(() => {
    if (!isOpen || !resetTime) return;

    const updateTimeLeft = () => {
      const now = Date.now();
      const diff = resetTime - now;
      
      if (diff <= 0) {
        onClose();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [isOpen, resetTime, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div 
        className="bg-blue-900 rounded-lg p-6 sm:p-8 max-w-md w-full mx-auto shadow-2xl border border-blue-700"
      >
        <h2 
          id="modal-title"
          className="text-xl sm:text-2xl font-bold mb-4 text-white text-center"
        >
          Daily Scan Limit Reached
        </h2>
        <div className="space-y-3 text-center">
          <p className="text-base text-gray-200">
            You&apos;ve used all your free scans for today.
          </p>
          <p className="text-sm text-gray-300">
            Free users are limited to 5 scans per day.
          </p>
          {resetTime && (
            <div className="bg-blue-800 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-300 mb-2">Your limit will reset in:</p>
              <p className="font-mono font-bold text-2xl text-white tracking-wider" aria-live="polite">
                {timeLeft}
              </p>
            </div>
          )}
          <div className="pt-4">
            <a 
              href="/premium"
              onClick={(e) => {
                e.preventDefault();
                handleUpgradeClick();
              }}
              className="text-yellow-400 text-sm font-semibold block hover:text-yellow-300 hover:underline transition-all duration-200 cursor-pointer"
            >
              Upgrade To Premium For Unlimited Scans →
            </a>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <Button 
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2.5 rounded-lg transition-colors duration-200 shadow-lg"
            onClick={handleUpgradeClick}
          >
            Upgrade to Premium
          </Button>
          <button
            className="w-full text-gray-300 hover:text-white transition-colors duration-200 py-2 text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
