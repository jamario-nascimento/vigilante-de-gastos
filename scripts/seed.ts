import fs from 'node:fs';
import admin from 'firebase-admin';
import { runSeedPipeline } from './seed-helpers';

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
    throw new Error('Defina GOOGLE_APPLICATION_CREDENTIALS apontando para o arquivo key.json.');
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

async function main() {
  try {
    const { uid, email } = await resolveUser();
    console.log(`Projeto: ${projectId || '(default)'} | UID: ${uid} | Email: ${email}`);
    await runSeedPipeline(db, uid, email);
    console.log('Seed concluído com sucesso.');
    process.exit(0);
  } catch (error) {
    console.error('Falha no seed:', (error as Error).message);
    process.exit(1);
  }
}

main();

