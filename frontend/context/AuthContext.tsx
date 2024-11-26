'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContext, ToastContextType } from './ToastContext';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'qrdecode_auth_user';
const TOKEN_STORAGE_KEY = 'qrdecode_auth_token';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const initialState: AuthState = {
  user: null,
  isLoading: true
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();
  const toast = useContext<ToastContextType | undefined>(ToastContext);

  const showToast = (message: string, type: 'success' | 'error') => {
    if (toast) {
      toast.showToast(message, type);
    }
  };

  const handleUnauthorized = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setState({
      user: null,
      isLoading: false
    });
    router.push('/auth/login');
    showToast('Session expired. Please log in again.', 'error');
  };

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        handleUnauthorized();
        return false;
      }

      return true;
    } catch {
      handleUnauthorized();
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        
        if (savedUser && token) {
          const isValid = await verifyToken(token);
          if (isValid) {
            setState({
              user: JSON.parse(savedUser),
              isLoading: false
            });
          }
        } else {
          setState({
            user: null,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        handleUnauthorized();
      }
      setMounted(true);
    };

    checkAuth();

    // Set up interval to periodically verify token
    const interval = setInterval(() => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        verifyToken(token);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [router]);

  const getToken = () => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  };

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }

      const { user, token } = data;
      
      // Save user and token separately
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      
      setState({
        user,
        isLoading: false
      });

      showToast('Successfully logged in!', 'success');
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Registration failed';
        throw new Error(errorMessage);
      }

      const { user, token } = data;
      
      // Save user and token separately
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      
      setState({
        user,
        isLoading: false
      });

      showToast('Successfully registered!', 'success');
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setState({
        user: null,
        isLoading: false
      });
      router.push('/auth/login');
      showToast('Successfully logged out!', 'success');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider 
      value={{
        user: state.user,
        isLoading: state.isLoading,
        login,
        register,
        logout,
        getToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
