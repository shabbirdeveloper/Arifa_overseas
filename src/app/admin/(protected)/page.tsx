import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/guard';
import {
  IconHistory,
  IconJobs,
  IconProjects,
  IconTeam,
} from './_components/icons';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard' };

type Timestamped = { id: string; is_published: boolean; updated_at: string };

interface Activity {
  id: string;
  label: string;
  section: string;
  href: string;
  updatedAt: string;
}

/**
 * Short relative time. Rendered on the server, and this page is dynamic, so
 * there is no client/server clock to disagree about.
 */
function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';

  const minutes = Math.round((Date.now() - then) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days < 31) return `${days}d ago`;

  return new Date(iso).toISOString().slice(0, 10);
}

function daysUntil(date: string): number {
  const target = new Date(`${date}T00:00:00Z`).getTime();
  const today = new Date(new Date().toISOString().slice(0, 10)).getTime();
  return Math.round((target - today) / 86_400_000);
}

export default async function AdminDashboard() {
  const { supabase } = await requireAdmin();

  const [teamResult, projectResult, historyResult, jobResult] =
    await Promise.all([
      supabase
        .from('team_members')
        .select('id,name,is_published,updated_at')
        .order('updated_at', { ascending: false }),
      supabase
        .from('featured_projects')
        .select('id,title,is_published,updated_at')
        .order('updated_at', { ascending: false }),
      supabase
        .from('project_history_items')
        .select('id,client,is_published,updated_at')
        .order('updated_at', { ascending: false }),
      supabase
        .from('jobs')
        .select('id,title,is_published,valid_through,updated_at')
        .order('updated_at', { ascending: false }),
    ]);

  const firstError =
    teamResult.error ??
    projectResult.error ??
    historyResult.error ??
    jobResult.error;

  const team = (teamResult.data ?? []) as (Timestamped & { name: string })[];
  const projects = (projectResult.data ?? []) as (Timestamped & {
    title: string;
  })[];
  const history = (historyResult.data ?? []) as (Timestamped & {
    client: string;
  })[];
  const jobs = (jobResult.data ?? []) as (Timestamped & {
    title: string;
    valid_through: string | null;
  })[];

  const stats = [
    {
      key: 'team',
      label: 'Team members',
      href: '/admin/team',
      icon: <IconTeam />,
      page: 'About page',
      rows: team as Timestamped[],
    },
    {
      key: 'projects',
      label: 'Featured projects',
      href: '/admin/projects',
      icon: <IconProjects />,
      page: 'Projects page',
      rows: projects as Timestamped[],
    },
    {
      key: 'history',
      label: 'History records',
      href: '/admin/history',
      icon: <IconHistory />,
      page: 'Projects page',
      rows: history as Timestamped[],
    },
    {
      key: 'jobs',
      label: 'Job listings',
      href: '/admin/jobs',
      icon: <IconJobs />,
      page: 'Careers page',
      rows: jobs as Timestamped[],
    },
  ];

  const activity: Activity[] = [
    ...team.map((row) => ({
      id: `team-${row.id}`,
      label: row.name,
      section: 'Team',
      href: '/admin/team',
      updatedAt: row.updated_at,
    })),
    ...projects.map((row) => ({
      id: `project-${row.id}`,
      label: row.title,
      section: 'Featured project',
      href: '/admin/projects',
      updatedAt: row.updated_at,
    })),
    ...history.map((row) => ({
      id: `history-${row.id}`,
      label: row.client,
      section: 'History record',
      href: '/admin/history',
      updatedAt: row.updated_at,
    })),
    ...jobs.map((row) => ({
      id: `job-${row.id}`,
      label: row.title,
      section: 'Job',
      href: '/admin/jobs',
      updatedAt: row.updated_at,
    })),
  ]
    .filter((entry) => Boolean(entry.updatedAt))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 7);

  const closingSoon = jobs
    .filter((job) => job.is_published && job.valid_through)
    .map((job) => ({ ...job, days: daysUntil(job.valid_through as string) }))
    .filter((job) => job.days <= 14)
    .sort((a, b) => a.days - b.days);

  const totalHidden = stats.reduce(
    (sum, section) =>
      sum + section.rows.filter((row) => !row.is_published).length,
    0,
  );
  const allEmpty = stats.every((section) => section.rows.length === 0);

  return (
    <>
      <div className="adm-head">
        <h1>Dashboard</h1>
        <p className="adm-sub">
          Everything on the public site that you can change from here. Edits go
          live within a few seconds — the pages stay pre-rendered, and saving
          refreshes only the page you touched.
        </p>
      </div>

      {firstError ? (
        <div className="adm-note adm-note-error">
          <div>
            The database is reachable but something is missing:{' '}
            {firstError.message}. Run <code>supabase/schema.sql</code> in the
            Supabase SQL editor.
          </div>
        </div>
      ) : allEmpty ? (
        <div className="adm-note adm-note-info">
          <div>
            Every section is empty, so the site is still serving its built-in
            content. Run <code>supabase/seed.sql</code> to import what is on the
            site today, then edit it here.
          </div>
        </div>
      ) : null}

      {closingSoon.length > 0 ? (
        <div className="adm-note adm-note-info">
          <div>
            {closingSoon.length === 1
              ? '1 published job is at or past its closing date'
              : `${closingSoon.length} published jobs are at or past their closing date`}
            {' — '}
            Google stops showing a listing once that date passes.{' '}
            <Link href="/admin/jobs">Review the dates</Link>.
          </div>
        </div>
      ) : null}

      <div className="adm-stats">
        {stats.map((section) => {
          const total = section.rows.length;
          const live = section.rows.filter((row) => row.is_published).length;
          const hidden = total - live;

          return (
            <Link className="adm-stat" href={section.href} key={section.key}>
              <span className="adm-stat-top">
                {section.icon}
                {section.label}
              </span>
              <span className="adm-stat-value">{total}</span>
              <span className="adm-stat-note">
                <b>{live}</b> live
                {hidden > 0 ? (
                  <>
                    {' · '}
                    <b>{hidden}</b> hidden
                  </>
                ) : null}
                {' · '}
                {section.page}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="adm-columns">
        <section className="adm-panel">
          <div className="adm-panel-head">
            <h2>Recent edits</h2>
            {totalHidden > 0 ? (
              <span className="adm-meta">
                {totalHidden} hidden across the site
              </span>
            ) : null}
          </div>

          {activity.length > 0 ? (
            <ul className="adm-activity">
              {activity.map((entry) => (
                <li key={entry.id}>
                  <span className="adm-activity-dot" aria-hidden="true" />
                  <span className="adm-activity-main">
                    <strong>
                      <Link href={entry.href}>{entry.label}</Link>
                    </strong>
                    <span>{entry.section}</span>
                  </span>
                  <time dateTime={entry.updatedAt}>
                    {relativeTime(entry.updatedAt)}
                  </time>
                </li>
              ))}
            </ul>
          ) : (
            <p className="adm-meta">
              Nothing has been edited yet. Once you save a change it shows up
              here.
            </p>
          )}
        </section>

        <section className="adm-panel">
          <div className="adm-panel-head">
            <h2>Quick actions</h2>
          </div>

          <div className="adm-quick">
            <Link href="/admin/team">Add a team member</Link>
            <Link href="/admin/projects">Add a featured project</Link>
            <Link href="/admin/history">Add a history record</Link>
            <Link href="/admin/jobs">Post a job</Link>
            <a href="/" target="_blank" rel="noreferrer">
              Open the live site
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
