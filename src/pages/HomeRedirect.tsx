import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

export default function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
}

