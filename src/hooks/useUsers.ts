import { useEffect, useState } from 'react';
import type { UserRecord } from '@/types/user';
import { subscribeUsers } from '@/services/users';

export function useUsers() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeUsers((list) => {
      setUsers(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { users, loading };
}

