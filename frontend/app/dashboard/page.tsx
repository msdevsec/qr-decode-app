'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface ScanStats {
  totalScans: number;
  scanTypes: Record<string, number>;
  remainingToday: number;
  rateLimit: number;
}

interface Scan {
  id: string;
  content: string;
  type: string;
  created_at: string;
}

interface ScanHistory {
  scans: Scan[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function DashboardPage() {
  const router = useRouter();
  const { user, getToken } = useAuth();
  const [stats, setStats] = useState<ScanStats | null>(null);
  const [history, setHistory] = useState<ScanHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error('No auth token found');

      const response = await fetch(`${API_URL}/api/scans/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch stats');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Failed to load statistics');
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error('No auth token found');

      const response = await fetch(`${API_URL}/api/scans/history?page=1&limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch history');
      }
      
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setError('Failed to load scan history');
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(''); // Clear any previous errors
      await Promise.all([fetchStats(), fetchHistory()]);
      setLoading(false);
    };

    loadData();

    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [user, router]);

  if (!user || loading) {
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

        {error && (
          <div className="px-4 sm:px-0 mb-6">
            <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Dashboard content */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-2 border-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stats Section */}
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-4">Your Stats</h3>
                <div className="space-y-3">
                  <p className="text-gray-400">
                    Total Scans: {stats?.totalScans || 0}
                  </p>
                  <p className="text-gray-400">
                    Remaining Today: {stats?.remainingToday || 0}/{stats?.rateLimit || 5}
                  </p>
                  {stats?.scanTypes && Object.entries(stats.scanTypes).length > 0 && (
                    <div>
                      <p className="text-white text-sm font-medium mb-2">Scans by Type:</p>
                      {Object.entries(stats.scanTypes).map(([type, count]) => (
                        <p key={type} className="text-gray-400 text-sm">
                          {type}: {count}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-4">Recent Scans</h3>
                {history?.scans && history.scans.length > 0 ? (
                  <div className="space-y-3">
                    {history.scans.map((scan) => (
                      <div key={scan.id} className="bg-gray-800 p-3 rounded-lg">
                        <p className="text-gray-300 font-medium">{scan.type}</p>
                        <p className="text-gray-400 text-sm truncate">{scan.content}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(scan.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No recent scans</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
