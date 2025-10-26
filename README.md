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
   - `VITE_FIREBASE_MEASUREMENT_ID` (opcional, usado para Analytics)
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
<!-- Etapa: Autenticação/Autorização - OBSERVAÇÃO: `users` agora possui campo `status` (pending | approved | rejected); ProtectedRoute/Login bloqueiam perfis não aprovados. -->
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

- Setup completo via script (gera .firebaserc e faz deploy de regras/índices):
  - Pré-requisitos:
    - CLI do Firebase instalada: `npm i -g firebase-tools`
    - Autenticação: `firebase login`
  - Execução: `npm run firebase:setup`
    - O comando valida se o `.env.local` contém `FIREBASE_PROJECT_ID` (ou `GCLOUD_PROJECT`/`GOOGLE_CLOUD_PROJECT`/`VITE_FIREBASE_PROJECT_ID`).
    - Em caso de ausência, exibirá uma mensagem amigável e abortará o processo.
  - Alternativas:
    - Deploy só das regras: `npm run firebase:deploy:rules`
    - Deploy só dos índices: `npm run firebase:deploy:indexes`

### Autenticação manual via Firebase CLI

1. Login: `firebase login` (abre o navegador; use a conta com acesso ao projeto `vigilante-de-gastos`).
2. Listar projetos: `firebase projects:list`
3. Definir projeto ativo: `firebase use vigilante-de-gastos`
4. Rodar setup (ou comandos individuais) conforme descrito acima.
- Rodar seed para um usuário (scripts):
  - `cd scripts && npm install`
  - PowerShell: `$Env:GOOGLE_APPLICATION_CREDENTIALS="C:\\caminho\\key.json"`
  - Por UID: `npx ts-node seed.ts --project=SEU_PROJECT_ID --user=SEU_UID`
  - Por e-mail: `npx ts-node seed.ts --project=SEU_PROJECT_ID --email=seu@email.com`
- Seed para todos os usuários: `npx ts-node seed-all-users.ts --project=SEU_PROJECT_ID`

Observação: O repositório já contém `firebase.json` e `firestore.rules`/`firestore.indexes.json`. Você pode fazer deploy via CLI ou colar o conteúdo manualmente no Console do Firebase.

# 🧩 Estrutura Geral

Aplicação para controle financeiro com foco em:
- Gastos e recebimentos (com rastreio por mês e categoria)
- Faturas futuras (parcelamento inteligente)
- Entradas recorrentes e avisos de renovação (clientes, hospedagem, etc.)
- Controle de investimentos
- Multiusuário com aprovação manual de novos cadastros

---

# ✅ ETAPA 1: Autenticação e Controle de Acesso (JÁ CONCLUÍDA)

- [x] Login via Firebase Auth (Email/senha e GitHub)
- [x] Proteção de rotas com `<ProtectedRoute />`
- [x] Contexto de usuário (`AuthContext`)
- [x] Collection `users` com controle de `role` (`admin` ou `viewer`)
- [x] Seeder cria usuário no Firestore na primeira entrada
- [x] Painel bloqueado para não autorizados

📌 **Próxima ação:** garantir que `role !== 'admin'` bloqueia acesso às rotas administrativas.

---

# 🧭 ETAPA 2: Sistema de Aprovação de Usuários

- [ ] Página (admin) com lista de usuários pendentes
- [ ] Botão para aprovar ou negar novos cadastros
- [ ] Campo adicional: `status: "pending" | "approved" | "rejected"`
- [ ] Bloqueio de acesso para `status !== "approved"` mesmo que o login seja válido

