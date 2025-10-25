/*
  Seed idempotente para TODOS os usuários presentes na coleção users
  Uso:
    ts-node seed-all-users.ts --project=PROJECT_ID
*/

import admin from 'firebase-admin';
import dayjs from 'dayjs';

function parseArgs(): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
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

async function ensureDefaultCategories(userId: string) {
  const now = admin.firestore.FieldValue.serverTimestamp();
  const defaults = [
    { name: 'Alimentação', type: 'expense' as const },
    { name: 'Moradia', type: 'expense' as const },
    { name: 'Transporte', type: 'expense' as const },
    { name: 'Salário', type: 'income' as const },
    { name: 'Freelance', type: 'income' as const },
  ];
  for (const c of defaults) {
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
        isDefault: true,
        createdAt: now,
        updatedAt: now,
      });
      console.log(`[${userId}] categoria criada: ${c.type}/${c.name}`);
    }
  }
}

async function ensureBudget(userId: string) {
  const m = dayjs().utc().format('YYYY-MM');
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
    console.log(`[${userId}] budget criado para ${m}`);
  }
}

async function main() {
  try {
    console.log(`Projeto: ${projectId || '(default)'} | Seed para todos os usuários`);
    const usersSnap = await db.collection('users').get();
    const users = usersSnap.docs.map((d) => ({ id: d.id, email: (d.data() as any)?.email as string | undefined }));
    for (const u of users) {
      await ensureDefaultCategories(u.id);
      await ensureBudget(u.id);
    }
    console.log('Seed concluído para todos os usuários.');
    process.exit(0);
  } catch (e: any) {
    console.error('Falha no seed-all-users:', e?.message || e);
    process.exit(1);
  }
}

main();

