'use client';

import { ToastProvider } from '../context/ToastContext'
import { RateLimitProvider } from '../context/RateLimitContext'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen">
        <ToastProvider>
          <RateLimitProvider>
            {children}
          </RateLimitProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
