import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { login, signup, logout, getCurrentUser } from '@/lib/api';
import type { User } from '@/types';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<{
    user: User | null;
    loading: boolean;
    initialized: boolean;
  }>({
    user: null,
    loading: true,
    initialized: false
  });

  const initializeAuth = useCallback(async () => {
    try {
      const userData = await getCurrentUser();
      setState(prev => ({
        ...prev,
        user: userData,
        loading: false,
        initialized: true
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        initialized: true
      }));
    }
  }, []);

  useEffect(() => {
    if (!state.initialized) {
      initializeAuth();
    }
  }, [state.initialized, initializeAuth]);

  const signIn = useCallback(async (email: string, password: string) => {
    const userData = await login(email, password);
    setState(prev => ({
      ...prev,
      user: userData,
      loading: false
    }));
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const userData = await signup(name, email, password);
    setState(prev => ({
      ...prev,
      user: userData,
      loading: false
    }));
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logout();
    } finally {
      setState(prev => ({
        ...prev,
        user: null,
        loading: false
      }));
    }
  }, []);

  const value = useMemo(() => ({
    user: state.user,
    loading: state.loading,
    isAuthenticated: !!state.user,
    isAdmin: state.user?.role === 'admin',
    login: signIn,
    logout: signOut,
    signup: register
  }), [state.user, state.loading, signIn, signOut, register]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};