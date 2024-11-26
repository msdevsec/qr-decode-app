'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      // Show the specific error message from the backend if available
      setError(err?.message || err?.error || 'Failed to register. Please try again.');
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
      {/* Name Field */}
      <div>
        <label 
          htmlFor="name" 
          className="block text-sm font-medium text-gray-200"
        >
          Full Name
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="
              appearance-none block w-full
              px-3 py-2
              border border-gray-700 rounded-lg
              shadow-sm
              bg-gray-800 text-white
              placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
              transition-colors duration-200
            "
            placeholder="John Doe"
            aria-describedby={error && error.includes('Name') ? "name-error" : undefined}
          />
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-200"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="
              appearance-none block w-full
              px-3 py-2
              border border-gray-700 rounded-lg
              shadow-sm
              bg-gray-800 text-white
              placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
              transition-colors duration-200
            "
            placeholder="you@example.com"
            aria-describedby={error && error.includes('Email') ? "email-error" : undefined}
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
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="
              appearance-none block w-full
              px-3 py-2
              border border-gray-700 rounded-lg
              shadow-sm
              bg-gray-800 text-white
              placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
              transition-colors duration-200
            "
            placeholder="••••••••"
            aria-describedby={error && error.includes('Password') ? "password-error" : undefined}
          />
        </div>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label 
          htmlFor="confirmPassword" 
          className="block text-sm font-medium text-gray-200"
        >
          Confirm Password
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="
              appearance-none block w-full
              px-3 py-2
              border border-gray-700 rounded-lg
              shadow-sm
              bg-gray-800 text-white
              placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
              transition-colors duration-200
            "
            placeholder="••••••••"
            aria-describedby={error && error.includes('match') ? "confirm-password-error" : undefined}
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
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </div>

      {/* Sign In Link */}
      <div className="text-sm text-center">
        <Link 
          href="/auth/login" 
          className="text-gray-400 hover:text-white transition-colors"
        >
          Already have an account? <span className="text-red-500">Sign in</span>
        </Link>
      </div>
    </form>
  );
}
