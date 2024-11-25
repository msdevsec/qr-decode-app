'use client';

import { ToastProvider } from '../context/ToastContext';
import { RateLimitProvider } from '../context/RateLimitContext';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { metadata } from './metadata';
import './globals.css';

// Export metadata for Next.js
export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen flex flex-col">
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
      </body>
    </html>
  );
}
