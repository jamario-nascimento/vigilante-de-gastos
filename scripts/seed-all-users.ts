import fs from 'node:fs';
import path from 'node:path';
import admin from 'firebase-admin';
import { runSeedPipeline } from './seed-helpers';

/*
  Seed idempotente para TODOS os usuários presentes na coleção users
  Uso:
    ts-node seed-all-users.ts --project=PROJECT_ID
*/

function parseArgs(): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
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
    throw new Error('Defina GOOGLE_APPLICATION_CREDENTIALS apontando para o arquivo key.json.');
  }

  const candidates = new Set<string>();
  candidates.add(credentialPath);
  if (!path.isAbsolute(credentialPath)) {
    candidates.add(path.resolve(process.cwd(), credentialPath));
    candidates.add(path.resolve(__dirname, credentialPath));
    candidates.add(path.resolve(__dirname, '..', credentialPath));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = candidate;
      return candidate;
    }
  }

  throw new Error(
    `Arquivo de credencial não encontrado. Verifique o caminho configurado em GOOGLE_APPLICATION_CREDENTIALS (${credentialPath}).`
  );
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

async function main() {
  try {
    console.log(`Projeto: ${projectId || '(default)'} | Aplicando seed para todos os usuários`);
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, email: (doc.data() as any)?.email as string ?? '' }));
    for (const user of users) {
      await runSeedPipeline(db, user.id, user.email);
    }
    console.log('Seed concluído para todos os usuários.');
    process.exit(0);
  } catch (error) {
    console.error('Falha no seed-all-users:', (error as Error).message);
    process.exit(1);
  }
}

main();
