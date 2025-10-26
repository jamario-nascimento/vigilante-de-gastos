import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/auth/firebase';
import { normalizeTimestamp, userRecordSchema, type UserRecord, type UserStatus } from '@/types/user';

const usersCollection = collection(db, 'users');

function adaptDoc(docSnap: QueryDocumentSnapshot<DocumentData>): UserRecord {
  return userRecordSchema.parse({
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: normalizeTimestamp(docSnap.data().createdAt),
    updatedAt: normalizeTimestamp(docSnap.data().updatedAt),
  });
}

export async function fetchUsers(): Promise<UserRecord[]> {
  const q = query(usersCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(adaptDoc);
}

export function subscribeUsers(callback: (users: UserRecord[]) => void) {
  const q = query(usersCollection, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(adaptDoc);
    callback(users);
  });
}

export async function updateUserStatus(userId: string, status: UserStatus) {
  const ref = doc(db, 'users', userId);
  await updateDoc(ref, {
    status,
    updatedAt: new Date(),
  });
}

export async function updateUserRole(userId: string, role: string) {
  const ref = doc(db, 'users', userId);
  await updateDoc(ref, {
    role,
    updatedAt: new Date(),
  });
}
