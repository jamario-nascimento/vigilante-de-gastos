/*
  Seed idempotente para Firestore (coleções: users, categories, budgets)
  Uso:
    - Com UID:   ts-node seed.ts --project=PROJECT_ID --user=UID
    - Com email: ts-node seed.ts --project=PROJECT_ID --email=user@example.com

  Pré-requisitos:
    - GOOGLE_APPLICATION_CREDENTIALS apontando para key.json (service account)
*/

import admin from 'firebase-admin';
import dayjs from 'dayjs';

type Argv = Record<string, string | undefined>;

function parseArgs(): Argv {
  const out: Argv = {};
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

const args = parseArgs();
const projectId = args.project || process.env.GCLOUD_PROJECT;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId,
  });
}

const db = admin.firestore();

async function resolveUser(): Promise<{ uid: string; email: string }>{
  const uid = args.user;
  const email = args.email;

  if (uid) {
    try {
      const u = await admin.auth().getUser(uid);
      return { uid: u.uid, email: u.email || '' };
    } catch {
      // fallback: tentar em users/{uid}
      const snap = await db.collection('users').doc(uid).get();
      const data = snap.data() as any;
      return { uid, email: (data?.email as string) || '' };
    }
  }
  if (email) {
    try {
      const u = await admin.auth().getUserByEmail(email);
      return { uid: u.uid, email: u.email || email };
    } catch {
      // fallback: buscar na coleção users
      const q = await db.collection('users').where('email', '==', email).limit(1).get();
      if (!q.empty) {
        const d = q.docs[0];
        return { uid: d.id, email };
      }
      throw new Error('Usuário não encontrado por email');
    }
  }
  throw new Error('Informe --user=UID ou --email=EMAIL');
}

async function ensureUserDoc(uid: string, email: string) {
  const ref = db.collection('users').doc(uid);
  const snap = await ref.get();
  const now = admin.firestore.FieldValue.serverTimestamp();
  if (!snap.exists) {
    await ref.set({
      email,
      role: 'viewer',
      createdAt: now,
      updatedAt: now,
    });
    console.log(`users/${uid} criado.`);
  } else {
    await ref.set({ updatedAt: now }, { merge: true });
    console.log(`users/${uid} já existia (atualizado).`);
  }
}

type DefaultCategory = { name: string; type: 'expense' | 'income'; color?: string; icon?: string };
const defaultExpense: DefaultCategory[] = [
  { name: 'Alimentação', type: 'expense', color: '#ef4444', icon: 'utensils' },
  { name: 'Moradia', type: 'expense', color: '#3b82f6', icon: 'home' },
  { name: 'Transporte', type: 'expense', color: '#10b981', icon: 'car' },
];
const defaultIncome: DefaultCategory[] = [
  { name: 'Salário', type: 'income', color: '#22c55e', icon: 'wallet' },
  { name: 'Freelance', type: 'income', color: '#a78bfa', icon: 'briefcase' },
];

async function ensureDefaultCategories(userId: string) {
  const all = [...defaultExpense, ...defaultIncome];
  const now = admin.firestore.FieldValue.serverTimestamp();
  for (const c of all) {
    const q = await db
      .collection('categories')
      .where('userId', '==', userId)
      .where('name', '==', c.name)
      .where('type', '==', c.type)
      .limit(1)
      .get();
    if (q.empty) {
      await db.collection('categories').add({
        userId,
        name: c.name,
        type: c.type,
        color: c.color,
        icon: c.icon,
        isDefault: true,
        createdAt: now,
        updatedAt: now,
      });
      console.log(`Categoria criada: ${c.type}/${c.name}`);
    } else {
      console.log(`Categoria já existe: ${c.type}/${c.name}`);
    }
  }
}

async function ensureBudget(userId: string, month?: string) {
  const m = month || dayjs().utc().format('YYYY-MM');
  const id = `${userId}-${m}`;
  const ref = db.collection('budgets').doc(id);
  const snap = await ref.get();
  const now = admin.firestore.FieldValue.serverTimestamp();
  if (!snap.exists) {
    await ref.set({
      userId,
      month: m,
      amount: 0,
      categories: [],
      spent: 0,
      alerts: { threshold: 0.8 },
      createdAt: now,
      updatedAt: now,
    });
    console.log(`Budget criado para ${m}.`);
  } else {
    console.log(`Budget ${m} já existia.`);
  }
}

async function main() {
  try {
    const { uid, email } = await resolveUser();
    console.log(`Projeto: ${projectId || '(default)'} | UID: ${uid} | email: ${email}`);
    await ensureUserDoc(uid, email);
    await ensureDefaultCategories(uid);
    await ensureBudget(uid);
    console.log('Seed concluído com sucesso.');
    process.exit(0);
  } catch (e: any) {
    console.error('Falha no seed:', e?.message || e);
    process.exit(1);
  }
}

main();

