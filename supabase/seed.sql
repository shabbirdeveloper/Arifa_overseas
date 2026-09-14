-- ============================================================================
-- Arifa Overseas — seed data
-- Run AFTER schema.sql. This carries the content that was hardcoded in the
-- site into the database, so nothing changes visually when the switch happens.
--
-- Safe to re-run: it clears these tables first. It does NOT touch admin_users.
-- ============================================================================

begin;

truncate table public.project_history_items,
               public.project_history_groups,
               public.featured_projects,
               public.team_members,
               public.jobs
  restart identity cascade;


-- ── team members ───────────────────────────────────────────────

insert into public.team_members (name, role, bio, quote, image_url, image_width, image_height, sort_order) values
  ('MR CH Muhammad Bilal', 'Director', 'With a vision for excellence and a passion for building lasting partnerships, MR CH Muhammad Bilal has led Arifa Overseas from its founding to becoming one of Johor Bahru''s most respected construction and manpower companies.', '"We don''t just build structures — we build relationships, trust, and a legacy of excellence that stands the test of time."', '/images/team/bilal.png', 600, 600, 0),
  ('MR Mohamad Rafi Bin Abu Bakar', 'Business Development Director', 'With hands-on experience managing complex construction and manpower projects across Malaysia, MR Mohamad Rafi Bin Abu Bakar ensures every project is executed with precision, discipline, and attention to the finest details.', '"Every project is a testament to our team''s skill and passion. We ensure every detail is executed with precision and care."', '/images/team/rafi.jpg', 1122, 1402, 1),
  ('MR Muhammad Jamal Ahmed', 'Project Director', 'As Project Director, MR Muhammad Jamal Ahmed oversees the planning, execution, and delivery of every Arifa Overseas project — from site mobilisation to final handover. His rigorous management ensures each project is completed safely, on schedule, within budget, and to the highest standard of quality.', '"A project''s success is decided long before the first brick is laid — in planning, in discipline, and in the people you put on site. Every schedule we commit to, we keep. Every standard we set, we exceed. We deliver every project as if our name is built into its foundation."', '/images/team/jamal.png', 600, 600, 2),
  ('MS Noor Ayesha Binti Muhammad Raziq', 'Human Resources (HR)', 'MS Noor Ayesha Binti Muhammad Raziq leads our human resources — from recruitment and worker welfare to training and compliance. She ensures every member of the Arifa Overseas family is supported, skilled, and ready to serve our clients with excellence.', '"Behind every successful project is a team that feels valued. We take care of our people, so they can take care of our clients."', null, null, null, 3);


-- ── featured projects ──────────────────────────────────────────

