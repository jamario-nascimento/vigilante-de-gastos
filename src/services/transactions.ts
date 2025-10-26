import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, Timestamp, where, type DocumentData, type QueryDocumentSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/auth/firebase';
import { transactionSchema, type Transaction, toDate } from '@/types/transaction';

export function adaptTransaction(docSnap: QueryDocumentSnapshot<DocumentData>): Transaction {
  return transactionSchema.parse({ id: docSnap.id, ...docSnap.data(), date: toDate(docSnap.data().date)!, createdAt: toDate(docSnap.data().createdAt), updatedAt: toDate(docSnap.data().updatedAt) });
}

export function subscribeTransactions(userId: string, cb: (list: Transaction[]) => void) {
  const ref = collection(db, 'transactions');
  const q = query(ref, where('userId', '==', userId), orderBy('date', 'desc'));
  return onSnapshot(q, (snap) => cb(snap.docs.map(adaptTransaction)));
}

export async function createTransaction(userId: string, data: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  const ref = collection(db, 'transactions');
  await addDoc(ref, {
    ...data,
    userId,
    date: Timestamp.fromDate(data.date),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function deleteTransaction(id: string) {
  await deleteDoc(doc(db, 'transactions', id));
}

export async function updateTransaction(id: string, patch: Partial<Omit<Transaction, 'id' | 'userId'>>) {
  await updateDoc(doc(db, 'transactions', id), { ...patch, updatedAt: Timestamp.now() });
}

