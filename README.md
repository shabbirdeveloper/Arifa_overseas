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

## Project layout

```
src/
  app/
    layout.tsx            root layout: nav, footer, fonts, metadata, JSON-LD
    page.tsx              /            home
    services/page.tsx     /services
    manpower/page.tsx     /manpower
    projects/page.tsx     /projects
    careers/page.tsx      /careers
    certificates/page.tsx /certificates
    gallery/page.tsx      /gallery
    about/page.tsx        /about
    contact/page.tsx      /contact
    sitemap.ts            /sitemap.xml
    robots.ts             /robots.txt
    globals.css           the original stylesheet, ported
    api/enquiry/route.ts  contact form handler
    api/apply/route.ts    job application handler (accepts a CV)
  components/
    layout/               Nav, Footer, Splash, WhatsApp button, scroll reveal
    home/                 hero carousel, canvas backdrop, particles, counters
    sections/             jobs, gallery, certificates, featured projects, map
    forms/                ContactForm, ApplyModal
    seo/JsonLd.tsx        Organization / WebSite / JobPosting structured data
    ui/                   PageHero, Lightbox, Icon
  content/                ← all site copy and data lives here
  lib/                    mailer, validation, rate limit, SEO helpers
  fonts/                  Inter (self-hosted variable font)
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
| `company.ts` | Why-choose-us, process steps, values, clients, leadership team |

Add a job to `jobs.ts` and it appears on `/careers`, in the filter, in the
apply dialog **and** in the `JobPosting` structured data — no other edits
needed.

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
- **Add real dates to job listings** if you want accurate `datePosted` /
  `validThrough` in the Google Jobs data; they currently derive from build time.
- The rate limiter is in-memory, so on serverless it limits per instance.
  If the forms attract real abuse, move it to Redis (Upstash) — the call sites
  won't change.
