import Image from 'next/image';
import Link from 'next/link';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { MotionCanvas } from '@/components/home/MotionCanvas';
import { Particles } from '@/components/home/Particles';
import { StatsBar } from '@/components/home/StatsBar';
import { MapSection } from '@/components/sections/MapSection';
import { Icon } from '@/components/ui/Icon';
import { certificationSummary } from '@/content/certificates';
import { clients, whyChooseUs } from '@/content/company';
import { servicePreviews } from '@/content/services';
import { sectionImages, site } from '@/content/site';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  path: '/',
});

const directors = [
  {
    tag: 'Project Director’s Message',
    headingHtml: 'Delivering with <em>Precision</em>',
    quote:
      '“A project’s success is decided long before the first brick is laid — in planning, in discipline, and in the people you put on site. We deliver every project as if our name is built into its foundation.”',
    body: 'As Project Director, MR Muhammad Jamal Ahmed oversees the planning, execution, and delivery of every Arifa Overseas project — from site mobilisation to final handover. His rigorous management ensures each project is completed safely, on schedule, within budget, and to the highest standard of quality.',
    name: 'MR Muhammad Jamal Ahmed',
    role: 'Project Director — Arifa Overseas Sdn Bhd',
    image: '/images/team/jamal.png',
    width: 600,
    height: 600,
    imageFirst: true,
  },
  {
    tag: 'Business Development Director’s Message',
    headingHtml: 'Driving <em>Strategic Growth</em>',
    quote:
      '“Every project we undertake is a testament to our team’s skill, discipline, and passion. We ensure that every nail, every weld, and every deployment is executed with precision and care.”',
    body: 'With over a decade of on-ground experience managing complex construction and manpower projects, MR Mohamad Rafi Bin Abu Bakar ensures that every client’s expectations are not just met — but exceeded. His hands-on approach and deep technical knowledge are at the core of Arifa Overseas’s operational excellence.',
    name: 'MR Mohamad Rafi Bin Abu Bakar',
    role: 'Business Development Director — Arifa Overseas Sdn Bhd',
    image: '/images/team/rafi.jpg',
    width: 1122,
    height: 1402,
    imageFirst: false,
  },
] as const;

const portraitStyle = {
  width: '100%',
  height: 420,
  objectFit: 'contain',
  objectPosition: 'center',
  borderRadius: 12,
  display: 'block',
  background: 'var(--dark2)',
} as const;

const badgeStyle = {
  position: 'absolute',
  bottom: 24,
  left: 24,
  right: 24,
  background: 'rgba(6,10,15,0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(56,189,248,0.2)',
  padding: '16px 20px',
  borderRadius: 10,
} as const;

