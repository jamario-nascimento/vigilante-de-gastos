/*
  Popula .firebaserc com o ID do projeto lido do .env
  Uso:
    - ts-node set-firebaserc.ts --env=../.env.local
    - ts-node set-firebaserc.ts            (tenta ../.env.local, depois ../.env)
*/

import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

function parseArgs() {
  const out: Record<string, string | undefined> = {};
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

function loadEnv(custom?: string) {
  const candidates = [
    custom,
    path.resolve(__dirname, '../.env.local'),
    path.resolve(__dirname, '../.env'),
  ].filter(Boolean) as string[];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      dotenv.config({ path: p });
      return p;
    }
  }
  return undefined;
}

function getProjectId(): string | undefined {
  // Preferir variável específica de backend
  return (
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GCLOUD_PROJECT ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    // fallback para client-side se o usuário optar por expor
    process.env.VITE_FIREBASE_PROJECT_ID
  );
}

function writeFirebaserc(projectId: string) {
  const target = path.resolve(__dirname, '../.firebaserc');
  const payload = { projects: { default: projectId } } as const;
  fs.writeFileSync(target, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  return target;
}

async function main() {
  const args = parseArgs();
  const used = loadEnv(args.env);
  const projectId = getProjectId();
  if (!projectId) {
    throw new Error(
      'Não foi possível determinar o PROJECT_ID. Defina FIREBASE_PROJECT_ID (ou GCLOUD_PROJECT/VITE_FIREBASE_PROJECT_ID) no .env.'
    );
  }
  const file = writeFirebaserc(projectId);
  console.log(`.firebaserc atualizado para projeto: ${projectId}`);
  if (used) console.log(`Variáveis carregadas de: ${used}`);
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});

