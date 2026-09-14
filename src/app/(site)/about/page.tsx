import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { coreValues } from '@/content/company';
import { sectionImages } from '@/content/site';
import { getTeam } from '@/lib/data/team';
import { pageMeta } from '@/lib/seo';

export const revalidate = 3600;

export const metadata = pageMeta({
  title: 'About Us',
  description:
    'Founded in Johor Bahru in 2017, Arifa Overseas Sdn Bhd has completed 50+ construction and manpower projects across Malaysia with a workforce of 500+ trained professionals.',
  path: '/about',
});

const STATS = [
  { value: '10+', label: 'Years' },
  { value: '50+', label: 'Projects' },
  { value: '500+', label: 'Workers' },
];

const statBoxStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: 20,
  background: 'rgba(56,189,248,0.05)',
  border: '1px solid rgba(56,189,248,0.1)',
  borderRadius: 10,
};

export default async function AboutPage() {
  const team = await getTeam();

  return (
    <div id="page-about" className="page active">
      <PageHero
        tag="Our Story"
        headingHtml='About <em style="color:var(--blue);font-style:normal;font-weight:400;">Arifa Overseas</em>'
        intro="A decade of building trust, delivering excellence, and powering Malaysia's construction industry."
      />

      <section className="about-story">
        <div className="inner">
          <div className="story-grid">
            <div className="s3d-left">
              <Image
                src={sectionImages.aboutStory}
                alt="Arifa Overseas project site"
                className="story-img"
                width={900}
                height={600}
                sizes="(max-width: 900px) 100vw, 50vw"
                priority
              />
            </div>

            <div className="s3d-right">
              <div className="tag">Who We Are</div>
              <h2 className="h2">
                Built on <em>Integrity &amp; Excellence</em>
              </h2>
              <div className="story-text">
                <p>
                  Arifa Overseas was founded in Johor Bahru, Malaysia with a
                  single mission: to provide construction and manpower solutions
                  that are reliable, professional, and built to last. What
                  started as a small but determined team has grown into one of
                  the region&rsquo;s most trusted names in the industry.
                </p>
                <p>
                  Over the past decade, we have successfully completed over 50
                  projects — ranging from large commercial complexes and
                  industrial facilities to residential developments and
                  infrastructure works. Our workforce of 500+ trained
                  professionals is our greatest asset.
                </p>
                <p>
                  We are guided by strong values of quality, safety, and
                  integrity. Every project we undertake reflects our commitment
                  to delivering not just what was promised, but more than what
                  was expected.
                </p>
                <p>
                  Based in Johor Bahru, we serve clients across Malaysia and are
                  proud to contribute to the nation&rsquo;s growth and
                  development, one project at a time.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 16,
                  marginTop: 32,
                }}
              >
                {STATS.map((stat) => (
                  <div key={stat.label} style={statBoxStyle}>
                    <div
                      style={{
                        fontSize: '2.2rem',
                        fontWeight: 300,
                        color: 'var(--blue)',
                        letterSpacing: '-1px',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--gray)',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        marginTop: 4,
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="inner">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
            <div className="tag s3d">What Drives Us</div>
            <h2 className="h2 s3d d1" style={{ maxWidth: '100%' }}>
              Our Core <em>Values</em>
            </h2>
          </div>

          <div className="values-grid">
            {coreValues.map((value, index) => (
              <div
                key={value.title}
                className={`value-card s3d d${(index % 3) + 1}`}
              >
                <div className="value-icon">
                  <Icon svg={value.icon} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gm-section">
        <div className="inner">
          <div
            style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 56px' }}
          >
            <div className="tag s3d">Our Direction</div>
            <h2 className="h2 s3d d1" style={{ maxWidth: '100%' }}>
              Our Goal &amp; <em>Mission</em>
            </h2>
            <p className="sub s3d d2" style={{ margin: '0 auto' }}>
              What we aim to achieve, and how we get there every single day.
            </p>
          </div>

          <div className="gm-grid">
            <div className="gm-card s3d-left">
              <div className="gm-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <h3>
                Our <em>Goal</em>
              </h3>
              <p>
                To become Malaysia&rsquo;s most trusted name in construction and
                manpower supply — recognised for uncompromising quality, on-time
                delivery, and lasting client partnerships across the nation and
                beyond.
              </p>
              <ul>
                <li>Expand our skilled workforce to 2,000+ professionals</li>
                <li>Deliver 100+ successful projects across Malaysia</li>
                <li>
                  Set the benchmark for safety and reliability in the industry
                </li>
              </ul>
            </div>

            <div className="gm-card s3d-right">
              <div className="gm-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 21V4m0 0s1.5-1 4-1 4 1.5 7 1.5 4-1 4-1v9s-1.5 1-4 1-4-1.5-7-1.5-4 1-4 1" />
                </svg>
              </div>
              <h3>
                Our <em>Mission</em>
              </h3>
              <p>
                To deliver reliable, high-quality construction, manpower, and
                maintenance solutions that exceed expectations — while keeping
                every worker safe, every client informed, and every project on
                schedule and within budget.
              </p>
              <ul>
                <li>
                  Provide skilled, certified, and dependable manpower on demand
                </li>
                <li>
                  Build with integrity, precision, and full regulatory compliance
                </li>
                <li>Invest in our people through training, safety, and welfare</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="inner">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
            <div className="tag s3d">Leadership</div>
            <h2 className="h2 s3d d1" style={{ maxWidth: '100%' }}>
              Our <em>Management</em>
            </h2>
            <p className="sub s3d d2" style={{ margin: '0 auto' }}>
              The people who lead Arifa Overseas with vision, experience, and
              dedication.
            </p>
          </div>

          <div className="team-grid">
            {team.map((member, index) => (
              <div
                key={member.id}
                className={`team-card ${index % 2 === 0 ? 's3d-left' : 's3d-right'}`}
              >
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    className="team-img"
                    width={member.width}
                    height={member.height}
                    sizes="(max-width: 900px) 100vw, 50vw"
                    loading="lazy"
                  />
                ) : (
                  <div className="team-avatar">
                    <div className="ta-circle">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="9" r="3.6" />
                        <path d="M6.5 11.5C6 7 8.5 3.5 12 3.5s6 3.5 5.5 8" />
                        <path d="M5 21v-.5a7 7 0 0114 0v.5" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="team-body">
                  <h3>{member.name}</h3>
                  <div className="team-role">{member.role}</div>
                  <p>{member.bio}</p>
                  <div className="dir-msg">
                    <p>{member.quote}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
