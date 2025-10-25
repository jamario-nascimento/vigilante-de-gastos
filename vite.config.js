/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// ✅ Configuração limpa e compatível com React 19 + TypeScript
export default defineConfig({
  plugins: [
    react({
      babel: {
        // 🔧 Corrige o problema dos tipos implícitos do Babel (_core, _traverse etc)
        parserOpts: { plugins: ['typescript', 'jsx'] },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // ⚡ Otimização recomendada para builds mais rápidos e TS moderno
  esbuild: {
    jsx: 'automatic',
  },
})
