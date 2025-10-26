import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginWithEmail, loginWithGithub, loginWithGoogle, registerWithEmail } from '@/auth/firebase';
import { useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { Navigate } from 'react-router-dom';

export default function LoginPage() {
  const { user, status, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (loading) return <p className="p-6">Carregando...</p>;
  if (user && status === 'approved') return <Navigate to="/dashboard" replace />;

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
    } catch (e) {
      setError('Não foi possível entrar.');
    }
  };
  const handleRegister = async () => {
    try {
      await registerWithEmail(email, password);
    } catch (e) {
      setError('Não foi possível criar a conta.');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-backgroundLight dark:bg-backgroundDark px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow dark:bg-slate-900">
        <div className="mb-6 text-center">
          <div className="mb-2 text-2xl font-bold">Vigilante de Gastos</div>
          <p className="text-sm text-slate-600 dark:text-slate-300">Acesse sua conta</p>
        </div>
        <div className="space-y-3">
          <label className="text-sm text-slate-600 dark:text-slate-300">Email</label>
          <Input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="text-sm text-slate-600 dark:text-slate-300">Senha</label>
          <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <Button onClick={handleLogin} className="w-full" variant="primary">
            Log In
          </Button>
          <div className="relative my-2 text-center text-xs text-slate-500">
            <span>OU</span>
          </div>
          <Button onClick={loginWithGoogle} className="w-full" variant="ghost">
            <span className="material-symbols-outlined mr-2">google</span>
            Entrar com Google
          </Button>
          <Button onClick={loginWithGithub} className="w-full" variant="ghost">
            <span className="material-symbols-outlined mr-2">code</span>
            Entrar com GitHub
          </Button>
          <Button onClick={handleRegister} className="w-full" variant="ghost">
            Criar conta
          </Button>
        </div>
      </div>
    </div>
  );
}

