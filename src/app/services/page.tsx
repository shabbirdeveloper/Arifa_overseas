import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero';
import { RichHeading } from '@/components/ui/Icon';
import { processSteps } from '@/content/company';
import { services } from '@/content/services';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Our Services',
  description:
    'Construction, manpower supply, facility maintenance, EPCC, steel fabrication and cable manufacturing — delivered across Malaysia by a CIDB G7 registered contractor.',
  path: '/services',
});

const CTA_HREF: Record<string, string> = {
  contact: '/contact',
  manpower: '/manpower',
  services: '/services',
};

export default function ServicesPage() {
  return (
    <div id="page-services" className="page active">
      <PageHero
        tag="What We Offer"
        headingHtml='Our <em style="color:var(--blue);font-style:normal;font-weight:400;">Services</em>'
        intro="Comprehensive construction, manpower, and maintenance solutions built on a decade of expertise and trust."
      />

      {services.map((service, index) => {
        const media = (
          <div key="media" className={service.reverse ? 's3d-right' : 's3d-left'}>
            <Image
              src={service.image}
              alt={service.imageAlt}
              className="svc-big-img"
              width={service.width}
              height={service.height}
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading={index === 0 ? undefined : 'lazy'}
              priority={index === 0}
            />
          </div>
        );

        const copy = (
          <div key="copy" className={service.reverse ? 's3d-left' : 's3d-right'}>
            <div className="svc-number">{service.number}</div>
            <div className="tag">{service.tag}</div>
            <h2>
              <RichHeading html={service.headingHtml} />
            </h2>
            {service.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}

            <div className="svc-features">
              {service.features.map((feature) => (
                <div className="svc-feat" key={feature.title}>
                  <div className="svc-feat-dot" />
                  <div>
                    <h5>{feature.title}</h5>
                    <p>{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={CTA_HREF[service.ctaTarget] ?? '/contact'}
              className="btn-p"
            >
              {service.cta}
            </Link>
          </div>
        );

        return (
          <div
            className="svc-detail"
            id={service.id}
            key={service.id}
            style={parseSectionStyle(service.sectionStyle)}
          >
            <div className="inner">
              {/* DOM order is always image-then-copy; `.reverse` flips the
                  visual order in CSS (direction:rtl on the grid). */}
              <div
                className={`svc-detail-grid${service.reverse ? ' reverse' : ''}`}
              >
                {media}
                {copy}
              </div>
            </div>
          </div>
        );
      })}

      <div className="process-section">
        <div className="inner">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
            <div className="tag s3d">How We Work</div>
            <h2 className="h2 s3d d1" style={{ maxWidth: '100%' }}>
              Our <em>Process</em>
            </h2>
          </div>
          <div className="process-grid">
            {processSteps.map((step, index) => (
              <div key={step.num} className={`process-step s3d d${index + 1}`}>
                <div className="proc-num">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Turns the legacy inline `background:var(--dark2);` string into a style object. */
function parseSectionStyle(style: string): React.CSSProperties | undefined {
  const match = /background\s*:\s*([^;]+)/i.exec(style);
  return match?.[1] ? { background: match[1].trim() } : undefined;
}
