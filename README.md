<h1 align="center">Vigilante de Gastos</h1>

<p align="center">
  <img src="./download.jpg" width="700" alt="Vigilante de Gastos Dashboard" />
  <br/>
  <b>Controle financeiro inteligente com interface moderna, elegante e responsiva.</b><br/>
  <sub>Inspirado em dashboards educacionais com visual escuro, intuitivo e tecnológico.</sub>
</p>

---

## Sobre o Projeto

O Vigilante de Gastos é uma aplicação web para gestão pessoal de finanças.  
Foca em visão analítica, simplicidade de uso e experiência visual imersiva.

---

## Funcionalidades Principais

- Dashboard interativo com visão consolidada de despesas e receitas
- Classificação automática de gastos por categoria
- Histórico detalhado de transações com filtros dinâmicos
- Metas e alertas personalizados
- Autenticação segura (Google, GitHub e E‑mail/Senha)
- Controle de permissões por nível de acesso (Admin / Usuário)

---

## Stack Tecnológica

| Camada           | Tecnologia                                    |
|------------------|-----------------------------------------------|
| Frontend         | React 19 + Vite + TypeScript + Tailwind CSS   |
| UI/UX            | Radix UI + shadcn/ui                          |
| Autenticação     | Firebase Auth (Google, GitHub, E‑mail/Senha)  |
| Banco de Dados   | Firestore                                     |
| Gráficos         | Recharts                                      |
| Infraestrutura   | Firebase Hosting / Vercel                     |

---

## Como Rodar

- Instalar dependências: `npm install`
- Ambiente de desenvolvimento: `npm run dev`
- Build de produção: `npm run build`
- Preview: `npm run preview`

---

## Configuração de Ambiente

1. Copie o arquivo exemplo:
   - Windows PowerShell: `Copy-Item .env.example .env.local`
   - macOS/Linux: `cp .env.example .env.local`
2. Preencha o `.env.local` com as variáveis do SDK Web do Firebase (todas começam com `VITE_`):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
3. Reinicie o servidor de desenvolvimento após alterar o `.env.local`.

---

## Regras do Firestore

O projeto inclui um arquivo `firestore.rules` com as permissões mínimas para a coleção `users`:

- Usuário autenticado lê/atualiza apenas seu próprio documento `users/{uid}`
- Criação exige consistência entre `email` do documento e o `email` do token; `role` ∈ {`viewer`, `admin`}

Como publicar:
- Console Firebase → Firestore Database → Rules → cole o conteúdo de `firestore.rules` → Publique.

---

## Estrutura do Projeto

- `src/auth` — AuthContext, configuração Firebase e rotas protegidas
- `src/pages` — Login, DashboardPage, HomeRedirect
- `src/design-system` — componentes base (Radix + Tailwind)
- `src/lib` — utilitários (ex.: `cn`)

---

## Arquitetura e Padrões

- Alias `@` aponta para `src`
- Dark Mode via classe (Tailwind `darkMode: 'class'`)
- Componentização com Radix/shadcn e utilitário `cn`
- Tratamento de erros de autenticação com mensagens amigáveis na tela de Login
- Segredos via `.env.local` (não versionado); `.env.example` documenta as chaves

---

## Roadmap Técnico

- Fundação: corrigir acentuação, padronizar tipos, remover anotações supérfluas
- Autenticação/Autorização: guardas por `role`, rotas administrativas
- Domínio: `transactions`, `categories`, `budgets` com schemas Zod e adaptadores Firestore
- UI: layout base, cards de resumo, gráficos (Recharts), tabela (TanStack Table)
- Qualidade: lint, mensagens de erro UX‑friendly, testes unitários

---

## Comandos Rápidos

- Publicar regras do Firestore (via CLI): `firebase deploy --only firestore:rules`
- Publicar índices (via CLI): `firebase deploy --only firestore:indexes`
- Configurar projeto padrão da CLI:
  - Edite `.firebaserc` e troque `YOUR_PROJECT_ID` pelo ID real do projeto, ou
  - Use `firebase use YOUR_PROJECT_ID` (grava em `.firebaserc`).

- Gerar `.firebaserc` a partir do `.env` (scripts):
  - `cd scripts && npm install`
  - Defina no `.env.local` (na raiz) `FIREBASE_PROJECT_ID=seu-project-id` (ou `VITE_FIREBASE_PROJECT_ID`/`GCLOUD_PROJECT`)
  - PowerShell: `$Env:GOOGLE_APPLICATION_CREDENTIALS="C:\\caminho\\key.json"`
  - `npx ts-node set-firebaserc.ts --env=../.env.local`

- Gerar `.firebaserc` a partir do `.env` (raiz do projeto):
  - Defina `FIREBASE_PROJECT_ID=seu-project-id` no `.env.local`
  - Rode: `npm run configure:firebase`
- Rodar seed para um usuário (scripts):
  - `cd scripts && npm install`
  - PowerShell: `$Env:GOOGLE_APPLICATION_CREDENTIALS="C:\\caminho\\key.json"`
  - Por UID: `npx ts-node seed.ts --project=SEU_PROJECT_ID --user=SEU_UID`
  - Por e-mail: `npx ts-node seed.ts --project=SEU_PROJECT_ID --email=seu@email.com`
- Seed para todos os usuários: `npx ts-node seed-all-users.ts --project=SEU_PROJECT_ID`

Observação: O repositório já contém `firebase.json` e `firestore.rules`/`firestore.indexes.json`. Você pode fazer deploy via CLI ou colar o conteúdo manualmente no Console do Firebase.

## Autor

Jamal Dev  
Goiás, Brasil  
[GitHub](https://github.com/jamario-nascimento) • [LinkedIn](https://www.linkedin.com/in/jamario-nascimento/)

<p align="center">
  <i>A melhor forma de controlar o futuro é monitorar o presente.</i>
</p>
