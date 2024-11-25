'use client';

import Link from 'next/link';
import Button from '../ui/Button';

export default function ForgotPasswordForm() {
  return (
    <div className="space-y-6">
      <div 
        className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg"
        role="alert"
        aria-labelledby="reset-title"
      >
        {/* Premium Notice */}
        <div className="space-y-4">
          <h3 
            id="reset-title"
            className="text-xl font-semibold text-white"
          >
            Password Reset
          </h3>
          <div className="space-y-4">
            <p className="text-gray-400">
              Password reset functionality is available in the commercial version.
            </p>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-300 mb-2">
                For support or inquiries about the commercial version:
              </p>
              <a 
                href="mailto:msdevsec.services@gmail.com"
                className="text-red-500 hover:text-red-400 transition-colors duration-200 flex items-center gap-2"
              >
                <span aria-hidden="true">📧</span>
                msdevsec.services@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Premium Features List */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <h4 className="text-lg font-medium text-white mb-4">
            Premium Features Include:
          </h4>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center gap-2">
              <span className="text-green-500" aria-hidden="true">✓</span>
              Password Reset & Recovery
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500" aria-hidden="true">✓</span>
              Unlimited QR Code Scans
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500" aria-hidden="true">✓</span>
              Bulk QR code processing
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500" aria-hidden="true">✓</span>
              Ads Free
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500" aria-hidden="true">✓</span>
              Priority Support
            </li>
          </ul>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="space-y-4">
        <div className="text-center">
          <Link 
            href="/premium"
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Learn More About Premium
          </Link>
        </div>
        <div className="text-center">
          <Link 
            href="/auth/login" 
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
