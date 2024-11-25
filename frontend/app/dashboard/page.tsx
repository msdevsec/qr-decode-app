// frontend/app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Header

from '@/components/layout/Header';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Protect this route - redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  // Show loading state while checking auth
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Dashboard header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-400">
            Welcome back, {user.name}
          </p>
        </div>

        {/* Dashboard content */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-2 border-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stats Section */}
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">Your Stats</h3>
                <p className="text-gray-400">Total Scans: 0</p>
                <p className="text-gray-400">Today's Scans: 0</p>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-2">Recent Activity</h3>
                <p className="text-gray-400">No recent scans</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}