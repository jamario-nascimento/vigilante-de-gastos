import { logout } from '@/auth/firebase';
import { useAuth } from '@/auth/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen px-6 py-10 bg-colorscheme-dark-background text-colorscheme-dark-text dark:bg-colorscheme-dark-background">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm opacity-80">{user?.email}</span>
          <button
            onClick={logout}
            className="rounded-xl bg-primary px-3 py-2 text-white hover:opacity-90"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-4 shadow dark:bg-slate-800">
          <h2 className="mb-2 text-lg font-semibold">Resumo</h2>
          <p className="text-sm opacity-80">Em breve: cards com métricas de receitas e despesas.</p>
        </section>
        <section className="rounded-2xl bg-white p-4 shadow dark:bg-slate-800 md:col-span-2 lg:col-span-2">
          <h2 className="mb-2 text-lg font-semibold">Gráfico</h2>
          <p className="text-sm opacity-80">Em breve: gráfico de evolução mensal (Recharts).</p>
        </section>
        <section className="rounded-2xl bg-white p-4 shadow dark:bg-slate-800 lg:col-span-3">
          <h2 className="mb-2 text-lg font-semibold">Transações Recentes</h2>
          <p className="text-sm opacity-80">Em breve: tabela com filtros e ordenação.</p>
        </section>
      </main>
    </div>
  );
}
