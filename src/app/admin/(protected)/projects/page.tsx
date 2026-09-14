import { requireAdmin } from '@/lib/admin/guard';
import type { FeaturedProjectRow } from '@/lib/supabase/types';
import { SortableList } from '../_components/SortableList';
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
        <p className="adm-sub">
          The image tiles at the top of the Projects page, in this order. The
          category also drives the filter buttons above them.
        </p>
      </div>

      {error ? (
        <div className="adm-note adm-note-error">
          <div>Could not load projects: {error.message}</div>
        </div>
      ) : null}

      <details className="adm-panel adm-new">
        <summary>Add a project</summary>
        <ProjectForm
          action={createFeaturedProject}
          nextSortOrder={nextSortOrder}
        />
      </details>

      <SortableList
        table="featured_projects"
        items={projects.map((project) => ({
          id: project.id,
          title: project.title,
          subtitle: project.description || project.category,
          thumbnail: project.image_url,
          badges: (
            <>
              <span className="adm-pill">{project.category}</span>
              {project.is_tall ? <span className="adm-pill">Tall</span> : null}
              <span
                className={`adm-pill ${project.is_published ? 'adm-pill-on' : 'adm-pill-off'}`}
              >
                {project.is_published ? 'Live' : 'Hidden'}
              </span>
            </>
          ),
          body: <ProjectForm action={updateFeaturedProject} project={project} />,
        }))}
        empty={
          error ? null : (
            <div className="adm-empty">
              <h3>No projects yet</h3>
              <p>
                Run <code>supabase/seed.sql</code> to import the nine from the
                current site, or add one above.
              </p>
            </div>
          )
        }
      />
    </>
  );
}
