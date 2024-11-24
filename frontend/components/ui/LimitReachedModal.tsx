'use client';

import { useEffect, useState } from 'react';
import Button from './Button';
import { useRouter } from 'next/navigation';

interface LimitReachedModalProps {
  isOpen: boolean;
  resetTime: number;
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
    if (!isOpen) return;

    const updateTimeLeft = () => {
      const now = Date.now();
      const diff = resetTime - now;
      
      if (diff <= 0) {
        onClose();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isOpen, resetTime, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-blue-900 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl border border-blue-700">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Daily Scan Limit Reached
        </h2>
        <div className="space-y-6 text-center">
          <p className="text-gray-200 text-lg">
            You&apos;ve used all your free scans for today.
          </p>
          <p className="text-gray-200 text-lg">
            Free users are limited to 5 scans per day.
          </p>
          <a 
            href="/premium"
            onClick={(e) => {
              e.preventDefault();
              handleUpgradeClick();
            }}
            className="text-yellow-400 text-lg font-semibold block hover:text-red-300 hover:underline transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            Upgrade to Premium for Unlimited Scans!
                     </a>
          <div className="bg-blue-800 rounded-lg p-4">
            <p className="text-gray-200">
              Time until reset: 
              <span className="font-bold text-white ml-2">
                {timeLeft}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 shadow-lg"
            onClick={handleUpgradeClick}
          >
            Upgrade to Premium
          </Button>
          <button
            className="w-full text-gray-300 hover:text-white transition-colors duration-200"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
