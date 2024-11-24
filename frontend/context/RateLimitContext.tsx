'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RateLimitState {
  scansUsed: number;
  resetTime: number;
}

interface RateLimitContextType {
  scansUsed: number;
  resetTime: number;
  remainingScans: number;
  addScan: () => boolean;
  canScan: boolean;
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(undefined);

const DAILY_SCAN_LIMIT = 5;
const STORAGE_KEY = 'qrdecode_rate_limit';

export function RateLimitProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RateLimitState>(() => {
    // Try to get stored state
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if reset time has passed
        if (Date.now() < parsed.resetTime) {
          return parsed;
        }
      }
    }
    // Default state
    return {
      scansUsed: 0,
      resetTime: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    };
  });

  useEffect(() => {
    // Save state to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    // Set up reset timer
    const timeUntilReset = state.resetTime - Date.now();
    if (timeUntilReset > 0) {
      const timer = setTimeout(() => {
        setState({
          scansUsed: 0,
          resetTime: Date.now() + 24 * 60 * 60 * 1000,
        });
      }, timeUntilReset);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const addScan = () => {
    if (state.scansUsed >= DAILY_SCAN_LIMIT) {
      return false;
    }

    setState(prev => ({
      ...prev,
      scansUsed: prev.scansUsed + 1,
    }));
    return true;
  };

  const value = {
    scansUsed: state.scansUsed,
    resetTime: state.resetTime,
    remainingScans: DAILY_SCAN_LIMIT - state.scansUsed,
    addScan,
    canScan: state.scansUsed < DAILY_SCAN_LIMIT,
  };

  return (
    <RateLimitContext.Provider value={value}>
      {children}
    </RateLimitContext.Provider>
  );
}

export function useRateLimit() {
  const context = useContext(RateLimitContext);
  if (context === undefined) {
    throw new Error('useRateLimit must be used within a RateLimitProvider');
  }
  return context;
}
