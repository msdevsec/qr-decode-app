// frontend/app/layout.tsx
'use client';

// Import all providers and components
import { ToastProvider } from '../context/ToastContext';
import { RateLimitProvider } from '../context/RateLimitContext';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './globals.css';

// Define the props type for the layout component
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    // Root HTML element with language set to English
    <html lang="en">
      {/* Body with dark theme background */}
      <body className="bg-black min-h-screen flex flex-col">
        {/* Wrap entire app with all providers in correct order */}
        <AuthProvider>
          <ToastProvider>
            <RateLimitProvider>
                {/* Main layout structure */}
                  <div className="flex flex-col min-h-screen">
                {/* Header will appear on all pages */}
                <Header />

                {/* Main content area */}
                <main className="flex-grow">
                  {children}
                </main>

                {/* Footer will appear on all pages */}
                <Footer />
              </div>
            </RateLimitProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}