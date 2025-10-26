import { collection, query, where, orderBy, getDocs, onSnapshot, type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/auth/firebase';
import { categorySchema, type Category, toDate } from '@/types/category';

export function adaptCategory(docSnap: QueryDocumentSnapshot<DocumentData>): Category {
  return categorySchema.parse({ id: docSnap.id, ...docSnap.data(), createdAt: toDate(docSnap.data().createdAt), updatedAt: toDate(docSnap.data().updatedAt) });
}

export async function fetchCategoriesByUser(userId: string): Promise<Category[]> {
  const ref = collection(db, 'categories');
  const q = query(ref, where('userId', '==', userId), orderBy('name'));
  const snap = await getDocs(q);
  return snap.docs.map(adaptCategory);
}

export function subscribeCategories(userId: string, cb: (list: Category[]) => void) {
  const ref = collection(db, 'categories');
  const q = query(ref, where('userId', '==', userId), orderBy('name'));
  return onSnapshot(q, (snap) => cb(snap.docs.map(adaptCategory)));
}

