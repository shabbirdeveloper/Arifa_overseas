import type { ReactNode } from 'react';
import { site } from '@/content/site';

interface MapSectionProps {
  tag?: string;
  headingHtml?: ReactNode;
  intro?: string;
  /** Home page uses a padded band; the contact page sits tighter. */
  compact?: boolean;
}

export function MapSection({
  tag = 'Find Us',
  headingHtml,
  intro,
  compact = false,
}: MapSectionProps) {
  return (
    <section
      style={
        compact
          ? { padding: '0 0 80px', background: 'var(--dark)' }
          : { padding: 0, background: 'var(--dark2)' }
      }
    >
      <div
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          padding: compact ? '0 64px' : '80px 64px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: compact ? 36 : 40 }}>
          <div className="tag s3d">{tag}</div>
          <h2 className="h2 s3d d1" style={{ maxWidth: '100%' }}>
            {headingHtml ?? (
              <>
                Our <em>Location</em>
              </>
            )}
          </h2>
          {intro ? (
            <p className="sub s3d d2" style={{ margin: '0 auto' }}>
              {intro}
            </p>
          ) : null}
        </div>

        <div
          className="s3d"
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid rgba(56,189,248,0.15)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          <iframe
            src={site.mapsEmbed}
            title={`Map showing the ${site.legalName} office in ${site.address.city}`}
            referrerPolicy="no-referrer-when-downgrade"
            width="100%"
            height={450}
            style={{ border: 0, display: 'block', minHeight: 300 }}
            allowFullScreen
            loading="lazy"
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a
            href={site.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-p"
            style={{ display: 'inline-flex' }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
