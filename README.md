# Arifa Overseas — website

Next.js 16 (App Router) rebuild of the original single-file `public_html/index.html`.
Same design, real routes, real forms.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # then fill in the values (see below)
npm run dev                    # http://localhost:3000
```

Requires **Node 20.9+**.

Other scripts:

```bash
npm run build       # production build
npm start           # serve the production build
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
```

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL. Used for `<link rel=canonical>`, `sitemap.xml`, `robots.txt` and Open Graph tags. **Set this to the real domain in production** or those tags will point at localhost. |
| `EMAIL_TO` | Where enquiries and job applications are delivered. |
| `EMAIL_FROM` | The `From:` address. With Gmail SMTP this must equal `SMTP_USER`. |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | SMTP transport. Gmail: `smtp.gmail.com`, `465`, `true`. |
| `SMTP_USER` / `SMTP_PASS` | SMTP credentials. |

### Gmail app password

Gmail rejects your normal account password over SMTP. Create an app password:

1. Google Account → **Security** → turn on **2-Step Verification** (required).
2. Security → **App passwords** → create one named "Website".
3. Paste the 16 characters into `SMTP_PASS` (spaces don't matter).

If the mail variables are missing, the forms return a clear "not configured yet"
message and point the visitor at WhatsApp instead of failing silently.

---

## Deploying to Vercel

1. Push this folder to a Git repository.
2. In Vercel: **New Project** → import the repo → framework is detected
   automatically (Next.js). Root directory is this folder.
3. Add every variable from `.env.example` under **Settings → Environment
   Variables** (Production + Preview). `NEXT_PUBLIC_SITE_URL` must be the live
   domain, e.g. `https://www.arifaoverseas.com`.
4. Deploy, then add the custom domain under **Settings → Domains**.

After the first deploy, submit `https://<your-domain>/sitemap.xml` in Google
Search Console — the nine pages are separate URLs now, so each one can rank.

---

## Admin area

`/admin` is a small editor for the content that changes: team members, featured
projects, the project-history records and job listings. Everything else still
lives in `src/content`.

### One-time setup

1. **Create a Supabase project** at supabase.com (the free tier is plenty).
2. **Run the SQL.** Dashboard → SQL Editor → New query:
   - paste `supabase/schema.sql` and run it (tables, security rules, image
     bucket);
   - paste `supabase/seed.sql` and run it (imports the content that is on the
     site today, so nothing changes visually).
   Both are safe to re-run.
3. **Create your login.** Dashboard → Authentication → Users → Add user →
   "Create new user". Use a real email and a strong password, and tick
   *Auto Confirm User*.
4. **Make that user an admin.** SQL Editor:
   ```sql
   insert into public.admin_users (user_id, email)
   select id, email from auth.users where email = 'you@example.com';
   ```
   Signing in is not enough on its own — only rows in `admin_users` can write.
5. **Turn off public signup.** Authentication → Providers → Email → disable
   "Enable sign ups". You add users from the dashboard instead.
6. **Add the two environment variables** (Project Settings → Data API) to
   `.env.local` and to Vercel, then redeploy:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

Then sign in at `/admin/login`.

### How it fits together

- **Reads** happen server-side with the anonymous key. Row Level Security only
  exposes published rows, so the key being public costs nothing.
- **Writes** run as your logged-in user through Server Actions. The database
  checks `admin_users` membership on every insert, update and delete — the UI
  hiding a button is never what stops a write.
- **The service-role key is not used anywhere** and should not be added to the
  environment. It bypasses every security rule.
- **Images** upload straight from the browser to Supabase Storage, so large
  files never pass through a Server Action (Vercel caps those at 4.5MB). The
  bucket is world-readable and admin-only writable.
- **Freshness**: public pages stay pre-rendered and revalidate hourly, and each
  save purges the page it affects — so an edit is live within seconds without
  making visitors wait on the database.

### If the database is unavailable

Every loader falls back to the content files in `src/content`. An unconfigured
deploy, a wrong key, a Supabase outage or an empty table all produce the site
exactly as it looks today rather than empty sections. You will see
`falling back to static content` in the server logs when that happens.

That also means **the site keeps working before you do any of the setup above** —
`/admin` simply tells you it is not configured yet.

### Editing notes

- **Position** orders items; lower numbers come first.
- **Show on the website** hides a row without deleting it. Hidden rows stay
  visible to you in the admin.
- **Job icons** are chosen from a fixed set. The SVG markup deliberately lives
  in `src/content/job-icons.tsx`, not the database — storing raw SVG that gets
  rendered into the page would be a cross-site-scripting hole.
- **Job dates** feed the Google Jobs listing. Google drops a job after its
  closing date, so keep it current or the listing disappears.
- **History tags** style themselves from their text: anything containing
  "going" turns green, anything starting with "RM" turns gold.
- Deleting a year group deletes its records too.

---

## Project layout

