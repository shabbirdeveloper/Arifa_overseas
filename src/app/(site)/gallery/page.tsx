import { GallerySection } from '@/components/sections/GallerySection';
import { PageHero } from '@/components/ui/PageHero';
import { pageHeroImages } from '@/content/site';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Project Gallery',
  description:
    'Photos from Arifa Overseas sites across Malaysia — steel erection, HVAC and piping, offshore electrical works, crane operations and workforce mobilisation.',
  path: '/gallery',
});

export default function GalleryPage() {
  return (
    <div id="page-gallery" className="page active">
      <PageHero
        variant="compact"
        tag="Our Work in Pictures"
        headingHtml='Project <em style="color:var(--blue);font-style:normal;font-weight:400;">Gallery</em>'
        intro="A visual showcase of our construction, manpower, and maintenance projects across Malaysia."
        image={pageHeroImages.gallery}
        floatIcons={[
          { emoji: '📸' },
          { emoji: '🏗️', delay: '0.8s', left: '74%', top: '38%' },
          { emoji: '🌟', delay: '1.6s', left: '17%', top: '60%' },
        ]}
      />

      <section style={{ background: 'var(--dark)' }}>
        <div className="inner">
          <div
            style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 44px' }}
          >
            <div className="tag s3d">Visual Portfolio</div>
            <h2 className="h2 s3d d1" style={{ maxWidth: '100%' }}>
              Our Work <em>In Action</em>
            </h2>
          </div>

          <GallerySection />
        </div>
      </section>
    </div>
  );
}
