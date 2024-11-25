// frontend/components/ui/ScanCounter.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ScanCounterProps {
  scansUsed: number;
  totalScans: number;
  resetTime: number | null;  // Make resetTime nullable
}

export default function ScanCounter({ scansUsed, totalScans, resetTime }: ScanCounterProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const remaining = totalScans - scansUsed;

  useEffect(() => {
    // Only start timer if resetTime exists and all scans are used
    if (resetTime && scansUsed >= totalScans) {
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
    }
  }, [resetTime, scansUsed, totalScans]);

  return (
    <div className="text-center mb-4">
      <p className="text-sm text-gray-400">
        Free Daily Scans Remaining: 
        <span className="font-semibold ml-1">
          {remaining}/{totalScans}
        </span>
      </p>
      {/* Only show upgrade message and timer when all scans are used */}
      {remaining === 0 && (
        <div className="mt-1 space-y-1">
          <Link 
            href="/premium" 
            className="text-xs text-blue-500 hover:text-blue-400 block"
          >
            Upgrade to Premium for unlimited scans
          </Link>
          {resetTime && (
            <p className="text-xs text-gray-500">
              Scan Limit reset in: <span className="font-mono">{timeLeft}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}