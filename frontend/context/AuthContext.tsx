'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'qrdecode_auth_user';

// Initial state without any Date.now() or dynamic values
const initialState: AuthState = {
  user: null,
  isLoading: true
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<AuthState>(initialState);

  // Initialize auth state after mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
          setState({
            user: JSON.parse(savedUser),
            isLoading: false
          });
        } else {
          setState({
            user: null,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setState({
          user: null,
          isLoading: false
        });
      }
      setMounted(true);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Mock login - replace with actual API call in commercial version
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      setState({
        user: mockUser,
        isLoading: false
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Mock registration - replace with actual API call in commercial version
      const mockUser: User = {
        id: '1',
        name,
        email
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      setState({
        user: mockUser,
        isLoading: false
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setState({
        user: null,
        isLoading: false
      });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  // Don't render children until after client-side hydration
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
        logout
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
