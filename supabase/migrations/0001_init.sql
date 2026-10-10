-- Diorfy: schema inicial do Supabase
-- Rode este arquivo no SQL Editor do painel do Supabase (ou com `supabase db push`).

-- ---------- Perfis de usuário ----------
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text not null,
  name          text not null check (char_length(name) <= 100),
  avatar        text,
  company       text,
  plan          text not null default 'pro' check (plan in ('free', 'pro', 'team')),
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly', 'annual')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: ler o próprio" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: criar o próprio" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles: editar o próprio" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- ---------- Quadros ----------
-- O quadro inteiro (elementos, frames, comentários, viewState...) fica em `data` (jsonb).
-- A chave é (owner_id, id) porque os quadros de exemplo têm o mesmo id para todo usuário.
create table if not exists public.boards (
  owner_id   uuid not null references auth.users (id) on delete cascade,
  id         text not null check (char_length(id) between 1 and 128),
  title      text not null default 'Sem título' check (char_length(title) <= 200),
  data       jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (owner_id, id)
);

create index if not exists boards_owner_updated_idx on public.boards (owner_id, updated_at desc);

alter table public.boards enable row level security;

create policy "boards: ler os próprios" on public.boards
  for select using (auth.uid() = owner_id);
create policy "boards: criar os próprios" on public.boards
  for insert with check (auth.uid() = owner_id);
create policy "boards: editar os próprios" on public.boards
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "boards: apagar os próprios" on public.boards
  for delete using (auth.uid() = owner_id);

-- Atualizações em tempo real no dashboard
alter publication supabase_realtime add table public.boards;
