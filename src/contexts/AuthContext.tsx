import { createContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType } from '@/types';
import { authApi } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from '@/hooks/useAuth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Use a ref to track if we've already checked auth state
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Only check auth once on mount
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      
      // Check for existing session via HTTP-only cookie
      authApi.getCurrentUser()
        .then(user => {
          setUser(user);
          setIsLoading(false);
        })
        .catch(() => {
          setUser(null);
          setIsLoading(false);
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const user = await authApi.login(email, password);
      setUser(user);
      toast({
        title: 'Welcome back!',
        description: `Good to see you again, ${user.name}`,
      });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const user = await authApi.signup(name, email, password);
      setUser(user);
      toast({
        title: 'Account created!',
        description: `Welcome to MovieHub, ${user.name}`,
      });
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    toast({
      title: 'Logged out',
      description: 'See you next time!',
    });
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}