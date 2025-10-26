import { useState } from "react";
import {
  loginWithGoogle,
  loginWithGithub,
  loginWithEmail,
  registerWithEmail,
} from "@/auth/firebase";
import { useAuth } from "@/auth/AuthContext";
import { Navigate } from "react-router-dom";
import { isFirebaseError } from "@/utils/isFirebaseError";

const Login = () => {
  const { user, loading, status } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (loading) return <p>Carregando...</p>;
  if (user && status === "approved") return <Navigate to="/dashboard" replace />;
  if (user && status && status !== "approved") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Aguardando aprovação</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Recebemos seu cadastro. Assim que um administrador aprovar seu acesso, avisaremos por e-mail.
        </p>
      </div>
    );
  }

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
    } catch (err) {
      if (isFirebaseError(err)) {
        const map: Record<string, string> = {
          "auth/operation-not-allowed": "Habilite o método Email/Senha no Firebase.",
          "auth/invalid-credential": "Credenciais inválidas.",
          "auth/user-not-found": "Usuário não encontrado.",
          "auth/wrong-password": "Senha incorreta.",
          "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
        };
        setError(map[err.code] ?? `Erro ao entrar: ${err.code}`);
      } else {
        setError("Erro ao entrar");
      }
    }
  };

  const handleRegister = async () => {
    try {
      await registerWithEmail(email, password);
    } catch (err) {
      if (isFirebaseError(err)) {
        const map: Record<string, string> = {
          "auth/operation-not-allowed": "Habilite Email/Senha em Authentication > Sign-in method.",
          "auth/email-already-in-use": "E-mail já em uso.",
          "auth/weak-password": "Senha fraca (mín. 6 caracteres).",
          "auth/invalid-email": "E-mail inválido.",
        };
        setError(map[err.code] ?? `Erro ao registrar: ${err.code}`);
      } else {
        setError("Erro ao registrar usuário");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-2"
        onClick={loginWithGoogle}
      >
        Entrar com Google
      </button>

      <button
        className="bg-gray-800 text-white px-4 py-2 rounded mb-4"
        onClick={loginWithGithub}
      >
        Entrar com GitHub
      </button>

      <div className="w-full max-w-xs">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full p-2 border rounded mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          className="w-full bg-green-600 text-white py-2 rounded mb-2"
          onClick={handleLogin}
        >
          Entrar com Email
        </button>

        <button
          className="w-full bg-gray-400 text-black py-2 rounded"
          onClick={handleRegister}
        >
          Registrar
        </button>
      </div>
    </div>
  );
};

export default Login;
