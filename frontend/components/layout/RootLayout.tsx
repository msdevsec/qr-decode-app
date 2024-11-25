'use client';

import { useEffect, useState } from 'react';
import { ToastProvider } from '../../context/ToastContext';
import { RateLimitProvider } from '../../context/RateLimitContext';
import { AuthProvider } from '../../context/AuthContext';
import Header from './Header';
import Footer from './Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a simple loading state before hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <ToastProvider>
        <RateLimitProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </RateLimitProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
