-- ============================================================================
-- Arifa Overseas — certificates
--
-- Run this ONCE in the Supabase SQL editor if you already ran schema.sql
-- before certificates existed. It is idempotent: table, trigger and policies
-- are all create-if-missing / replace, and the seed only runs when the table
-- is still empty, so re-running it never overwrites your edits.
--
-- (schema.sql now contains the same table and policies, so a fresh project
-- does not need this file.)
-- ============================================================================

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

drop trigger if exists set_updated_at on public.certificates;
create trigger set_updated_at before update on public.certificates
  for each row execute function public.set_updated_at();

alter table public.certificates enable row level security;

drop policy if exists "public reads published" on public.certificates;
create policy "public reads published"
  on public.certificates for select
  using (is_published = true or public.is_admin());

drop policy if exists "admins insert" on public.certificates;
create policy "admins insert"
  on public.certificates for insert with check (public.is_admin());

drop policy if exists "admins update" on public.certificates;
create policy "admins update"
  on public.certificates for update
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete" on public.certificates;
create policy "admins delete"
  on public.certificates for delete using (public.is_admin());

-- ── seed (only into an empty table) ─────────────────────────────────────────
-- The seven certificates that are on the site today. The images already live
-- in the repo under public/certificates/, so no re-upload is needed.

insert into public.certificates
  (name, badge, description, authority, image_url, image_width, image_height, icon_key, sort_order)
select *
from (values
  ('SSM Business Registration', 'Registered',
   'Company registration under Akta Syarikat 2016. Arifa Overseas Sdn. Bhd. — 201701040990 (1255163-T).',
   'Suruhanjaya Syarikat Malaysia (SSM)',
   '/certificates/ssm-business-registration.png', 1200, 1697, 'registry', 0),
  ('Ministry of Finance (MOF)', 'Registered',
   'Registered with the Ministry of Finance Malaysia. Sijil Akuan Pendaftaran for Arifa Overseas Sdn Bhd, Pasir Gudang, Johor.',
   'Kementerian Kewangan Malaysia',
   '/certificates/ministry-of-finance-mof.png', 1200, 1697, 'money', 1),
  ('CIDB Malaysia', 'Registered',
   'Perakuan Pendaftaran CIDB No. 0120210729-JH079229. Arifa Overseas Sdn Bhd, Johor Bahru. G7 B04, G7 CE21, G7 ME M15.',
   'Construction Industry Development Board',
   '/certificates/cidb-malaysia.png', 1200, 1697, 'building', 2),
  ('JCC Johor — Sijil Kontraktor', 'Certified',
   'Sijil Kontraktor Johor — Arifa Overseas Sdn Bhd, Johor Bahru. Gred G7, Categories B, CE, ME.',
   'Johor for Construction Development (JCC)',
   '/certificates/jcc-johor-sijil-kontraktor.png', 1200, 1697, 'shield-check', 3),
  ('NIOSH / DOSH Safety Certificate', 'Compliant',
   'DOSH/NIOSH Safety Verification — Arifa Overseas Sdn Bhd. Valid 06 November 2023 (3 Years).',
   'National Institute of Occupational Safety & Health',
   '/certificates/niosh-dosh-safety-certificate.png', 1200, 1697, 'safety', 4),
  ('ISO 9001:2015 Certified', 'Certified',
   'Quality Management System certified to ISO 9001:2015. Cert No: 24052S016001. Valid: 25 May 2024 – 24 May 2027.',
   'TNV System Certification — ISO 9001:2015',
   '/certificates/iso-9001-2015-certified.png', 1200, 1697, 'clipboard-check', 5),
  ('FGV Holdings — Vendor Registration', 'Registered',
   'Vendor Registration Declaration. Ref: NB-200520240028-02. Valid: 20/05/2024 – 20/05/2027.',
   'FGV Holdings Berhad',
   '/certificates/fgv-holdings-vendor-registration.png', 1200, 1697, 'info', 6)
) as seed
where not exists (select 1 from public.certificates);
