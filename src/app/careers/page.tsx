import { JobsSection } from '@/components/sections/JobsSection';
import { JobPostingsJsonLd } from '@/components/seo/JsonLd';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { careerBenefits } from '@/content/company';
import { pageHeroImages } from '@/content/site';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Careers',
  description:
    'We are hiring in Johor Bahru: civil and mechanical engineers, site supervisors, certified welders, licensed electricians, safety officers, QA/QC inspectors and general labourers.',
  path: '/careers',
});

const PERKS = [
  '✅ Competitive Salary',
  '✅ EPF & SOCSO',
  '✅ Career Growth',
  '✅ Safe Work Environment',
];

const perkStyle: React.CSSProperties = {
  background: 'rgba(56,189,248,0.1)',
  border: '1px solid rgba(56,189,248,0.25)',
  padding: '8px 18px',
  borderRadius: 20,
  fontSize: '0.78rem',
  color: 'var(--blue)',
  fontWeight: 500,
};

export default function CareersPage() {
  return (
    <div id="page-careers" className="page active">
      <JobPostingsJsonLd />

      <PageHero
        variant="compact"
        tag="Join Our Team"
        headingHtml='We Are <em style="color:var(--blue);font-style:normal;font-weight:400;">Hiring!</em>'
        intro="Join Arifa Overseas and be part of Malaysia's most trusted construction and manpower company. We are always looking for talented, hardworking individuals to grow with us."
        image={pageHeroImages.careers}
        floatIcons={[
          { emoji: '💼' },
          { emoji: '🎯', delay: '0.7s', left: '71%', top: '40%' },
          { emoji: '🚀', delay: '1.4s', left: '19%', top: '56%' },
        ]}
      >
        <div
          className="s3d d3"
          style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}
        >
          {PERKS.map((perk) => (
            <div key={perk} style={perkStyle}>
              {perk}
            </div>
          ))}
        </div>
      </PageHero>

      <section style={{ background: 'var(--dark2)' }}>
        <div className="inner">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
            <div className="tag s3d">Why Work With Us</div>
            <h2 className="h2 s3d d1" style={{ maxWidth: '100%' }}>
              Build Your <em>Career Here</em>
            </h2>
          </div>

          <div className="career-why-grid">
            {careerBenefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className={`career-why-card s3d d${index + 1}`}
              >
                <div className="career-why-ic">
                  <Icon svg={benefit.icon} />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--dark)' }}>
        <div className="inner">
          <div
            style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 52px' }}
          >
            <div className="tag s3d">Open Positions</div>
            <h2 className="h2 s3d d1" style={{ maxWidth: '100%' }}>
              Current <em>Job Openings</em>
            </h2>
            <p className="sub s3d d2" style={{ margin: '0 auto' }}>
              We are actively hiring across all departments. Find your role below
              and apply today.
            </p>
          </div>

          <JobsSection />
        </div>
      </section>
    </div>
  );
}
