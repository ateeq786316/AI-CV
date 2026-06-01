-- AI CV Enhancer — initial schema (see plan.md)

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.user_api_keys (
  user_id uuid primary key references auth.users(id) on delete cascade,
  provider text not null default 'gemini',
  encrypted_key text not null,
  key_hint text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.master_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  schema_version int not null default 1,
  data jsonb not null,
  extraction_source text check (extraction_source in ('pdf', 'paste', 'manual', 'latex-import')),
  completeness_score int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id)
);

create table public.cv_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  mime_type text,
  created_at timestamptz default now()
);

create table public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  master_profile_id uuid not null references public.master_profiles(id),
  job_title text,
  job_description text not null,
  optimization_mode text not null default 'balanced',
  fallback_profile text,
  status text not null default 'draft'
    check (status in ('draft', 'optimizing', 'validated', 'preview', 'compiled', 'failed')),
  optimized_data jsonb,
  cover_letter text,
  validation_errors jsonb,
  latex_path text,
  pdf_storage_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.usage_events (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  generation_id uuid references public.generations(id),
  used_platform_key boolean default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.user_api_keys enable row level security;
alter table public.master_profiles enable row level security;
alter table public.cv_uploads enable row level security;
alter table public.generations enable row level security;
alter table public.usage_events enable row level security;

create policy "own profile" on public.profiles for all using (auth.uid() = id);
create policy "own api key" on public.user_api_keys for all using (auth.uid() = user_id);
create policy "own master" on public.master_profiles for all using (auth.uid() = user_id);
create policy "own uploads" on public.cv_uploads for all using (auth.uid() = user_id);
create policy "own generations" on public.generations for all using (auth.uid() = user_id);
create policy "own usage" on public.usage_events for select using (auth.uid() = user_id);
