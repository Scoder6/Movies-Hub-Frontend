import { ProtectedRoute } from './ProtectedRoute';

export const AdminRoute = () => (
  <ProtectedRoute adminOnly redirectTo="/" />
);
