import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { userId } = useAuth();
  return userId ? children : <Navigate to="/login" replace />;
}
