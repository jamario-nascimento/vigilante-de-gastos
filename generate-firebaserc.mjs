#!/usr/bin/env node
// Gera .firebaserc com base em variáveis do .env
// Uso: node generate-firebaserc.mjs --env=.env.local

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function parseArgs() {
  const out = {};
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

function parseDotenv(text) {
  const env = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

function loadEnv(customPath) {
  const candidates = [customPath, '.env.local', '.env']
    .filter(Boolean)
    .map((p) => resolve(process.cwd(), p));
  for (const p of candidates) {
    if (existsSync(p)) {
      const txt = readFileSync(p, 'utf8');
      return { path: p, env: parseDotenv(txt) };
    }
  }
  return { path: undefined, env: {} };
}

function main() {
  const args = parseArgs();
  const { path: usedPath, env } = loadEnv(args.env);
  const projectId = env.FIREBASE_PROJECT_ID || env.GCLOUD_PROJECT || env.GOOGLE_CLOUD_PROJECT || env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.error('Não foi possível determinar o PROJECT_ID. Defina FIREBASE_PROJECT_ID (ou GCLOUD_PROJECT/GOOGLE_CLOUD_PROJECT/VITE_FIREBASE_PROJECT_ID) no .env.');
    process.exit(1);
  }
  const payload = { projects: { default: projectId } };
  writeFileSync(resolve(process.cwd(), '.firebaserc'), JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`.firebaserc atualizado com projeto: ${projectId}${usedPath ? ` (origem: ${usedPath})` : ''}`);
}

main();

