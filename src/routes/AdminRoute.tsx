import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function AdminRoute({ children }: { children: JSX.Element }) {
  const { role } = useAuth();
  return role === 'admin' ? children : <Navigate to="/" replace />;
}
