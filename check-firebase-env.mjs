#!/usr/bin/env node
// Verifica se há um PROJECT_ID configurado no .env antes do setup do Firebase.
// Uso: node check-firebase-env.mjs --env=.env.local

import { readFileSync, existsSync } from 'node:fs';
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
    console.error(
      '\n[firebase:setup] Projeto não configurado.\n' +
      'Defina uma das variáveis abaixo no seu .env.local (raiz):\n' +
      '  - FIREBASE_PROJECT_ID (recomendado)\n' +
      '  - GCLOUD_PROJECT ou GOOGLE_CLOUD_PROJECT\n' +
      '  - VITE_FIREBASE_PROJECT_ID (fallback)\n\n' +
      'Exemplo:\n' +
      '  FIREBASE_PROJECT_ID=meu-projeto\n\n' +
      'Depois rode: npm run configure:firebase\n'
    );
    process.exit(1);
  }
  console.log(`[firebase:setup] Projeto detectado: ${projectId}${usedPath ? ` (origem: ${usedPath})` : ''}`);
}

main();

