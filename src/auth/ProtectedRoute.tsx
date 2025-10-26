import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Readonly<Props>) {
  const { user, loading, status } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (status && status !== "approved") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Conta em análise</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Seu acesso ainda não foi aprovado. Aguarde a confirmação do administrador.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
