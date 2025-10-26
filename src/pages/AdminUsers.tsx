import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { updateUserStatus } from '@/services/users';
import type { UserStatus } from '@/types/user';

function StatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200',
    approved: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200',
  };
  const label: Record<UserStatus, string> = {
    pending: 'Pendente',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${map[status]}`}>{label[status]}</span>;
}

export default function AdminUsersPage() {
  const { users, loading } = useUsers();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleChangeStatus = async (userId: string, status: UserStatus) => {
    setUpdating(`${userId}-${status}`);
    try {
      await updateUserStatus(userId, status);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <p className="p-6 text-sm text-gray-500">Carregando usuários...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Painel de Aprovação</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Aprove ou rejeite novos usuários para liberar o acesso ao dashboard.
          </p>
        </div>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Usuário</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Perfil</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">{user.email ?? 'Sem e-mail'}</p>
                  <p className="text-xs text-gray-500">ID: {user.id}</p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.role ?? 'viewer'}</td>
                <td className="px-4 py-3 text-sm">
                  <StatusBadge status={user.status ?? 'pending'} />
                </td>
                <td className="px-4 py-3 text-sm space-x-2">
                  <button
                    type="button"
                    className="rounded-xl bg-green-600 px-3 py-1 text-white text-xs font-semibold disabled:opacity-50"
                    disabled={updating !== null || user.status === 'approved'}
                    onClick={() => handleChangeStatus(user.id, 'approved')}
                  >
                    Aprovar
                  </button>
                  <button
                    type="button"
                    className="rounded-xl bg-red-600 px-3 py-1 text-white text-xs font-semibold disabled:opacity-50"
                    disabled={updating !== null || user.status === 'rejected'}
                    onClick={() => handleChangeStatus(user.id, 'rejected')}
                  >
                    Rejeitar
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={4}>
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

