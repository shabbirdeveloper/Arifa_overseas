import Image from 'next/image';
import Link from 'next/link';
import { RichHeading } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { deploymentSteps } from '@/content/company';
import { manpowerCategories } from '@/content/manpower';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Manpower Supply',
  description:
    'Engineers, certified welders, licensed electricians and general labourers supplied across Malaysia. JTK-licensed workforce deployment in 24–72 hours.',
  path: '/manpower',
});

export default function ManpowerPage() {
  return (
    <div id="page-manpower" className="page active">
      <PageHero
        tag="Our Workforce"
        headingHtml='<em style="color:var(--blue);font-style:normal;font-weight:400;">Manpower</em> Supply'
        intro="500+ skilled professionals ready to be deployed across construction, industrial, and maintenance projects."
      />

      <section className="mp-section">
        <div className="inner">
          {manpowerCategories.map((category, index) => (
            <div
              key={category.number}
              className={`mp-cat${category.reverse ? ' reverse' : ''}`}
            >
              {/* Image first in the DOM; `.reverse` flips it visually. */}
              <div className={category.reverse ? 's3d-right' : 's3d-left'}>
                <Image
                  src={category.image}
                  alt={category.imageAlt}
                  className="mp-cat-img"
                  width={category.width}
                  height={category.height}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={index === 0}
                  loading={index === 0 ? undefined : 'lazy'}
                />
              </div>

              <div className={category.reverse ? 's3d-left' : 's3d-right'}>
                <div className="mp-cat-num">{category.number}</div>
                <div className="tag">{category.tag}</div>
                <h2>
                  <RichHeading html={category.headingHtml} />
                </h2>
                {category.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}

                <div className="skills-list">
                  {category.skills.map((skill) => (
                    <span className="skill-tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div style={{ marginTop: 28 }}>
                  <Link href="/contact" className="btn-p">
                    {category.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="process-banner">
        <div className="inner">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
            <div className="tag s3d">How It Works</div>
            <h2 className="h2 s3d d1" style={{ maxWidth: '100%' }}>
              Deployment <em>Process</em>
            </h2>
          </div>
          <div className="steps">
            {deploymentSteps.map((step, index) => (
              <div key={step.num} className={`step s3d d${index + 1}`}>
                <div className="step-num">{step.num}</div>
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
