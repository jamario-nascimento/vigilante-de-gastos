import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

type Props = {
  children: ReactNode;
};

export function AdminRoute({ children }: Readonly<Props>) {
  const { user, role, status, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (status !== 'approved') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Conta não aprovada</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Apenas contas aprovadas podem acessar esta área.
        </p>
      </div>
    );
  }
  if (role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Acesso restrito</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Somente administradores podem acessar esta página.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

