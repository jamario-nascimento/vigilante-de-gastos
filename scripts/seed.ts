import fs from 'node:fs';
import admin from 'firebase-admin';
import dayjs from 'dayjs';

/*
  Seed idempotente para Firestore (coleções: users, categories, budgets)
  Uso:
    ts-node seed.ts --project=PROJECT_ID --user=UID
    ts-node seed.ts --project=PROJECT_ID --email=user@example.com

  Pré-requisitos:
    - GOOGLE_APPLICATION_CREDENTIALS apontando para o key.json da service account.
*/

type Argv = Record<string, string | undefined>;

function parseArgs(): Argv {
  const out: Argv = {};
  for (const arg of process.argv.slice(2)) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) out[match[1]] = match[2];
  }
  return out;
}

const args = parseArgs();

function ensureServiceAccount() {
  const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credentialPath) {
    throw new Error(
      'Defina GOOGLE_APPLICATION_CREDENTIALS apontando para o arquivo key.json da service account.'
    );
  }
  if (!fs.existsSync(credentialPath)) {
    throw new Error(`Arquivo de credencial não encontrado em ${credentialPath}`);
  }
}

function resolveProjectId() {
  return (
    args.project ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GCLOUD_PROJECT ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.VITE_FIREBASE_PROJECT_ID ||
    undefined
  );
}

ensureServiceAccount();
const projectId = resolveProjectId();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId,
  });
}

const db = admin.firestore();

async function resolveUser(): Promise<{ uid: string; email: string }> {
  const uid = args.user;
  const email = args.email;

  if (uid) {
    try {
      const user = await admin.auth().getUser(uid);
      return { uid: user.uid, email: user.email || '' };
    } catch {
      const snap = await db.collection('users').doc(uid).get();
      const data = snap.data() as { email?: string } | undefined;
      return { uid, email: data?.email ?? '' };
    }
  }

  if (email) {
    try {
      const user = await admin.auth().getUserByEmail(email);
      return { uid: user.uid, email: user.email || email };
    } catch {
      const query = await db.collection('users').where('email', '==', email).limit(1).get();
      if (!query.empty) {
        const doc = query.docs[0];
        return { uid: doc.id, email };
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

type DefaultCategory = {
  name: string;
  type: 'expense' | 'income';
  color?: string;
  icon?: string;
};

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

  for (const category of all) {
    const existing = await db
      .collection('categories')
      .where('userId', '==', userId)
      .where('name', '==', category.name)
      .where('type', '==', category.type)
      .limit(1)
      .get();

    if (existing.empty) {
      await db.collection('categories').add({
        userId,
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
        isDefault: true,
        createdAt: now,
        updatedAt: now,
      });
      console.log(`Categoria criada: ${category.type}/${category.name}`);
    } else {
      console.log(`Categoria já existe: ${category.type}/${category.name}`);
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
    console.log(`Projeto: ${projectId || '(default)'} | UID: ${uid} | Email: ${email}`);
    await ensureUserDoc(uid, email);
    await ensureDefaultCategories(uid);
    await ensureBudget(uid);
    console.log('Seed concluído com sucesso.');
    process.exit(0);
  } catch (error) {
    console.error('Falha no seed:', (error as Error).message);
    process.exit(1);
  }
}

main();

