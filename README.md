<<<<<<< HEAD
# MicroFocus AI

MVP de assistente com IA para reduzir sobrecarga, quebrar tarefas em microetapas, organizar prioridades, preparar agenda e emitir push.

## Stack

- Next.js + React + TypeScript
- TailwindCSS
- Framer Motion
- Groq API
- Supabase
- Web Push com VAPID
- Links de criação para Google Calendar no MVP

## Como rodar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra: http://localhost:3000

## Groq

1. Crie uma chave no Groq Console.
2. Coloque em `.env.local`:

```bash
GROQ_API_KEY=sua_chave
GROQ_MODEL=llama-3.3-70b-versatile
```

Sem essa chave, o app usa um plano fallback local.

## Supabase

Crie a tabela para salvar inscrições de push:

```sql
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  subscription jsonb not null,
  created_at timestamp with time zone default now()
);
```

Depois configure:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

## Push

Gere as chaves VAPID:

```bash
npx web-push generate-vapid-keys
```

Coloque no `.env.local`:

```bash
NEXT_PUBLIC_VAPID_PUBLIC_KEY=sua_public_key
VAPID_PRIVATE_KEY=sua_private_key
VAPID_EMAIL=mailto:voce@exemplo.com
```

## Google Agenda

Neste MVP, o app gera links prontos para adicionar eventos no Google Agenda.

Próxima evolução: implementar OAuth completo com Google Calendar API para criar eventos automaticamente sem o usuário clicar em cada link.

## Deploy grátis

### Vercel

1. Suba este projeto no GitHub.
2. Importe na Vercel.
3. Copie as variáveis do `.env.local` para Environment Variables.
4. Deploy.

### Supabase

Use o plano gratuito para banco e autenticação.

## Próximas melhorias

- Login com Google.
- OAuth completo do Google Calendar.
- Cron para lembretes de pausa.
- Detecção de hiperfoco por tempo sem check-in.
- Reorganização automática do dia quando uma tarefa atrasa.
- Perfil de energia: manhã, tarde, noite.
=======
# Focus
AI assistant that breaks tasks into microsteps, organizes priorities, schedules activities in Google Calendar, and helps reduce cognitive overload.
>>>>>>> a71fc2400b47ca05febf67d46e6ba4fa66002ffc
