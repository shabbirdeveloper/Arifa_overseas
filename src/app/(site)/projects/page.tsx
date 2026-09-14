import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { PageHero } from '@/components/ui/PageHero';
import { getFeaturedProjects, getProjectHistory } from '@/lib/data/projects';
import { pageMeta } from '@/lib/seo';

export const revalidate = 3600;

export const metadata = pageMeta({
  title: 'Our Projects',
  description:
    'Over RM 50 million in completed work — Intel Falcon (Kulim), Samsung SDI, RAPID Pengerang and more, across construction, manpower and maintenance in Malaysia.',
  path: '/projects',
});

/**
 * Tag styling is derived from the text so the admin never has to think about
 * CSS: an ongoing marker turns green, a ringgit amount turns gold, everything
 * else is a plain blue chip.
 */
function tagClassName(tag: string): string {
  const value = tag.toLowerCase();
  if (value.includes('going')) return 'ph-tag ongoing-tag';
  if (/^rm\b/i.test(tag.trim())) return 'ph-tag ph-tag-value';
  return 'ph-tag';
}

export default async function ProjectsPage() {
  const [featured, projectHistory] = await Promise.all([
    getFeaturedProjects(),
    getProjectHistory(),
  ]);

  return (
    <div id="page-projects" className="page active">
      <PageHero
        tag="Our Portfolio"
        headingHtml='Featured <em style="color:var(--blue);font-style:normal;font-weight:400;">Projects</em>'
        intro="Over 50 completed projects across construction, manpower deployment, and maintenance in Malaysia."
      />

      <section className="projects-section">
        <div className="inner">
          <FeaturedProjects projects={featured} />
        </div>
      </section>

      <section style={{ background: 'var(--dark2)' }}>
        <div className="inner">
          <div
            style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 50px' }}
          >
            <div className="tag s3d">Track Record</div>
            <h2 className="h2 s3d d1" style={{ maxWidth: '100%' }}>
              Project <em>History</em>
            </h2>
            <p className="sub s3d d2" style={{ margin: '0 auto' }}>
              Over RM 50 million in completed projects across Malaysia — from
              Johor to Sabah, serving global clients.
            </p>
          </div>

          {projectHistory.map((group) => {
            const hasMega = group.items.some((item) => item.isMega);

            return (
              <div className="ph-year-section s3d" key={group.id}>
                <div className="ph-year-header">
                  <div className={`ph-year-badge ph-badge-${group.style}`}>
                    {group.badge}
                  </div>
                  <h3 className="ph-year-title">{group.title}</h3>
                  <div className="ph-year-line" />
                </div>

                {/* A flagship record gets a single wide card instead of the grid. */}
                <div
                  className={hasMega ? undefined : 'ph-cards-grid'}
                  style={hasMega ? { maxWidth: 600 } : undefined}
                >
                  {group.items.map((item, index) => (
                    <div
                      key={item.id}
                      className={[
                        'ph-card',
                        item.isOngoing ? 'ph-card-ongoing' : '',
                        item.isHighlight ? 'ph-card-highlight' : '',
                        item.isMega ? 'ph-card-mega' : '',
                        item.isOngoing || item.isMega
                          ? `s3d d${(index % 3) + 1}`
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {item.isOngoing ? <div className="ph-ongoing-dot" /> : null}
                      {item.isMega && item.megaBadge ? (
                        <div className="ph-mega-badge">{item.megaBadge}</div>
                      ) : null}

                      <div
                        className="ph-card-top"
                        style={item.isMega ? { marginTop: 12 } : undefined}
                      >
                        <div className="ph-card-num">{item.num}</div>
                        <div className="ph-card-client">{item.client}</div>
                        <div
                          className={[
                            'ph-card-value',
                            item.isOngoing ? 'ongoing-val' : '',
                            item.isHighlight || item.isMega ? 'ph-value-gold' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          {item.value}
                        </div>
                      </div>

                      <h4 className="ph-card-title">{item.title}</h4>
                      <p className="ph-card-scope">{item.scope}</p>

                      <div className="ph-card-tags">
                        {item.tags.map((tag) => (
                          <span key={tag} className={tagClassName(tag)}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
