import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

function Item({ to, icon, children }: { to: string; icon: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-primary/10 text-slate-700 dark:text-slate-300',
          isActive && 'bg-primary/10'
        )
      }
    >
      <span className="material-symbols-outlined text-base">{icon}</span>
      <span>{children}</span>
    </NavLink>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 p-4 space-y-2">
      <div className="mb-4 text-xl font-semibold">Vigilante</div>
      <nav className="space-y-1">
        <Item to="/dashboard" icon="dashboard">Dashboard</Item>
        <Item to="/entries" icon="receipt_long">Financial Entries</Item>
        <Item to="/settings" icon="settings">Settings</Item>
        <Item to="/admin/users" icon="manage_accounts">Admin</Item>
      </nav>
    </aside>
  );
}

