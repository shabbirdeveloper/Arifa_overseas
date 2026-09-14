import { requireAdmin } from '@/lib/admin/guard';
import type { TeamMemberRow } from '@/lib/supabase/types';
import { createTeamMember, updateTeamMember } from './actions';
import { TeamForm } from './TeamForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Team' };

export default async function AdminTeamPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order', { ascending: true });

  const members = (data ?? []) as TeamMemberRow[];
  const nextSortOrder =
    members.length > 0
      ? Math.max(...members.map((member) => member.sort_order)) + 1
      : 0;

  return (
    <>
      <div className="adm-head">
        <h1>Team</h1>
        <span className="adm-meta">{members.length} members</span>
      </div>
      <p className="adm-sub">
        The leadership cards on the About page. Members without a photo fall back
        to the outline avatar, exactly as they do today.
      </p>

      {error ? (
        <div className="adm-note adm-note-error">
          Could not load the team: {error.message}. If you have not run
          <code> supabase/schema.sql </code> yet, do that first.
        </div>
      ) : null}

      <section className="adm-panel adm-new">
        <h2>Add a team member</h2>
        <TeamForm action={createTeamMember} nextSortOrder={nextSortOrder} />
      </section>

      <section>
        {members.map((member) => (
          <details className="adm-row" key={member.id}>
            <summary>
              <span className="adm-row-title">{member.name}</span>
              <span className="adm-row-meta">
                <span>{member.role}</span>
                <span
                  className={`adm-pill ${member.is_published ? 'adm-pill-on' : 'adm-pill-off'}`}
                >
                  {member.is_published ? 'Live' : 'Hidden'}
                </span>
              </span>
            </summary>
            <div className="adm-row-body">
              <TeamForm action={updateTeamMember} member={member} />
            </div>
          </details>
        ))}

        {members.length === 0 && !error ? (
          <div className="adm-note adm-note-info">
            No team members yet. Run <code>supabase/seed.sql</code> to import the
            four from the current site, or add them above.
          </div>
        ) : null}
      </section>
    </>
  );
}
