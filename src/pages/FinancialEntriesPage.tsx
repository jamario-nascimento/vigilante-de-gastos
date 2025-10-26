import { Sidebar } from '@/components/ui/Sidebar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Table, THead, TH, TBody, TD } from '@/components/ui/Table';
import { useAuth } from '@/auth/AuthContext';
import { useTransactions } from '@/hooks/useTransactions';
import { subscribeCategories } from '@/services/categories';
import type { Category } from '@/types/category';
import { useEffect, useMemo, useState } from 'react';
import { TransactionForm } from '@/components/entries/TransactionForm';

export default function FinancialEntriesPage() {
  const { user } = useAuth();
  const userId = user?.uid;
  const { items } = useTransactions(userId);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeCategories(userId, setCategories);
    return () => unsub();
  }, [userId]);

  const catMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);

  return (
    <div className="min-h-screen bg-backgroundLight dark:bg-backgroundDark text-slate-800 dark:text-slate-100 flex">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Financial Entries</h1>
          <Modal title="Add New Entry" trigger={<Button onClick={() => setOpen(true)} className="btn-primary">Add New Entry</Button>}>
            {userId ? <TransactionForm userId={userId} onSaved={() => setOpen(false)} /> : <p>Carregando...</p>}
          </Modal>
        </header>

        <Table>
          <THead>
            <tr>
              <TH>DESCRIPTION</TH>
              <TH>CATEGORY</TH>
              <TH>DATE</TH>
              <TH>AMOUNT</TH>
              <TH>ACTIONS</TH>
            </tr>
          </THead>
          <TBody>
            {items.map((t) => (
              <tr key={t.id}>
                <TD>{t.description ?? '-'}</TD>
                <TD>
                  <Badge>{catMap[t.categoryId]?.name ?? '—'}</Badge>
                </TD>
                <TD>{t.date.toLocaleDateString()}</TD>
                <TD className={t.type === 'expense' ? 'text-red-600' : 'text-green-600'}>
                  {t.type === 'expense' ? '-' : '+'}${t.amount.toFixed(2)}
                </TD>
                <TD className="space-x-2">
                  <Button variant="ghost" className="!px-2"><span className="material-symbols-outlined">edit</span></Button>
                  <Button variant="ghost" className="!px-2"><span className="material-symbols-outlined">delete</span></Button>
                </TD>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <TD className="text-center text-slate-500" colSpan={5}>Nenhuma transação ainda.</TD>
              </tr>
            )}
          </TBody>
        </Table>
      </main>
    </div>
  );
}
