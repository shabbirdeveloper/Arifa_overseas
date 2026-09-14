import { requireAdmin } from '@/lib/admin/guard';
import type { JobRow } from '@/lib/supabase/types';
import { createJob, updateJob } from './actions';
import { JobForm } from './JobForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Jobs' };

export default async function AdminJobsPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('sort_order', { ascending: true });

  const jobs = (data ?? []) as JobRow[];
  const nextSortOrder =
    jobs.length > 0 ? Math.max(...jobs.map((job) => job.sort_order)) + 1 : 0;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <div className="adm-head">
        <h1>Jobs</h1>
        <span className="adm-meta">{jobs.length} listings</span>
      </div>
      <p className="adm-sub">
        Open positions on the Careers page. Each published job is also published
        as Google Jobs structured data, so the posted and closing dates matter —
        Google stops showing a listing once it has closed.
      </p>

      {error ? (
        <div className="adm-note adm-note-error">
          Could not load jobs: {error.message}
        </div>
      ) : null}

      <section className="adm-panel adm-new">
        <h2>Add a job</h2>
        <JobForm action={createJob} nextSortOrder={nextSortOrder} />
      </section>

      <section>
        {jobs.map((job) => {
          const expired = Boolean(job.valid_through && job.valid_through < today);
          return (
            <details className="adm-row" key={job.id}>
              <summary>
                <span className="adm-row-title">{job.title}</span>
                <span className="adm-row-meta">
                  <span className="adm-pill">{job.category_label || job.category}</span>
                  {expired ? <span className="adm-pill">Closed</span> : null}
                  <span
                    className={`adm-pill ${job.is_published ? 'adm-pill-on' : 'adm-pill-off'}`}
                  >
                    {job.is_published ? 'Live' : 'Hidden'}
                  </span>
                </span>
              </summary>
              <div className="adm-row-body">
                {expired ? (
                  <div className="adm-note adm-note-info">
                    The closing date has passed. The job still shows on the site,
                    but Google will have dropped it — update the date or hide it.
                  </div>
                ) : null}
                <JobForm action={updateJob} job={job} />
              </div>
            </details>
          );
        })}

        {jobs.length === 0 && !error ? (
          <div className="adm-note adm-note-info">
            No jobs yet. Run <code>supabase/seed.sql</code> to import the nine from
            the current site, or add one above.
          </div>
        ) : null}
      </section>
    </>
  );
}
