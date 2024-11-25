// frontend/components/auth/ForgotPasswordForm.tsx
'use client';

import Link from 'next/link';
import Button from '../ui/Button';

export default function ForgotPasswordForm() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
        <h3 className="text-lg font-medium text-white mb-2">
          Password Reset
        </h3>
        <p className="text-gray-400 mb-4">
          Password reset functionality is available in the commercial version.
        </p>
        <div className="space-y-4">
          <p className="text-gray-400">
            For support or inquiries about the commercial version, please contact:
          </p>
          <a 
            href="mailto:msdevsec.services@gmail.com"
            className="text-blue-500 hover:text-blue-400 block"
          >
            msdevsec.services@gmail.com
          </a>
        </div>
      </div>

      <div className="text-center">
        <Link 
          href="/auth/login" 
          className="text-blue-500 hover:text-blue-400"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
