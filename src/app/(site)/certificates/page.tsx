import Link from 'next/link';
import { CertificateCards } from '@/components/sections/CertificateCards';
import { PageHero } from '@/components/ui/PageHero';
import { pageHeroImages } from '@/content/site';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Our Certificates',
  description:
    'SSM, CIDB G7, Ministry of Finance, JCC Johor, NIOSH/DOSH, ISO 9001:2015 and FGV vendor registration — view the certificates behind Arifa Overseas Sdn Bhd.',
  path: '/certificates',
});

export default function CertificatesPage() {
  return (
    <div id="page-certificates" className="page active">
      <PageHero
        variant="compact"
        tag="Accreditations"
        headingHtml='Our <em style="color:var(--blue);font-style:normal;font-weight:400;">Certificates</em>'
        intro="Arifa Overseas is a fully accredited and certified company, meeting the highest standards in construction, safety, and manpower supply in Malaysia."
        image={pageHeroImages.certificates}
        floatIcons={[
          { emoji: '🏅' },
          { emoji: '📜', delay: '0.8s', left: '73%', top: '38%' },
          { emoji: '✅', delay: '1.6s', left: '18%', top: '60%' },
        ]}
      />

      <section style={{ background: 'var(--dark)' }}>
        <div className="inner">
          <div
            style={{ textAlign: 'center', maxWidth: 580, margin: '0 auto 52px' }}
          >
            <div className="tag s3d">Official Certifications</div>
            <h2 className="h2 s3d d1" style={{ maxWidth: '100%' }}>
              Verified <em>Accreditations</em>
            </h2>
            <p className="sub s3d d2" style={{ margin: '0 auto' }}>
              All our certifications are current, verified, and compliant with
              Malaysian regulatory requirements.
            </p>
          </div>

          <CertificateCards />

          <div className="cert-upload-note s3d">
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>✅</div>
            <h3>All Certificates Verified &amp; Current</h3>
            <p>
              All certifications displayed above are valid and current. Click on
              any certificate to view the full document. For official certified
              copies, please contact us directly.
            </p>
            <Link href="/contact" className="btn-p" style={{ marginTop: 20 }}>
              Request Certified Copies →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
