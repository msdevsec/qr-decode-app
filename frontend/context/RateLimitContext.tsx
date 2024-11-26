'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface RateLimitState {
  scansUsed: number;
  resetTime: number | null;
}

interface RateLimitContextType {
  scansUsed: number;
  resetTime: number | null;
  remainingScans: number;
  addScan: () => Promise<boolean>;
  canScan: boolean;
  syncWithBackend: () => Promise<void>;
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(undefined);

const DAILY_SCAN_LIMIT = 5;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Initial state
const initialState: RateLimitState = {
  scansUsed: 0,
  resetTime: null
};

export function RateLimitProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<RateLimitState>(initialState);
  const { getToken } = useAuth();

  // Sync with backend
  const syncWithBackend = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/api/scans/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rate limit info');
      }

      const data = await response.json();
      setState({
        scansUsed: DAILY_SCAN_LIMIT - data.remainingToday,
        resetTime: data.resetTime ? Date.now() + (data.resetTime * 1000) : null
      });
    } catch (error) {
      console.error('Failed to sync rate limit:', error);
    }
  };

  // Initialize state from backend after mount
  useEffect(() => {
    syncWithBackend();
    setMounted(true);
  }, []);

  // Sync with backend periodically
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(syncWithBackend, 5000); // Sync every 5 seconds
    return () => clearInterval(interval);
  }, [mounted]);

  const addScan = async () => {
    // Always check with backend first
    await syncWithBackend();

    // If we're at the limit
    if (state.scansUsed >= DAILY_SCAN_LIMIT) {
      return false;
    }

    // Let the backend handle the actual increment
    // We'll update our state in the next sync
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
    syncWithBackend
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
