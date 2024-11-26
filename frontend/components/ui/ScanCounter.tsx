'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ScanCounterProps {
  scansUsed: number;
  totalScans: number;
  resetTime: number | null;
}

export default function ScanCounter({ scansUsed, totalScans, resetTime }: ScanCounterProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const remaining = totalScans - scansUsed;

  useEffect(() => {
    if (!resetTime) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = resetTime - now;

      if (diff <= 0) {
        setTimeLeft('0:00:00');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    // Update immediately and then every second
    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [resetTime]);

  return (
    <div className="text-center mb-4">
      <p className="text-sm text-gray-400">
        Free Scans Remaining: 
        <span className="font-semibold ml-1">
          {remaining}/{totalScans}
        </span>
      </p>
      {remaining === 0 && resetTime && (
        <div className="mt-2 space-y-2">
          <div className="bg-gray-800 rounded-lg p-2 inline-block">
            <p className="text-gray-400 text-xs mb-1">Your limit will reset in:</p>
            <p className="text-white font-mono text-base font-bold">
              {timeLeft}
            </p>
          </div>
          <div>
            <Link 
              href="/premium" 
              className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold hover:underline block"
            >
              Upgrade To Premium For Unlimited Scans →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
