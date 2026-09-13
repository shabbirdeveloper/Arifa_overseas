import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { PageHero } from '@/components/ui/PageHero';
import { projectHistory } from '@/content/projects';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Our Projects',
  description:
    'Over RM 50 million in completed work — Intel Falcon (Kulim), Samsung SDI, RAPID Pengerang and more, across construction, manpower and maintenance in Malaysia.',
  path: '/projects',
});

/** The legacy cards carried inline styles; these parse the ones we kept. */
function parseStyle(style: string): React.CSSProperties | undefined {
  if (!style) return undefined;

  const result: React.CSSProperties = {};
  for (const declaration of style.split(';')) {
    const [rawProperty, ...rest] = declaration.split(':');
    const property = rawProperty?.trim();
    const value = rest.join(':').trim();
    if (!property || !value) continue;

    switch (property) {
      case 'background':
        result.background = value;
        break;
      case 'border':
        result.border = value;
        break;
      case 'animation':
        result.animation = value;
        break;
      case 'color':
        result.color = value;
        break;
      case 'font-size':
        result.fontSize = value;
        break;
      case 'font-weight':
        result.fontWeight = value;
        break;
      case 'border-color':
        result.borderColor = value;
        break;
      default:
        break;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

export default function ProjectsPage() {
  return (
    <div id="page-projects" className="page active">
      <PageHero
        tag="Our Portfolio"
        headingHtml='Featured <em style="color:var(--blue);font-style:normal;font-weight:400;">Projects</em>'
        intro="Over 50 completed projects across construction, manpower deployment, and maintenance in Malaysia."
      />

      <section className="projects-section">
        <div className="inner">
          <FeaturedProjects />
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

          {projectHistory.map((group) => (
            <div className="ph-year-section s3d" key={group.badge + group.title}>
              <div className="ph-year-header">
                <div
                  className="ph-year-badge"
                  style={parseStyle(group.badgeStyle)}
                >
                  {group.badge}
                </div>
                <h3 className="ph-year-title">{group.title}</h3>
                <div className="ph-year-line" />
              </div>

              <div
                className={group.cards.some((card) => card.mega) ? undefined : 'ph-cards-grid'}
                style={
                  group.cards.some((card) => card.mega)
                    ? { maxWidth: 600 }
                    : undefined
                }
              >
                {group.cards.map((card, index) => (
                  <div
                    key={card.num + card.client}
                    className={[
                      'ph-card',
                      card.ongoing ? 'ph-card-ongoing' : '',
                      card.highlight ? 'ph-card-highlight' : '',
                      card.mega ? 'ph-card-mega' : '',
                      card.ongoing || card.mega ? `s3d d${(index % 3) + 1}` : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {card.ongoing ? <div className="ph-ongoing-dot" /> : null}
                    {card.megaBadge ? (
                      <div className="ph-mega-badge">{card.megaBadge}</div>
                    ) : null}

                    <div
                      className="ph-card-top"
                      style={card.mega ? { marginTop: 12 } : undefined}
                    >
                      <div className="ph-card-num">{card.num}</div>
                      <div className="ph-card-client">{card.client}</div>
                      <div
                        className={`ph-card-value${card.ongoing ? ' ongoing-val' : ''}`}
                        style={parseStyle(card.valueStyle)}
                      >
                        {card.value}
                      </div>
                    </div>

                    <h4
                      className="ph-card-title"
                      style={card.mega ? { fontSize: '1.15rem' } : undefined}
                    >
                      {card.title}
                    </h4>
                    <p className="ph-card-scope">{card.scope}</p>

                    <div className="ph-card-tags">
                      {card.tags.map((tag) => (
                        <span
                          key={tag.label}
                          className={`ph-tag${tag.ongoing ? ' ongoing-tag' : ''}`}
                          style={parseStyle(tag.style)}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
