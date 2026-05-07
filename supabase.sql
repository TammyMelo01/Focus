create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  subscription jsonb not null,
  created_at timestamp with time zone default now()
);
