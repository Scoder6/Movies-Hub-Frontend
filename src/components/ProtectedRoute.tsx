import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';

type ProtectedRouteProps = {
  adminOnly?: boolean;
  redirectTo?: string;
};

export const ProtectedRoute = ({
  adminOnly = false,
  redirectTo = '/auth/login',
}: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, loading: isLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  // Add a small delay to prevent flash of loading state
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Show loading state
  if (isLoading || !isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: window.location.pathname }} replace />;
  }

  // Redirect to home if admin access required but user is not admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
