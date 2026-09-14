import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/guard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard' };

const SECTIONS = [
  {
    href: '/admin/team',
    label: 'Team members',
    table: 'team_members' as const,
    page: 'About page',
  },
  {
    href: '/admin/projects',
    label: 'Featured projects',
    table: 'featured_projects' as const,
    page: 'Projects page',
  },
  {
    href: '/admin/history',
    label: 'History records',
    table: 'project_history_items' as const,
    page: 'Projects page',
  },
  {
    href: '/admin/jobs',
    label: 'Job listings',
    table: 'jobs' as const,
    page: 'Careers page',
  },
];

export default async function AdminDashboard() {
  const { supabase } = await requireAdmin();

  const counts = await Promise.all(
    SECTIONS.map(async (section) => {
      const { count, error } = await supabase
        .from(section.table)
        .select('*', { count: 'exact', head: true });
      return { ...section, count: count ?? 0, error: error?.message ?? null };
    }),
  );

  const anyError = counts.find((section) => section.error);
  const allEmpty = counts.every((section) => section.count === 0);

  return (
    <>
      <div className="adm-head">
        <h1>Dashboard</h1>
      </div>
      <p className="adm-sub">
        Edits appear on the live site within a few seconds — pages stay
        pre-rendered, and saving refreshes just the page you changed.
      </p>

      {anyError ? (
        <div className="adm-note adm-note-error">
          The database is reachable but a table is missing: {anyError.error}.
          Run <code>supabase/schema.sql</code> in the Supabase SQL editor.
        </div>
      ) : allEmpty ? (
        <div className="adm-note adm-note-info">
          Everything is empty, so the site is still serving its built-in content.
          Run <code>supabase/seed.sql</code> to import what is on the site today,
          then edit it here.
        </div>
      ) : null}

      <div className="adm-cards">
        {counts.map((section) => (
          <Link className="adm-card" href={section.href} key={section.href}>
            <div className="adm-count">{section.count}</div>
            <div className="adm-label">{section.label}</div>
            <div className="adm-label" style={{ fontSize: '0.72rem', opacity: 0.7 }}>
              {section.page}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
