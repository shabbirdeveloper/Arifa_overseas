import { requireAdmin } from '@/lib/admin/guard';
import type { JobRow } from '@/lib/supabase/types';
import { SortableList } from '../_components/SortableList';
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
  const expired = jobs.filter(
    (job) => job.is_published && job.valid_through && job.valid_through < today,
  );

  return (
    <>
      <div className="adm-head">
        <h1>Jobs</h1>
        <p className="adm-sub">
          Open positions on the Careers page. Every published job is also
          published as Google Jobs structured data, so the closing date matters —
          Google drops a listing once it has passed.
        </p>
      </div>

      {error ? (
        <div className="adm-note adm-note-error">
          <div>Could not load jobs: {error.message}</div>
        </div>
      ) : null}

      {expired.length > 0 ? (
        <div className="adm-note adm-note-info">
          <div>
            {expired.length === 1
              ? '1 published job has passed its closing date'
              : `${expired.length} published jobs have passed their closing date`}{' '}
            and will have dropped out of Google Jobs. Update the date or hide
            them.
          </div>
        </div>
      ) : null}

      <details className="adm-panel adm-new">
        <summary>Add a job</summary>
        <JobForm action={createJob} nextSortOrder={nextSortOrder} />
      </details>

      <SortableList
        table="jobs"
        items={jobs.map((job) => {
          const isExpired = Boolean(
            job.valid_through && job.valid_through < today,
          );
          return {
            id: job.id,
            title: job.title,
            subtitle: [job.salary, job.location].filter(Boolean).join(' · '),
            badges: (
              <>
                <span className="adm-pill">
                  {job.category_label || job.category}
                </span>
                {isExpired ? (
                  <span className="adm-pill adm-pill-warn">Closed</span>
                ) : null}
                <span
                  className={`adm-pill ${job.is_published ? 'adm-pill-on' : 'adm-pill-off'}`}
                >
                  {job.is_published ? 'Live' : 'Hidden'}
                </span>
              </>
            ),
            body: (
              <>
                {isExpired ? (
                  <div className="adm-note adm-note-info">
                    <div>
                      The closing date has passed. The job still shows on the
                      site, but Google will have dropped it.
                    </div>
                  </div>
                ) : null}
                <JobForm action={updateJob} job={job} />
              </>
            ),
          };
        })}
        empty={
          error ? null : (
            <div className="adm-empty">
              <h3>No jobs yet</h3>
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
