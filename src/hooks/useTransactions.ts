import { useEffect, useState } from 'react';
import type { Transaction } from '@/types/transaction';
import { subscribeTransactions } from '@/services/transactions';

export function useTransactions(userId?: string) {
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeTransactions(userId, (list) => {
      setItems(list);
      setLoading(false);
    });
    return () => unsub();
  }, [userId]);

  return { items, loading };
}

