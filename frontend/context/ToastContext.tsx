'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Toast from '../components/ui/Toast';

export interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error') => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastState {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
}

const initialState: ToastState = {
  message: '',
  type: 'success',
  isVisible: false
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<ToastState>(initialState);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setState({
      message,
      type,
      isVisible: true
    });
  };

  const hideToast = () => {
    setState(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  // Don't render toast until after client-side hydration
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {state.isVisible && (
        <Toast
          message={state.message}
          type={state.type}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
