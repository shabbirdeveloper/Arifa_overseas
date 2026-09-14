import { requireAdmin } from '@/lib/admin/guard';
import type { TeamMemberRow } from '@/lib/supabase/types';
import { SortableList } from '../_components/SortableList';
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
        <p className="adm-sub">
          The leadership cards on the About page, in the order shown here. Drag
          a row — or use the arrows — to reorder. Members without a photo fall
          back to the outline avatar.
        </p>
      </div>

      {error ? (
        <div className="adm-note adm-note-error">
          <div>
            Could not load the team: {error.message}. If you have not run{' '}
            <code>supabase/schema.sql</code> yet, do that first.
          </div>
        </div>
      ) : null}

      <details className="adm-panel adm-new">
        <summary>Add a team member</summary>
        <TeamForm action={createTeamMember} nextSortOrder={nextSortOrder} />
      </details>

      <SortableList
        table="team_members"
        items={members.map((member) => ({
          id: member.id,
          title: member.name,
          subtitle: member.role,
          thumbnail: member.image_url,
          badges: (
            <span
              className={`adm-pill ${member.is_published ? 'adm-pill-on' : 'adm-pill-off'}`}
            >
              {member.is_published ? 'Live' : 'Hidden'}
            </span>
          ),
          body: <TeamForm action={updateTeamMember} member={member} />,
        }))}
        empty={
          error ? null : (
            <div className="adm-empty">
              <h3>No team members yet</h3>
              <p>
                Run <code>supabase/seed.sql</code> to import the four from the
                current site, or add someone above.
              </p>
            </div>
          )
        }
      />
    </>
  );
}
