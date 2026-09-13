import type { ReactNode } from 'react';
import { RichHeading } from '@/components/ui/Icon';

interface FloatIcon {
  emoji: string;
  delay?: string;
  left?: string;
  top?: string;
}

interface PageHeroProps {
  tag: string;
  /** Heading markup, e.g. `Our <em …>Services</em>`. */
  headingHtml: string;
  intro: string;
  /** Background photo. Omit for the plain dark hero the legacy site used. */
  image?: string;
  floatIcons?: FloatIcon[];
  children?: ReactNode;
  /**
   * 'wide' matches the services/manpower/projects/about/contact heroes;
   * 'compact' matches certificates/careers/gallery. They differ only in type
   * scale and padding — both are carried over verbatim from the legacy markup.
   */
  variant?: 'wide' | 'compact';
}

export function PageHero({
  tag,
  headingHtml,
  intro,
  image,
  floatIcons,
  children,
  variant = 'wide',
}: PageHeroProps) {
  const wide = variant === 'wide';

  return (
    <div className="ph">
      <div
        className="ph-bg"
        style={
          image
            ? {
                backgroundImage: `url('${image}')`,
                animation: 'heroScale 14s ease-in-out infinite alternate',
              }
            : undefined
        }
      />
      <div className="ph-ov" />
      <div className="ph-dots" />

      {floatIcons?.length ? (
        <div className="ph-anim-overlay" aria-hidden="true">
          {floatIcons.map((icon) => (
            <div
              key={icon.emoji}
              className="ph-float-icon"
              style={{
                animationDelay: icon.delay,
                left: icon.left,
                top: icon.top,
              }}
            >
              {icon.emoji}
            </div>
          ))}
        </div>
      ) : null}

      <div
        className="ph-content inner"
        style={wide ? { paddingTop: 60 } : undefined}
      >
        <div className="tag s3d">{tag}</div>
        <h1
          className="s3d d1"
          style={{
            fontSize: wide
              ? 'clamp(2.5rem,5vw,4.5rem)'
              : 'clamp(2.4rem,5vw,4.2rem)',
            fontWeight: 300,
            letterSpacing: '-1px',
            lineHeight: 1.1,
          }}
        >
          <RichHeading html={headingHtml} />
        </h1>
        <p
          className="s3d d2"
          style={
            wide
              ? {
                  fontSize: '1rem',
                  fontWeight: 300,
                  color: 'var(--light)',
                  maxWidth: 520,
                  lineHeight: 1.7,
                  marginTop: 16,
                }
              : {
                  fontSize: '0.97rem',
                  fontWeight: 300,
                  color: 'var(--light)',
                  maxWidth: 540,
                  lineHeight: 1.75,
                  marginTop: 14,
                }
          }
        >
          {intro}
        </p>
        {children}
      </div>
    </div>
  );
}
