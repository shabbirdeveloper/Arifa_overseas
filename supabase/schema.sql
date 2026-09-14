-- ============================================================================
-- Arifa Overseas — database schema
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: every statement is guarded.
-- ============================================================================

-- ── helpers ─────────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Who is allowed to write. Membership of this table is the ONLY thing that
-- grants write access; being signed in is not enough.
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- Used by every write policy below. SECURITY DEFINER so the check itself is
-- not subject to admin_users' own RLS (which would recurse).
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- ── team members ────────────────────────────────────────────────────────────

create table if not exists public.team_members (
  id           uuid primary key default gen_random_uuid(),
  name         text not null check (char_length(name) between 2 and 160),
  role         text not null check (char_length(role) between 2 and 160),
  bio          text not null default '',
  quote        text not null default '',
  image_url    text,
  image_width  integer,
  image_height integer,
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── featured projects (the image tiles at the top of /projects) ─────────────

create table if not exists public.featured_projects (
  id           uuid primary key default gen_random_uuid(),
  title        text not null check (char_length(title) between 2 and 200),
  category     text not null check (category in ('Construction', 'Manpower', 'Maintenance')),
  description  text not null default '',
  image_url    text not null,
  image_alt    text not null default '',
  image_width  integer,
  image_height integer,
  is_tall      boolean not null default false,
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── project history (the year-grouped record rows) ──────────────────────────

create table if not exists public.project_history_groups (
  id         uuid primary key default gen_random_uuid(),
  badge      text not null,                 -- e.g. '2023' or '🔵 2018–2026'
  title      text not null,                 -- e.g. '2023 Projects'
  style      text not null default 'default'
               check (style in ('default', 'ongoing', 'primary', 'muted')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_history_items (
  id           uuid primary key default gen_random_uuid(),
  group_id     uuid not null references public.project_history_groups (id) on delete cascade,
  num          text not null default '',
  client       text not null,
  value        text not null default '',    -- 'RM 7,000,000' or '🟢 On Going'
  title        text not null,
  scope        text not null default '',
  tags         text[] not null default '{}',
  is_ongoing   boolean not null default false,
  is_highlight boolean not null default false,
  is_mega      boolean not null default false,
  mega_badge   text not null default '',
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists project_history_items_group_idx
  on public.project_history_items (group_id, sort_order);

-- ── jobs ────────────────────────────────────────────────────────────────────

create table if not exists public.jobs (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title           text not null check (char_length(title) between 2 and 160),
  category        text not null check (category in ('engineering', 'skilled', 'general', 'management')),
  category_label  text not null default '',
  location        text not null default 'Johor Bahru, Malaysia',
  employment_type text not null default 'Full Time',
  salary          text not null default '',
  requirements    text[] not null default '{}',
  -- Key into the icon set in src/content/job-icons.tsx. The SVG itself stays
  -- in code: letting an admin store raw SVG would be an XSS vector.
  icon_key        text not null default 'briefcase',
  posted_at       date not null default current_date,
  valid_through   date,
  sort_order      integer not null default 0,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── certificates ────────────────────────────────────────────────────────────

create table if not exists public.certificates (
  id           uuid primary key default gen_random_uuid(),
  name         text not null check (char_length(name) between 2 and 200),
  badge        text not null default '',
  description  text not null default '',
  authority    text not null default '',
  image_url    text not null default '',
  image_width  integer,
  image_height integer,
  -- Key into the icon set in src/content/certificate-icons.tsx. The SVG itself
  -- stays in code: letting an admin store raw SVG would be an XSS vector.
  icon_key     text not null default 'registry',
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── updated_at triggers ─────────────────────────────────────────────────────

do $$
declare
  t text;
begin
  foreach t in array array[
    'team_members', 'featured_projects', 'project_history_groups',
    'project_history_items', 'jobs', 'certificates'
  ]
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t);
  end loop;
end;
$$;

-- ── row level security ──────────────────────────────────────────────────────
-- Read: anyone may read published rows (the public website).
-- Write: only rows in admin_users. Enforced by the database, so a stolen anon
-- key still cannot write anything.

alter table public.admin_users            enable row level security;
alter table public.team_members           enable row level security;
alter table public.featured_projects      enable row level security;
alter table public.project_history_groups enable row level security;
alter table public.project_history_items  enable row level security;
alter table public.jobs                   enable row level security;
alter table public.certificates           enable row level security;

-- admin_users: an admin may see the list; nobody may modify it from the app.
-- Add and remove admins in the Supabase dashboard.
drop policy if exists "admins read admin_users" on public.admin_users;
create policy "admins read admin_users"
  on public.admin_users for select
  using (public.is_admin());

do $$
declare
  t text;
begin
  foreach t in array array[
    'team_members', 'featured_projects', 'project_history_items', 'jobs',
    'certificates'
  ]
  loop
    execute format('drop policy if exists "public reads published" on public.%I', t);
    execute format(
      'create policy "public reads published" on public.%I
         for select using (is_published = true or public.is_admin())', t);

    execute format('drop policy if exists "admins insert" on public.%I', t);
    execute format(
      'create policy "admins insert" on public.%I
         for insert with check (public.is_admin())', t);

    execute format('drop policy if exists "admins update" on public.%I', t);
    execute format(
      'create policy "admins update" on public.%I
         for update using (public.is_admin()) with check (public.is_admin())', t);

    execute format('drop policy if exists "admins delete" on public.%I', t);
    execute format(
      'create policy "admins delete" on public.%I
         for delete using (public.is_admin())', t);
  end loop;
end;
$$;

-- Groups have no is_published column — they are always readable.
drop policy if exists "public reads groups" on public.project_history_groups;
create policy "public reads groups"
  on public.project_history_groups for select using (true);

drop policy if exists "admins insert groups" on public.project_history_groups;
create policy "admins insert groups"
  on public.project_history_groups for insert with check (public.is_admin());

drop policy if exists "admins update groups" on public.project_history_groups;
create policy "admins update groups"
  on public.project_history_groups for update
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete groups" on public.project_history_groups;
create policy "admins delete groups"
  on public.project_history_groups for delete using (public.is_admin());

-- ── storage ─────────────────────────────────────────────────────────────────
-- Public bucket for team photos and project images: world-readable (the site
-- serves them), admin-only writable.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images', 'site-images', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "site images are public" on storage.objects;
create policy "site images are public"
  on storage.objects for select
  using (bucket_id = 'site-images');

drop policy if exists "admins upload site images" on storage.objects;
create policy "admins upload site images"
  on storage.objects for insert
  with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "admins update site images" on storage.objects;
create policy "admins update site images"
  on storage.objects for update
  using (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "admins delete site images" on storage.objects;
create policy "admins delete site images"
  on storage.objects for delete
  using (bucket_id = 'site-images' and public.is_admin());
