'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface ApiError extends Error {
  message: string;
}

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      const error = err as ApiError;
      // Handle specific error messages from the backend
      if (error.message === 'Invalid credentials') {
        setError('Invalid email or password');
      } else if (error.message.includes('not found')) {
        setError('Account not found. Please check your email');
      } else {
        setError(error.message || 'Failed to login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      noValidate
    >
      {/* Email Field */}
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-200"
        >
          Email address
        </label>
        <div className="mt-1 relative">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(''); // Clear error when user types
            }}
            className="
              appearance-none block w-full
              px-3 py-2
              border border-gray-700 rounded-lg
              shadow-sm
              bg-gray-800 text-white
              placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
              transition-colors duration-200
              disabled:opacity-50
            "
            placeholder="you@example.com"
            disabled={isLoading}
            aria-describedby={error ? "email-error" : undefined}
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-gray-200"
        >
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(''); // Clear error when user types
            }}
            className="
              appearance-none block w-full
              px-3 py-2
              border border-gray-700 rounded-lg
              shadow-sm
              bg-gray-800 text-white
              placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
              transition-colors duration-200
              disabled:opacity-50
            "
            placeholder="••••••••"
            disabled={isLoading}
            aria-describedby={error ? "password-error" : undefined}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div 
          className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg"
          role="alert"
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          isLoading={isLoading}
          size="lg"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>

      {/* Links */}
      <div className="space-y-4">
        <div className="text-sm text-center">
          <Link 
            href="/auth/register" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            Don&apos;t have an account? <span className="text-red-500">Sign up</span>
          </Link>
        </div>

        <div className="text-sm text-center">
          <Link 
            href="/auth/forgot-password" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </form>
  );
}
