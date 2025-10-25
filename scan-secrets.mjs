#!/usr/bin/env node
// Scan simples por possíveis chaves Google API (padrão AIza...) no código-fonte.
// Uso: node scan-secrets.mjs

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const IGNORES = new Set([
  'node_modules',
  'dist',
  '.git',
  '.vscode',
  '.DS_Store'
]);

const FILE_EXT = new Set([
  '.js','.jsx','.ts','.tsx','.json','.md','.html','.css','.env','.mjs','.cjs'
]);

const GOOGLE_KEY_RE = /AIza[0-9A-Za-z\-_]{35}/g;

function shouldScanFile(name){
  const dot = name.lastIndexOf('.');
  if (dot === -1) return false; // sem extensão
  const ext = name.slice(dot).toLowerCase();
  return FILE_EXT.has(ext);
}

function walk(dir, acc){
  for (const name of readdirSync(dir)){
    if (IGNORES.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (st.isFile() && shouldScanFile(name)) acc.push(p);
  }
}

function main(){
  const files = [];
  walk(process.cwd(), files);
  let found = 0;
  for (const f of files){
    try{
      const txt = readFileSync(f, 'utf8');
      const m = txt.match(GOOGLE_KEY_RE);
      if (m){
        for (const k of m){
          console.error(`[secret-detect] Possível chave Google exposta em: ${f}`);
          found++;
        }
      }
    }catch{}
  }
  if (found){
    console.error(`\nTotal de ocorrências: ${found}`);
    console.error('Observação: a apiKey do Firebase Web pode aparecer no bundle e não é um segredo por si só.');
    process.exit(2);
  }else{
    console.log('OK: Nenhuma chave Google (AIza...) encontrada nos arquivos escaneados.');
  }
}

main();

