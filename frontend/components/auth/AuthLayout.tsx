'use client';

import Link from 'next/link';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-black flex flex-col py-8 sm:py-12">
      {/* Logo/Home Link */}
      <div className="sm:mx-auto">
        <Link 
          href="/" 
          className="flex items-center justify-center space-x-2 group"
          aria-label="Return to homepage"
        >
          <Image
            src="/images/logo.png"
            alt=""
            width={40}
            height={40}
            className="object-contain transition-transform group-hover:scale-110"
          />
          <span className="text-xl font-bold text-white">
            QRDECODE.AI
          </span>
        </Link>
      </div>

      {/* Auth Container */}
      <div className="mt-8 sm:mx-auto w-full max-w-md px-4 sm:px-0">
        <div 
          className="relative bg-gray-900 py-8 px-4 sm:px-10 shadow-xl sm:rounded-xl border border-gray-800 animate-fade-in"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-400">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {children}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Scanner
          </Link>
        </div>
      </div>
    </div>
  );
}