insert into public.featured_projects (title, category, description, image_url, image_alt, image_width, image_height, is_tall, sort_order) values
  ('Commercial Complex, JB', 'Construction', 'Multi-storey commercial development with full fit-out. Completed 2023.', 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=800&q=85', 'Commercial Complex', 800, 533, true, 0),
  ('Industrial Plant Staffing', 'Manpower', '80-strong workforce deployed for 12-month contract.', 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=600&q=85', 'Plant Staffing', 600, 400, false, 1),
  ('Tech Park Facility Management', 'Maintenance', 'Ongoing preventive and corrective maintenance contract.', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=85', 'Facility Maintenance', 600, 400, false, 2),
  ('Residential Development', 'Construction', '48-unit residential complex in Johor Bahru.', 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=600&q=85', 'Residential', 600, 400, false, 3),
  ('Welding Crew Deployment', 'Manpower', 'Certified welding team for offshore fabrication project.', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=85', 'Welding Team', 600, 400, false, 4),
  ('Industrial Equipment Service', 'Maintenance', 'Full mechanical and electrical maintenance programme.', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=85', 'Industrial Maintenance', 600, 400, false, 5),
  ('Corporate Office Fit-Out', 'Construction', 'Full interior fit-out for 8-storey corporate HQ.', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=85', 'Office Building', 600, 400, false, 6),
  ('Engineering Team Supply', 'Manpower', 'Civil and structural engineers for 18-month project.', 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&q=85', 'Engineers', 600, 400, false, 7),
  ('Infrastructure Works, Iskandar', 'Construction', 'Road and drainage infrastructure for new township.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85', 'Infrastructure', 600, 400, false, 8);


-- ── project history ────────────────────────────────────────────


with g as (
  insert into public.project_history_groups (badge, title, style, sort_order)
  values ('🔵 2018–2026', 'Current Ongoing Projects', 'ongoing', 0)
  returning id
)
insert into public.project_history_items
  (group_id, num, client, value, title, scope, tags, is_ongoing, is_highlight, is_mega, mega_badge, sort_order)
select g.id, v.* from g, (values
  ('25', 'JIANGSU (Steel Structure) Malaysia', '🟢 On Going', 'Manpower Supply — JABIL / COSMX / AVALON Project', 'Providing manpower supply for Project JABIL / COSMX / AVALON (2025–2026)', array['Manpower', 'Steel Structure', 'On Going']::text[], true, false, false, '', 0),
  ('26', 'Malaysia Marine & Heavy Engineering', '🟢 On Going', 'Oil & Gas Engineering Experts', 'Manpower supply — engineering experts in oil & gas industries (2024–2026)', array['Engineering', 'Oil & Gas', 'On Going']::text[], true, false, false, '', 1),
  ('27', 'PGEO Edible Oils Sdn Bhd', '🟢 On Going', 'Maintenance Team Support', 'Providing manpower supply to assist Maintenance Team (2025–2026)', array['Manpower', 'Maintenance', 'On Going']::text[], true, false, false, '', 2),
  ('28', 'Natural Oleochemical Sdn Bhd', '🟢 On Going', 'Reliability Maintenance Team Support', 'Providing manpower supply to assist Reliability Maintenance Team (2025–2026)', array['Manpower', 'Reliability', 'On Going']::text[], true, false, false, '', 3),
  ('29', 'DCN Holding Sdn Bhd', '🟢 On Going', 'Fire Protection Works — Block C1', 'Work Order for Fire Protection Works — Electrical Service, Block C1 (2025–2026)', array['Electrical', 'Fire Protection', 'On Going']::text[], true, false, false, '', 4),
  ('30', 'Guardseal Solutions Sdn Bhd', '🟢 On Going', 'Manpower Supply', 'Providing manpower supply services (2026)', array['Manpower', '2026', 'On Going']::text[], true, false, false, '', 5)
) as v(num, client, value, title, scope, tags, is_ongoing, is_highlight, is_mega, mega_badge, sort_order);


with g as (
  insert into public.project_history_groups (badge, title, style, sort_order)
  values ('2024', 'Latest Project', 'primary', 1)
  returning id
)
insert into public.project_history_items
  (group_id, num, client, value, title, scope, tags, is_ongoing, is_highlight, is_mega, mega_badge, sort_order)
select g.id, v.* from g, (values
  ('24', 'Seremban Engineering SDN BHD', 'RM 7,000,000', 'Intel Falcon Project (Kulim)', 'Piping installation with full equipment supply — Intel''s state-of-the-art semiconductor facility in Kulim Hi-Tech Park, Kedah', array['Piping', 'Equipment', 'Intel', 'Kulim', 'Kedah', 'RM 7M']::text[], false, false, true, '🏆 Flagship Project', 0)
) as v(num, client, value, title, scope, tags, is_ongoing, is_highlight, is_mega, mega_badge, sort_order);


with g as (
  insert into public.project_history_groups (badge, title, style, sort_order)
  values ('2023', '2023 Projects', 'muted', 2)
  returning id
)
insert into public.project_history_items
  (group_id, num, client, value, title, scope, tags, is_ongoing, is_highlight, is_mega, mega_badge, sort_order)
select g.id, v.* from g, (values
  ('18', 'Variety Scores', 'RM 1,500,000', 'SAMSUNG SDI — Mechanical Works', 'Full mechanical works for Samsung SDI facility — global battery manufacturer project', array['Mechanical', 'Samsung SDI']::text[], false, true, false, '', 0),
  ('19', 'Bluebros E&C SDN BHD', 'RM 350,000', 'SAMSUNG SDI — Ducting Installation', 'Skilled workforce supply for ducting installation works', array['Manpower', 'Ducting', 'Samsung SDI']::text[], false, false, false, '', 1),
  ('20', 'Xiao Li Engineering & Co.', 'RM 100,000', 'SAMSUNG SDI — RC Civil Works', 'Manpower supply for reinforced concrete (RC) civil works', array['Civil', 'Manpower', 'Samsung SDI']::text[], false, false, false, '', 2),
  ('21', 'North Air Conditioning Malaysia', 'RM 1,000,000', 'INTEL Project (Pulau Pinang) — RC Manpower', 'Full RC (reinforced concrete) manpower supply for Intel''s Penang facility expansion', array['Civil', 'Intel', 'Penang']::text[], false, true, false, '', 3),
  ('22', 'S1 Corporation', 'RM 500,000', 'INTEL Project (Pulau Pinang) — Firefighting', 'Skilled workforce supply for firefighting system installation', array['Manpower', 'Intel', 'Firefighting']::text[], false, false, false, '', 4),
  ('23', 'Potential System SDN BHD', 'RM 1,500,000', 'SAMSUNG SDI — CCTV & IT Manpower', 'CCTV installation and IT manpower supply for Samsung SDI facility', array['CCTV', 'IT', 'Samsung SDI']::text[], false, true, false, '', 5)
) as v(num, client, value, title, scope, tags, is_ongoing, is_highlight, is_mega, mega_badge, sort_order);


with g as (
  insert into public.project_history_groups (badge, title, style, sort_order)
  values ('2017–2019', 'Major Multi-Year Projects', 'primary', 3)
  returning id
)
insert into public.project_history_items
  (group_id, num, client, value, title, scope, tags, is_ongoing, is_highlight, is_mega, mega_badge, sort_order)
select g.id, v.* from g, (values
  ('09', 'Keafer (M) Sdn Bhd', 'RM 10,748,280', 'RAPID — Manpower Supply', 'Full manpower supply for RAPID project — one of Malaysia''s largest petrochemical developments', array['Manpower', 'RAPID', 'Pengerang']::text[], false, true, false, '', 0),
  ('10', 'PS Peru Vision Sdn Bhd', 'RM 4,350,000', 'Simalanjau Tokoyama Project (Bintulu)', 'Erection & dismantling of tubular scaffold — large-scale industrial project in Sarawak', array['Scaffolding', 'Bintulu', 'Sarawak']::text[], false, true, false, '', 1),
  ('11', 'West Gate Petroleum Sdn Bhd', 'RM 7,550,000', 'TGAST Project (Terengganu)', 'Fabrication & installation of 75,000 dia pipes + skilled manpower supply (2018–2019)', array['Fabrication', 'Pipeline', 'Terengganu']::text[], false, true, false, '', 2),
  ('12', 'SINOPEC Engineering Group', 'RM 3,850,000', 'Tanjung Bin 4 Coal Project (Johor)', 'Fabrication & installation of 35,000 dia pipes + manpower supply (2018–2019)', array['Fabrication', 'Power Plant', 'Johor']::text[], false, true, false, '', 3),
  ('13–17', 'PETROFAC / Gabungan / FONCO', 'RM 12.6M+ (combined)', 'RAPID — Multiple Contracts', 'Manpower supply · Painting & piping punch list · Grating modification & installation for multiple contractors at RAPID Pengerang', array['Manpower', 'RAPID', 'Multi-Contract']::text[], false, false, false, '', 4)
) as v(num, client, value, title, scope, tags, is_ongoing, is_highlight, is_mega, mega_badge, sort_order);


with g as (
  insert into public.project_history_groups (badge, title, style, sort_order)
  values ('2018', '2018 Projects', 'default', 4)
  returning id
)
insert into public.project_history_items
  (group_id, num, client, value, title, scope, tags, is_ongoing, is_highlight, is_mega, mega_badge, sort_order)
select g.id, v.* from g, (values
  ('01', 'CABOT (M) Sdn Bhd', 'RM 850,000', 'EMSB — EMAX TIC Project Kerteh', 'Fabrication & installation for 2,000t structure; fabrication & installation for 2,000 dia pipe', array['Fabrication', 'Installation', 'Kerteh']::text[], false, false, false, '', 0),
  ('02', 'BOVIS (M) Sdn Bhd', 'RM 150,000', 'B. Braun Extension Project (Penang)', 'Provide 30 manpower for scaffolding and insulation works', array['Manpower', 'Scaffolding', 'Penang']::text[], false, false, false, '', 1),
  ('03', 'B. Braun (M) Sdn Bhd', 'RM 30,000', 'Cabot Shutdown 2011', 'Remove and reinstall insulation at MUF Roof (PD2 area)', array['Insulation', 'Maintenance']::text[], false, false, false, '', 2),
  ('04', 'TOYO-M Engineering', 'RM 250,000', 'Mega Project at Meru Setia Alam', 'Provide manpower for scaffolding erection & dismantling', array['Scaffolding', 'Manpower', 'Selangor']::text[], false, false, false, '', 3),
  ('05', 'Jehantech Sdn Bhd', 'RM 650,000', 'Tanjung Bin 3×700W Coal Fired Power Plant', 'Fabrication, installation & commissioning for 2,000 dia pipe', array['Fabrication', 'Power Plant', 'Johor']::text[], false, false, false, '', 4),
  ('06', 'Rekayasa Industri Malaysia', 'RM 198,000', 'Scaffold Work at Proton City, Tanjung Malim', 'Scaffolding for sports area, admin office, showroom, galleries & car park', array['Scaffolding', 'Perak']::text[], false, false, false, '', 5),
  ('07', 'Pembinaan Pureon Sdn Bhd', 'RM 1,150,000', 'Manipal Dental Clinic (Ayer Keroh, Melaka)', 'Scaffolding for 10-storey clinic & dental college', array['Scaffolding', 'Melaka', 'High-Rise']::text[], false, true, false, '', 6),
  ('08', 'TPSC Engineering (M) Sdn Bhd', 'RM 74,000', 'NPK Fertilizer Plant (Gurun)', 'Fabrication & installation of 1,000t structure, 200t equipment & 5,000 dia pipeline', array['Fabrication', 'Pipeline', 'Kedah']::text[], false, false, false, '', 7)
) as v(num, client, value, title, scope, tags, is_ongoing, is_highlight, is_mega, mega_badge, sort_order);


-- ── jobs ───────────────────────────────────────────────────────

-- posted_at defaults to today and valid_through to three months out, which is
-- what the Google Jobs structured data uses. Edit them per job in the admin.
insert into public.jobs
  (slug, title, category, category_label, location, employment_type, salary,
   requirements, icon_key, posted_at, valid_through, sort_order) values
  ('civil-engineer', 'Civil Engineer', 'engineering', 'Engineering', 'Johor Bahru, Malaysia', 'Full Time', 'RM 3,500 – 6,000/mo', array['Degree in Civil Engineering or equivalent', 'Minimum 2 years site experience', 'Knowledge of AutoCAD and MS Project', 'Able to work independently on site']::text[], 'blueprint', current_date, current_date + interval '3 months', 0),
  ('site-supervisor', 'Site Supervisor', 'management', 'Management', 'Johor Bahru, Malaysia', 'Full Time', 'RM 2,800 – 4,500/mo', array['Diploma or Degree in Construction or related field', 'Minimum 3 years supervisory experience', 'Strong leadership and communication skills', 'CIDB Green Card required']::text[], 'person', current_date, current_date + interval '3 months', 1),
  ('certified-welder', 'Certified Welder', 'skilled', 'Skilled Trade', 'Multiple Locations', 'Contract / Full Time', 'RM 2,200 – 4,000/mo', array['Valid welding certification (MIG / TIG / Arc)', 'Minimum 1 year welding experience', 'Able to read technical drawings', 'Willing to work on construction sites']::text[], 'bolt', current_date, current_date + interval '3 months', 2),
  ('licensed-electrician', 'Licensed Electrician', 'skilled', 'Skilled Trade', 'Johor Bahru & Selangor', 'Full Time', 'RM 2,500 – 4,200/mo', array['Valid EC or ES licence from Suruhanjaya Tenaga', 'Experience in LV/MV electrical installation', 'Knowledge of electrical codes and safety', 'Fresh graduates with EC licence welcome']::text[], 'bulb', current_date, current_date + interval '3 months', 3),
  ('mechanical-engineer', 'Mechanical Engineer', 'engineering', 'Engineering', 'Johor Bahru, Malaysia', 'Full Time', 'RM 3,200 – 5,500/mo', array['Degree in Mechanical Engineering', 'Experience in HVAC or industrial machinery', 'Familiar with maintenance planning and CMMS', 'Fresh graduates encouraged to apply']::text[], 'cog', current_date, current_date + interval '3 months', 4),
  ('general-labourer', 'General Labourer', 'general', 'General', 'Multiple Sites', 'Daily / Contract', 'RM 1,500 – 2,200/mo', array['No experience required — training provided', 'Physically fit and able to work outdoors', 'Reliable, hardworking, and punctual', 'Malaysian citizens and legal foreign workers']::text[], 'briefcase', current_date, current_date + interval '3 months', 5),
  ('safety-officer-sho', 'Safety Officer (SHO)', 'management', 'Management', 'Johor Bahru, Malaysia', 'Full Time', 'RM 3,000 – 5,000/mo', array['Registered SHO with DOSH Malaysia', 'Minimum 3 years construction site experience', 'Strong knowledge of OSHA 1994 regulations', 'Able to conduct safety briefings and audits']::text[], 'shield', current_date, current_date + interval '3 months', 6),
  ('plumber-pipe-fitter', 'Plumber / Pipe Fitter', 'skilled', 'Skilled Trade', 'Multiple Locations', 'Full Time / Contract', 'RM 2,000 – 3,500/mo', array['Experience in plumbing or pipe fitting', 'Knowledge of PPVC and conventional plumbing', 'Able to read plumbing drawings', 'Valid plumbing certificate preferred']::text[], 'pipes', current_date, current_date + interval '3 months', 7),
  ('qa-qc-inspector', 'QA/QC Inspector', 'engineering', 'Engineering', 'Johor Bahru, Malaysia', 'Full Time', 'RM 2,800 – 4,800/mo', array['Diploma or Degree in Engineering', 'Minimum 2 years QA/QC experience', 'Familiar with ISO standards and inspection methods', 'Good documentation and reporting skills']::text[], 'clipboard', current_date, current_date + interval '3 months', 8);


commit;
