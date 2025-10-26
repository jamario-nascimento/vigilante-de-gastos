import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { subscribeCategories } from '@/services/categories';
import { createTransaction } from '@/services/transactions';
import type { Category } from '@/types/category';

export function TransactionForm({ userId, onSaved }: { userId: string; onSaved?: () => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeCategories(userId, setCategories);
    return () => unsub();
  }, [userId]);

  const options = useMemo(() => categories.filter((c) => c.type === type), [categories, type]);

  useEffect(() => {
    if (options.length && !options.find((c) => c.id === categoryId)) {
      setCategoryId(options[0].id);
    }
  }, [options, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return;
    setSaving(true);
    try {
      await createTransaction(userId, {
        type,
        amount: Math.max(0, Number(amount)),
        categoryId,
        description,
        paymentMethod: undefined,
        tags: [],
        date: new Date(date),
        userId: userId, // not used by service; kept for typing clarity
        id: 'temp', // ignored
        createdAt: undefined,
        updatedAt: undefined,
      } as any);
      onSaved?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <button type="button" className={`btn ${type === 'expense' ? 'btn-danger' : 'btn-ghost'}`} onClick={() => setType('expense')}>
          Despesa
        </button>
        <button type="button" className={`btn ${type === 'income' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setType('income')}>
          Receita
        </button>
      </div>
      <div>
        <label className="text-sm">Valor</label>
        <Input type="number" min="0" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div>
        <label className="text-sm">Categoria</label>
        <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {options.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm">Data</label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <label className="text-sm">Descrição</label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="pt-2">
        <Button type="submit" disabled={saving}>Salvar</Button>
      </div>
    </form>
  );
}

