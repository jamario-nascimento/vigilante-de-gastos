import admin from 'firebase-admin';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
export type Firestore = FirebaseFirestore.Firestore;

const { FieldValue, Timestamp } = admin.firestore;

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

const defaultClients = [
  {
    idSuffix: 'alpha-tech',
    name: 'Alpha Tech',
    service: 'Desenvolvimento de dashboard',
    value: 4500,
    status: 'active',
    notes: 'Contrato mensal com entregas quinzenais.',
  },
  {
    idSuffix: 'beta-edu',
    name: 'Beta Educação',
    service: 'Consultoria financeira',
    value: 2200,
    status: 'paused',
    notes: 'Revisar escopo trimestral.',
  },
];

const defaultInvestments = [
  {
    idSuffix: 'cdb',
    name: 'CDB Liquidez Diária',
    type: 'fixed-income',
    amount: 8000,
    profitability: 0.93,
    institution: 'Banco Azul',
  },
  {
    idSuffix: 'etf',
    name: 'ETF Tech Global',
    type: 'variable-income',
    amount: 3200,
    profitability: 0.18,
    institution: 'Corretora Prisma',
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function categoryKey(type: 'expense' | 'income', name: string) {
  return `${type}:${name.toLowerCase()}`;
}

function categoryDocId(userId: string, category: DefaultCategory) {
  return `${userId}-${category.type}-${slugify(category.name)}`;
}

export async function ensureUserDoc(db: Firestore, uid: string, email: string) {
  const ref = db.collection('users').doc(uid);
  const snap = await ref.get();
  const now = FieldValue.serverTimestamp();

  if (!snap.exists) {
    await ref.set({
      email,
      role: 'viewer',
      status: 'approved',
      createdAt: now,
      updatedAt: now,
    });
    console.log(`users/${uid} criado.`);
  } else {
    await ref.set({ updatedAt: now }, { merge: true });
    if (!snap.get('status')) {
      await ref.set({ status: 'approved' }, { merge: true });
    }
    console.log(`users/${uid} já existia (atualizado).`);
  }
}

export async function ensureDefaultCategories(db: Firestore, userId: string) {
  const now = FieldValue.serverTimestamp();
  const categories = [...defaultExpense, ...defaultIncome];
  const map: Record<string, string> = {};

  for (const category of categories) {
    const docId = categoryDocId(userId, category);
    const ref = db.collection('categories').doc(docId);
    const snap = await ref.get();
    if (!snap.exists) {
      await ref.set({
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
    }
    map[categoryKey(category.type, category.name)] = docId;
  }

  return map;
}

export async function ensureBudget(db: Firestore, userId: string, month?: string) {
  const m = month || dayjs().utc().format('YYYY-MM');
  const id = `${userId}-${m}`;
  const ref = db.collection('budgets').doc(id);
  const snap = await ref.get();
  const now = FieldValue.serverTimestamp();

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

export async function ensureSampleTransactions(
  db: Firestore,
  userId: string,
  categoryMap: Record<string, string>
) {
  const samples = [
    {
      idSuffix: 'salary-month',
      type: 'income' as const,
      amount: 6500,
      categoryKey: categoryKey('income', 'Salário'),
      description: 'Salário mensal',
      paymentMethod: 'transfer',
      tags: ['mensal'],
      date: dayjs().startOf('month').add(1, 'day'),
    },
    {
      idSuffix: 'groceries',
      type: 'expense' as const,
      amount: 780,
      categoryKey: categoryKey('expense', 'Alimentação'),
      description: 'Compras de supermercado',
      paymentMethod: 'credit-card',
      tags: ['família'],
      date: dayjs().subtract(5, 'day'),
    },
    {
      idSuffix: 'transport-app',
      type: 'expense' as const,
      amount: 120,
      categoryKey: categoryKey('expense', 'Transporte'),
      description: 'Aplicativo de transporte',
      paymentMethod: 'debit-card',
      tags: ['uber'],
      date: dayjs().subtract(2, 'day'),
    },
  ];

  for (const tx of samples) {
    const docId = `${userId}-${tx.idSuffix}`;
    const ref = db.collection('transactions').doc(docId);
    const snap = await ref.get();
    if (snap.exists) continue;

    const categoryId = categoryMap[tx.categoryKey];
    if (!categoryId) {
      console.warn(`Categoria não encontrada para transação ${tx.idSuffix}`);
      continue;
    }

    await ref.set({
      userId,
      type: tx.type,
      amount: tx.amount,
      categoryId,
      description: tx.description,
      paymentMethod: tx.paymentMethod,
      tags: tx.tags,
      date: Timestamp.fromDate(tx.date.toDate()),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`Transação criada: ${docId}`);
  }
}

export async function ensureClients(db: Firestore, userId: string) {
  const now = FieldValue.serverTimestamp();
  for (const client of defaultClients) {
    const docId = `${userId}-${client.idSuffix}`;
    const ref = db.collection('clients').doc(docId);
    const snap = await ref.get();
    if (!snap.exists) {
      await ref.set({
        userId,
        name: client.name,
        service: client.service,
        monthlyValue: client.value,
        status: client.status,
        notes: client.notes,
        createdAt: now,
        updatedAt: now,
      });
      console.log(`Cliente criado: ${client.name}`);
    }
  }
}

export async function ensureInvestments(db: Firestore, userId: string) {
  const now = FieldValue.serverTimestamp();
  for (const investment of defaultInvestments) {
    const docId = `${userId}-${investment.idSuffix}`;
    const ref = db.collection('investments').doc(docId);
    const snap = await ref.get();
    if (!snap.exists) {
      await ref.set({
        userId,
        name: investment.name,
        type: investment.type,
        amount: investment.amount,
        profitability: investment.profitability,
        institution: investment.institution,
        createdAt: now,
        updatedAt: now,
      });
      console.log(`Investimento criado: ${investment.name}`);
    }
  }
}

export async function runSeedPipeline(db: Firestore, userId: string, email: string) {
  await ensureUserDoc(db, userId, email);
  const categoryMap = await ensureDefaultCategories(db, userId);
  await ensureBudget(db, userId);
  await ensureSampleTransactions(db, userId, categoryMap);
  await ensureClients(db, userId);
  await ensureInvestments(db, userId);
}