export default function HomePage() {
  return (
    <div id="page-home" className="page active">
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="hero" id="home">
        <HeroCarousel />
        <div className="hero-overlay" />
        <div
          className="hero-dots"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(rgba(56,189,248,0.07) 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <MotionCanvas />
        <Particles />

        <div className="hero-content">
          <div className="hero-chip">
            <span /> Johor Bahru, Malaysia — Est. {site.founded}
          </div>
          <h1>
            <div className="ln">
              <span>Building</span>
            </div>
            <div className="ln">
              <span>Excellence.</span>
            </div>
            <div className="ln">
              <span>Supplying Strength.</span>
            </div>
          </h1>
          <p>
            Arifa Overseas delivers world-class construction, expert manpower
            supply, and reliable maintenance services — trusted across Malaysia
            for over 10 years.
          </p>
          <div className="hero-actions">
            <Link href="/services" className="btn-p">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="17"
                height="17"
                aria-hidden="true"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Explore Services
            </Link>
            <Link href="/contact" className="btn-o">
              Get a Quote →
            </Link>
          </div>
        </div>

        <div className="hero-hint" aria-hidden="true">
          <div className="hint-bar" /> Scroll to explore
        </div>
      </section>

      <StatsBar />

      {/* ── ABOUT PREVIEW ──────────────────────────────────────────────── */}
      <section className="about-preview">
        <div className="inner">
          <div className="about-grid">
            <div className="about-img-wrap s3d-left">
              <Image
                src={sectionImages.aboutPreview}
                alt="Arifa Overseas construction site"
                className="about-img"
                width={900}
                height={600}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <div className="about-badge">
                <div className="n">10+</div>
                <div className="l">Years of Trust</div>
              </div>
            </div>
            <div className="s3d-right">
              <div className="tag">About Us</div>
              <h2 className="h2">
                Your Trusted Partner in{' '}
                <em>Construction &amp; Workforce</em>
              </h2>
              <div className="about-text">
                <p>
                  Founded in Johor Bahru, Arifa Overseas has grown into one of
                  Malaysia&rsquo;s most reliable construction and manpower supply
                  companies. We bring skill, precision, and dedication to every
                  single project.
                </p>
                <p>
                  Whether it&rsquo;s large-scale construction, specialised
                  maintenance, or deploying a skilled workforce — we deliver
                  solutions that exceed expectations, on time and within budget.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 14,
                  marginTop: 28,
                  flexWrap: 'wrap',
                }}
              >
                <Link href="/about" className="btn-p">
                  Learn More →
                </Link>
                <Link href="/contact" className="btn-o">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES PREVIEW ───────────────────────────────────────────── */}
      <section className="services-preview">
        <div className="inner">
          <div style={{ textAlign: 'center', maxWidth: 580, margin: '0 auto' }}>
            <div className="tag s3d">What We Do</div>
            <h2 className="h2 s3d d1" style={{ maxWidth: '100%' }}>
              Our Core <em>Services</em>
            </h2>
            <p className="sub s3d d2" style={{ margin: '0 auto' }}>
              From groundbreaking construction to precise maintenance and
              reliable manpower.
            </p>
          </div>

          <div className="svc-grid">
            {servicePreviews.map((preview, index) => (
              <Link
                key={preview.title}
                href={preview.target === 'manpower' ? '/manpower' : '/services'}
                className={`svc-card s3d d${index + 1}`}
              >
                <Image
                  src={preview.image}
                  alt={preview.title}
                  className="svc-img"
                  width={preview.width}
                  height={preview.height}
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
                <div className="svc-over" />
                <div className="svc-learn">Learn More →</div>
                <div className="svc-body">
                  <div className="svc-icon">
                    <Icon svg={preview.icon} />
                  </div>
                  <h3>{preview.title}</h3>
                  <p>{preview.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIRECTORS ──────────────────────────────────────────────────── */}
      <section className="director">
        <div className="inner">
          <div className="dir-grid">
            <div className="dir-img-wrap s3d-left">
              <div className="dir-quote-mark">&ldquo;</div>
              <Image
                src="/images/team/bilal.png"
                alt="MR CH Muhammad Bilal, Director of Arifa Overseas"
                className="dir-img"
                width={600}
                height={600}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <div className="dir-badge">
                <h4>MR CH Muhammad Bilal</h4>
                <span>Director, Arifa Overseas</span>
              </div>
            </div>
            <div className="s3d-right">
              <div className="tag">Director&rsquo;s Message</div>
              <h2 className="h2">
                A Message from Our <em>Director</em>
              </h2>
              <div className="dir-content">
                <blockquote>
                  &ldquo;At Arifa Overseas, we don&rsquo;t just build structures
                  — we build relationships, trust, and a legacy of excellence
                  that stands the test of time.&rdquo;
                </blockquote>
                <p>
                  When I founded Arifa Overseas, my vision was simple yet
                  profound: to create a company where quality is never
                  compromised, where every worker is valued, and where every
                  client is treated as a long-term partner.
                </p>
                <p>
                  Over the past decade, we have grown from a small team in Johor
                  Bahru into one of Malaysia&rsquo;s most trusted names in
                  construction and manpower supply. This journey has been
                  possible because of our dedicated team, our loyal clients, and
                  our unwavering commitment to delivering excellence on every
                  project.
                </p>
                <p>
                  As we look to the future, we remain committed to embracing
                  innovation, expanding our capabilities, and continuing to set
                  new standards in the industry. Your success is our success —
                  and we are proud to be your trusted partner.
                </p>
                <div className="dir-sig">
                  <h4>MR CH Muhammad Bilal</h4>
                  <span>Director — Arifa Overseas Sdn Bhd</span>
                </div>
              </div>
            </div>
          </div>

          {directors.map((director) => {
            const portrait = (
              <div key={`${director.name}-image`} className="s3d-left">
                <div style={{ position: 'relative' }}>
                  <Image
                    src={director.image}
                    alt={director.name}
                    width={director.width}
                    height={director.height}
                    sizes="(max-width: 900px) 100vw, 50vw"
                    style={portraitStyle}
                  />
                  <div style={badgeStyle}>
                    <h4
                      style={{
                        fontSize: '1rem',
                        fontWeight: 500,
                        marginBottom: 3,
                      }}
                    >
                      {director.name}
                    </h4>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--blue)',
                        letterSpacing: '1px',
                      }}
                    >
                      {director.role.split(' — ')[0]}
                    </span>
                  </div>
                </div>
              </div>
            );

            const copy = (
              <div key={`${director.name}-copy`} className="s3d-right">
                <div className="tag">{director.tag}</div>
                <h2
                  className="h2"
                  dangerouslySetInnerHTML={{ __html: director.headingHtml }}
                />
                <blockquote
                  style={{
                    fontSize: '1rem',
                    fontWeight: 300,
                    color: 'var(--light)',
                    lineHeight: 1.9,
                    fontStyle: 'italic',
                    margin: '20px 0 24px',
                    paddingLeft: 20,
                    borderLeft: '2px solid var(--blue)',
                  }}
                >
                  {director.quote}
                </blockquote>
                <p
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 300,
                    color: 'var(--gray)',
                    lineHeight: 1.8,
                    marginBottom: 16,
                  }}
                >
                  {director.body}
                </p>
                <div
                  className="dir-sig"
                  style={{
                    marginTop: 24,
                    paddingTop: 20,
                    borderTop: '1px solid rgba(56,189,248,0.1)',
                  }}
                >
                  <h4>{director.name}</h4>
                  <span>{director.role}</span>
                </div>
              </div>
            );

            return (
              <div
                key={director.name}
                style={{
                  marginTop: 80,
                  paddingTop: 60,
                  borderTop: '1px solid rgba(56,189,248,0.1)',
                }}
              >
                <div
                  className="pm-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 80,
                    alignItems: 'center',
                  }}
                >
                  {director.imageFirst ? [portrait, copy] : [copy, portrait]}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── WHY US ─────────────────────────────────────────────────────── */}
      <section className="why-section">
        <div className="inner">
          <div
            style={{
              textAlign: 'center',
              maxWidth: 560,
              margin: '0 auto 56px',
            }}
          >
            <div className="tag s3d">Why Choose Us</div>
            <h2 className="h2 s3d d1" style={{ maxWidth: '100%' }}>
              The Arifa Overseas <em>Advantage</em>
            </h2>
          </div>
          <div className="why-grid-4">
            {whyChooseUs.map((card, index) => (
              <div key={card.num} className={`why-card s3d d${index + 1}`}>
                <div className="why-card-num">{card.num}</div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ─────────────────────────────────────────────── */}
      <section
        style={{ background: 'var(--dark2)', padding: '100px 64px' }}
        id="certifications"
      >
        <div className="inner">
          <div
            style={{
              textAlign: 'center',
              maxWidth: 560,
              margin: '0 auto 56px',
            }}
          >
            <div className="tag s3d">Accreditations</div>
            <h2 className="h2 s3d d1" style={{ maxWidth: '100%' }}>
              Our <em>Certifications</em>
            </h2>
            <p className="sub s3d d2" style={{ margin: '0 auto' }}>
              Arifa Overseas operates to the highest industry standards, backed
              by recognised certifications and registrations across Malaysia.
            </p>
          </div>

          <div
            id="cert-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: 20,
            }}
          >
            {certificationSummary.map((certification, index) => (
              <div
                key={certification.title}
                className={`cert-card s3d d${(index % 4) + 1}`}
              >
                <div className="cert-icon">
                  <Icon svg={certification.icon} />
                </div>
                <div className="cert-body">
                  <div className="cert-badge">{certification.badge}</div>
                  <h3>{certification.title}</h3>
                  <p>{certification.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/certificates" className="btn-p">
              View All Certificates →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CLIENTS ────────────────────────────────────────────────────── */}
      <section className="clients-section">
        <div className="clients-head">
          <div className="tag s3d">Trusted By</div>
          <h2
            className="h2 s3d d1"
            style={{
              maxWidth: '100%',
              fontSize: 'clamp(1.5rem,2.5vw,2rem)',
              marginBottom: 0,
            }}
          >
            Our <em>Clients</em>
          </h2>
        </div>
        <div className="clients-track-wrap">
          <div className="clients-track">
            {/* Duplicated once — the marquee animation scrolls through two
                identical halves to loop seamlessly. */}
            {[0, 1].map((pass) =>
              clients.map((client) => (
                <div className="client-logo" key={`${pass}-${client.name}`}>
                  <div className="cl-mark">{client.mark}</div>
                  <span>{client.name}</span>
                </div>
              )),
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <div className="cta-banner s3d">
        <div className="cta-inner">
          <h2>
            Ready to start your next <strong>project with us?</strong>
          </h2>
          <div className="cta-btns">
            <Link href="/contact" className="btn-white">
              Get a Quote
            </Link>
            <Link href="/services" className="btn-outline-white">
              Our Services
            </Link>
          </div>
        </div>
      </div>

      <MapSection intro="Visit us at our office in Johor Bahru, Malaysia. We'd love to meet you in person." />
    </div>
  );
}
