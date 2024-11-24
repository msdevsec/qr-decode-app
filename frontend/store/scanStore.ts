'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ScanStore {
  scansToday: number;
  lastScanTime: number; // Unix timestamp of last scan
  incrementScan: () => void;
  resetScans: () => void;
  hasReachedLimit: () => boolean;
  getTimeUntilReset: () => string; // Returns formatted time string
}

export const useScanStore = create<ScanStore>()(
  persist(
    (set, get) => ({
      scansToday: 0,
      lastScanTime: 0,

      incrementScan: () => {
        const now = Date.now();
        const timeSinceLastScan = now - get().lastScanTime;
        
        // If 24 hours have passed, reset counter
        if (timeSinceLastScan >= 24 * 60 * 60 * 1000) {
          set({
            scansToday: 1,
            lastScanTime: now
          });
        } else {
          set(state => ({
            scansToday: state.scansToday + 1,
            lastScanTime: now
          }));
        }
      },

      resetScans: () => {
        set({
          scansToday: 0,
          lastScanTime: 0
        });
      },

      hasReachedLimit: () => {
        const now = Date.now();
        const timeSinceLastScan = now - get().lastScanTime;
        
        // If 24 hours have passed, reset counter
        if (timeSinceLastScan >= 24 * 60 * 60 * 1000) {
          return false;
        }
        return get().scansToday >= 5;
      },

      getTimeUntilReset: () => {
        const now = Date.now();
        const resetTime = get().lastScanTime + (24 * 60 * 60 * 1000);
        const timeLeft = resetTime - now;

        if (timeLeft <= 0) return '';

        const hours = Math.floor(timeLeft / (60 * 60 * 1000));
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        return `${hours}h ${minutes}m`;
      }
    }),
    {
      name: 'scan-storage'
    }
  )
);