📁 Firestore:
```ts
users/{uid}: {
  email: string,
  role: "admin" | "viewer",
  status: "approved" | "pending" | "rejected",
  createdAt, updatedAt
}
💳 ETAPA 3: Transações (Receitas e Despesas)

 Modelar Firestore transactions

 CRUD de transações:

Valor

Tipo: "income" ou "expense"

Categoria

Parcelado? (quantas parcelas e valor por mês)

Forma de pagamento (dinheiro, cartão, etc.)

Tags, descrição, data

 Layout de tabela (TanStack Table)

 Filtros por mês, categoria, tipo

 Recalcular total mensal e fatura do cartão

📁 Firestore:
```
transactions/{id}: {
  userId,
  amount,
  type,
  categoryId,
  date,
  isInstallment,
  installmentsCount,
  description,
  paymentMethod,
  createdAt,
  updatedAt
}
```
🗂️ ETAPA 4: Categorias de Transação

 Listagem e CRUD de categorias

 Categorias padrão por tipo (income, expense)

 Cores, ícones e campo isDefault

 Seeder inclui categorias padrão

📁 Firestore:

``` 
categories/{id}: {
  userId,
  name,
  type,
  icon,
  color,
  isDefault,
  createdAt,
  updatedAt
}
```

📅 ETAPA 5: Planejamento Financeiro e Orçamento

 Tela de orçamentos mensais

 Campo: mês, valor limite, por categoria

 Gatilhos visuais para alertar quando ultrapassar

 Relatório visual com Recharts (pizza, barra)

📁 Firestore:

```budgets/{id}: {
  userId,
  month: 'YYYY-MM',
  amount,
  categories: [{ categoryId, limit }],
  alerts: { threshold },
  createdAt,
  updatedAt
}
 ```

 🧾 ETAPA 6: Controle de Clientes e Serviços

 CRUD de clientes

 Lançar contratos/serviços com data de renovação

 Parcelas e aviso de vencimento

 Notificação (via toast/email) próxima da renovação

📁 Firestore (exemplo):

```clients/{id}: {
  name,
  email,
  services: [
    {
      name,
      startDate,
      endDate,
      amount,
      installments,
      nextDueDate
    }
  ],
  createdAt,
  updatedAt
}
```

📈 ETAPA 7: Investimentos

 CRUD de investimentos

 Tipo (ação, fundo, crypto)

 Valor investido, data, retorno

 Relatório gráfico (linha ou barra)

📁 Firestore:
```
investments/{id}: {
  userId,
  type,
  name,
  amount,
  date,
  returnRate,
  createdAt,
  updatedAt
}

```

🧪 ETAPA 8: Qualidade e Testes

 Testes unitários (Vitest)

 Lint e formatação padronizada

 Tratamento de erros amigáveis

 Feedbacks visuais: loading, erro, sucesso

🎯 ETAPA 9: Dashboard Geral

 Cards resumo: saldo atual, gastos do mês, fatura prevista

 Gráficos (pizza, barra, linha)

 Filtros rápidos por período

🔐 ETAPA 10: Segurança e Controle

 Finalizar firestore.rules

 Regras de leitura/escrita por userId e role

 Logs de erro e uso (opcional: Firebase Functions)

⚙️ Scripts e Automação

 seed.ts: cria usuário, categorias e orçamento inicial

 seed-all-users.ts: aplica a todos os usuários existentes

 scan-secrets: busca por vazamentos de segredo

 firebase:setup: valida .env, gera .firebaserc e publica regras/índices

📌 Ordem sugerida de implementação (roadmap de sprints)

✅ Login e autorização

🟡 Aprovação de usuários

🔜 CRUD de transações

🔜 Categorias

🔜 Orçamento mensal

🔜 Clientes e serviços com renovação

🔜 Investimentos

🔜 Dashboard

🔜 Segurança final (rules)

🔜 Qualidade/testes

🧠 Observações finais

Sempre seguir o README.md como plano-mestre

Anotações de melhorias devem ser comentadas por etapa

Evitar tecnologias externas sem leitura da documentação atual

## Autor

Jamal Dev  
Goiás, Brasil  
[GitHub](https://github.com/jamario-nascimento) • [LinkedIn](https://www.linkedin.com/in/jamario-nascimento/)

<p align="center">
  <i>A melhor forma de controlar o futuro é monitorar o presente.</i>
</p>

---

## Segurança e API Key (Firebase)

- Em apps Web, a `VITE_FIREBASE_API_KEY` fica visível no bundle. Isso é esperado no Firebase Web e não concede acesso por si só; a segurança depende das Regras do Firestore e da configuração do Auth.
- Boas práticas:
  - Restrinja a chave no Google Cloud Console a HTTP Referrers (domínios do seu app e `localhost`).
  - Restrinja por API apenas ao necessário (ex.: Identity Toolkit API, conforme o uso do app).
  - Rotacione a chave se tiver sido exposta fora do controle (ex.: commits públicos) e atualize seu `.env.local`.

### Verificação de segredos no código

- Rode o scanner simples (ignora `dist/` e `node_modules`):
  - `npm run scan:secrets`
- Se listar ocorrências, revise os arquivos. Em particular, não versionar `dist/` e evitar colocar chaves diretamente no código-fonte.
