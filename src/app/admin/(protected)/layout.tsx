import { checkAdminAccess } from '@/lib/admin/guard';
import { NoAccess } from './NoAccess';
import { Sidebar, type SectionCounts } from './_components/Sidebar';
import { Topbar } from './_components/Topbar';

export const dynamic = 'force-dynamic';

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The real gate. Middleware also checks, but middleware is not a boundary.
  const access = await checkAdminAccess();

  // Signed in, but not allowed: explain it here rather than redirecting —
  // a redirect back to the login page is how the loop used to happen.
  if (access.status === 'not-admin') {
    return <NoAccess email={access.user.email} />;
  }
  if (access.status === 'check-failed') {
    return <NoAccess email={access.user.email} error={access.message} />;
  }

  const { supabase, user } = access;

  // Counts live in the sidebar, so they are fetched once for the whole area.
  const [team, projects, history, jobs, certificates] = await Promise.all([
    supabase.from('team_members').select('*', { count: 'exact', head: true }),
    supabase.from('featured_projects').select('*', { count: 'exact', head: true }),
    supabase
      .from('project_history_items')
      .select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }),
    supabase.from('certificates').select('*', { count: 'exact', head: true }),
  ]);

  const counts: SectionCounts = {
    team: team.count ?? 0,
    projects: projects.count ?? 0,
    history: history.count ?? 0,
    jobs: jobs.count ?? 0,
    certificates: certificates.count ?? 0,
  };

  return (
    <div className="adm-shell">
      <Sidebar counts={counts} email={user.email} />

      <div className="adm-body">
        <Topbar />
        <main className="adm-main">{children}</main>
      </div>
    </div>
  );
}
