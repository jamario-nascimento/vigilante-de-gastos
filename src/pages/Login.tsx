import { useState } from "react";
import {
  loginWithGoogle,
  loginWithGithub,
  loginWithEmail,
  registerWithEmail
} from "@/auth/firebase";
import { useAuth } from "@/auth/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (loading) return <p>Carregando...</p>;
  if (user) return <Navigate to="/dashboard" replace />;

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
    } catch (err) {
      setError("Credenciais inválidas");
    }
  };

  const handleRegister = async () => {
    try {
      await registerWithEmail(email, password);
    } catch (err) {
      setError("Erro ao registrar usuário");
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
