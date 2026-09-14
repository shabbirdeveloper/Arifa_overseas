import { requireAdmin } from '@/lib/admin/guard';
import type { FeaturedProjectRow } from '@/lib/supabase/types';
import { createFeaturedProject, updateFeaturedProject } from './actions';
import { ProjectForm } from './ProjectForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Featured projects' };

export default async function AdminProjectsPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from('featured_projects')
    .select('*')
    .order('sort_order', { ascending: true });

  const projects = (data ?? []) as FeaturedProjectRow[];
  const nextSortOrder =
    projects.length > 0
      ? Math.max(...projects.map((project) => project.sort_order)) + 1
      : 0;

  return (
    <>
      <div className="adm-head">
        <h1>Featured projects</h1>
        <span className="adm-meta">{projects.length} tiles</span>
      </div>
      <p className="adm-sub">
        The image tiles at the top of the Projects page. The category also drives
        the filter buttons above them.
      </p>

      {error ? (
        <div className="adm-note adm-note-error">
          Could not load projects: {error.message}
        </div>
      ) : null}

      <section className="adm-panel adm-new">
        <h2>Add a project</h2>
        <ProjectForm action={createFeaturedProject} nextSortOrder={nextSortOrder} />
      </section>

      <section>
        {projects.map((project) => (
          <details className="adm-row" key={project.id}>
            <summary>
              <span className="adm-row-title">{project.title}</span>
              <span className="adm-row-meta">
                <span className="adm-pill">{project.category}</span>
                {project.is_tall ? <span className="adm-pill">Tall</span> : null}
                <span
                  className={`adm-pill ${project.is_published ? 'adm-pill-on' : 'adm-pill-off'}`}
                >
                  {project.is_published ? 'Live' : 'Hidden'}
                </span>
              </span>
            </summary>
            <div className="adm-row-body">
              <ProjectForm action={updateFeaturedProject} project={project} />
            </div>
          </details>
        ))}

        {projects.length === 0 && !error ? (
          <div className="adm-note adm-note-info">
            No projects yet. Run <code>supabase/seed.sql</code> to import the nine
            from the current site, or add one above.
          </div>
        ) : null}
      </section>
    </>
  );
}
