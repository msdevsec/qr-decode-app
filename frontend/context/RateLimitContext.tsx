'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RateLimitState {
  scansUsed: number;
  resetTime: number | null;
}

interface RateLimitContextType {
  scansUsed: number;
  resetTime: number | null;
  remainingScans: number;
  addScan: () => boolean;
  canScan: boolean;
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(undefined);

const DAILY_SCAN_LIMIT = 5;
const STORAGE_KEY = 'qrdecode_rate_limit';

// Initial state without Date.now()
const initialState: RateLimitState = {
  scansUsed: 0,
  resetTime: null
};

export function RateLimitProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<RateLimitState>(initialState);

  // Initialize state from localStorage after mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Only use stored state if reset time hasn't passed
      if (parsed.resetTime && Date.now() < parsed.resetTime) {
        setState(parsed);
      } else {
        setState(initialState);
      }
    }
    setMounted(true);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, mounted]);

  const addScan = () => {
    // If we have a reset time and it's passed
    if (state.resetTime && Date.now() >= state.resetTime) {
      setState({
        scansUsed: 1,
        resetTime: null
      });
      return true;
    }

    // If we're at the limit
    if (state.scansUsed >= DAILY_SCAN_LIMIT) {
      return false;
    }

    // Add the scan
    const newScansUsed = state.scansUsed + 1;
    setState({
      scansUsed: newScansUsed,
      // Only set reset time when hitting the limit
      resetTime: newScansUsed === DAILY_SCAN_LIMIT ? 
        Date.now() + (24 * 60 * 60 * 1000) : null
    });
    return true;
  };

  // Don't render children until after client-side hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

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