```
src/
  app/
    layout.tsx              html, fonts, base metadata
    globals.css             the original stylesheet, ported
    (site)/                 the public website — a route group, so it adds
      layout.tsx            nav, footer, splash, structured data
      page.tsx              /            home
      services/page.tsx     /services
      manpower/page.tsx     /manpower
      projects/page.tsx     /projects
      careers/page.tsx      /careers
      certificates/page.tsx /certificates
      gallery/page.tsx      /gallery
      about/page.tsx        /about
      contact/page.tsx      /contact
    admin/                  the editor — no marketing chrome, never indexed
      login/                sign-in
      (protected)/          dashboard, team, projects, history, jobs
    api/enquiry/route.ts    contact form handler
    api/apply/route.ts      job application handler (accepts a CV)
    sitemap.ts              /sitemap.xml
    robots.ts               /robots.txt
  components/
    layout/               Nav, Footer, Splash, WhatsApp button, scroll reveal
    home/                 hero carousel, canvas backdrop, particles, counters
    sections/             jobs, gallery, certificates, featured projects, map
    forms/                ContactForm, ApplyModal
    seo/JsonLd.tsx        Organization / WebSite / JobPosting structured data
    ui/                   PageHero, Lightbox, Icon
  content/                ← copy and data that is not in the database
  lib/
    data/                 loaders (database first, content files as fallback)
    supabase/             clients, row types, configuration
    admin/                admin guard and Server Action helpers
    mailer, validation, rate-limit, seo
  fonts/                  Inter (self-hosted variable font)
  middleware.ts           admin session refresh + signed-out redirect
supabase/
  schema.sql              tables, security rules, storage bucket
  seed.sql                today's content, as INSERTs
public/
  logo.png
  certificates/           the 7 certificate scans
  images/gallery/         g1–g15
  images/team/            director photos
```

### Editing content

Everything a non-developer would want to change lives in `src/content/`:

| File | Contents |
| --- | --- |
| `site.ts` | Company name, phone, email, WhatsApp, address, opening hours, headline stats, navigation, hero images |
| `services.ts` | The six service sections and the three home-page service cards |
| `manpower.ts` | The four workforce categories and their skill tags |
| `projects.ts` | Featured project tiles + the full project history by year |
| `jobs.ts` | Open positions (title, department, salary, requirements) |
| `certificates.ts` | The seven certificates and the home-page accreditation cards |
| `gallery.ts` | Gallery photos and their categories |
| `company.ts` | Why-choose-us, process steps, values, clients (leadership team moved to the database) |

Team members, featured projects, project history and jobs are edited in
`/admin` once Supabase is set up; the files under `src/content` become the
fallback for those four. Everything else — services, manpower categories,
certificates, gallery, company details — is still edited in the files.

---

## What changed from the original site

Fixes that came with the port:

- **Nine real URLs** instead of one page with `#hash` routing, so each page can
  be indexed, shared and ranked on its own. Every page has its own title,
  meta description, canonical URL and Open Graph tags.
- **Structured data**: Organization + LocalBusiness site-wide, `JobPosting` for
  every opening (eligible for Google Jobs), plus `sitemap.xml` and `robots.txt`.
- **Forms are server-side now.** Real `<form>` elements, zod validation, a
  honeypot and a per-IP rate limit. The recipient address is no longer sitting
  in the page source for scrapers, and spam protection is on rather than
  explicitly disabled.
- **CV upload** on job applications — PDF or Word, max 5MB, checked by reading
  the file's magic bytes rather than trusting the declared type, then attached
  to the notification email.
- **3.4MB → ~50KB of HTML.** The 20 base64-embedded images became real files
  that the browser caches; `next/image` serves AVIF/WebP at the right size.
- **Accessibility**: pinch-zoom unblocked, keyboard-operable theme toggle,
  menu, gallery and certificates, labels tied to their inputs, focus trapped in
  dialogs and Escape to close, visible focus rings, a skip link, and
  `prefers-reduced-motion` respected throughout.
- **Works without JavaScript.** Previously a JS failure left a black splash
  screen covering the site and every animated section invisible.
- **The project filter buttons on /projects work** — in the original they had
  no click handler at all.
- **Inter is self-hosted** rather than fetched from Google on every visit
  (faster, and no visitor IP handed to a third party).
- Two dead social links (`href="#"`) were removed from the footer. Add real
  Facebook/Instagram URLs in `Footer.tsx` when you have them.
- An orphaned `to{...}}` CSS fragment left over from a deleted `@keyframes` was
  removed — browsers ignored it, strict parsers don't.

### Still worth doing

- **Swap the stock photography.** Hero and section images still come from
  Unsplash (`heroSlides` / `sectionImages` in `src/content/site.ts`, plus the
  `image` fields in `services.ts`, `manpower.ts`, `projects.ts`, `gallery.ts`).
  Drop real photos into `public/images/` and point at them; then the
  `images.remotePatterns` entry in `next.config.ts` can go.
- **Pick one experience claim.** The site says "Est. 2017", "over 10 years" and
  "over the past decade" in different places.
- **Confirm client-name permissions** before publishing — Intel, JABIL, FGV,
  MMHE, Samsung SDI and COSMX are all named.
- **Set real posted/closing dates on jobs** in the admin. The seed gives every
  job today's date plus three months.
- The rate limiter is in-memory, so on serverless it limits per instance.
  If the forms attract real abuse, move it to Redis (Upstash) — the call sites
  won't change.
