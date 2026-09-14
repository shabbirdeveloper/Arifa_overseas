import { requireAdmin } from '@/lib/admin/guard';
import type { HistoryGroupRow, HistoryItemRow } from '@/lib/supabase/types';
import {
  createGroup,
  createHistoryItem,
  updateGroup,
  updateHistoryItem,
} from './actions';
import { GroupForm, ItemForm } from './HistoryForms';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Project history' };

export default async function AdminHistoryPage() {
  const { supabase } = await requireAdmin();

  const [groupsResult, itemsResult] = await Promise.all([
    supabase
      .from('project_history_groups')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('project_history_items')
      .select('*')
      .order('sort_order', { ascending: true }),
  ]);

  const groups = (groupsResult.data ?? []) as HistoryGroupRow[];
  const items = (itemsResult.data ?? []) as HistoryItemRow[];
  const error = groupsResult.error ?? itemsResult.error;

  const itemsByGroup = new Map<string, HistoryItemRow[]>();
  for (const item of items) {
    itemsByGroup.set(item.group_id, [
      ...(itemsByGroup.get(item.group_id) ?? []),
      item,
    ]);
  }

  const nextGroupOrder =
    groups.length > 0 ? Math.max(...groups.map((group) => group.sort_order)) + 1 : 0;

  return (
    <>
      <div className="adm-head">
        <h1>Project history</h1>
        <span className="adm-meta">
          {groups.length} groups · {items.length} records
        </span>
      </div>
      <p className="adm-sub">
        The track-record section lower down the Projects page. Records are
        organised into year groups; deleting a group deletes its records too.
      </p>

      {error ? (
        <div className="adm-note adm-note-error">
          Could not load the history: {error.message}
        </div>
      ) : null}

      <section className="adm-panel adm-new">
        <h2>Add a year group</h2>
        <GroupForm action={createGroup} nextSortOrder={nextGroupOrder} />
      </section>

      {groups.length > 0 ? (
        <section className="adm-panel adm-new">
          <h2>Add a record</h2>
          <ItemForm
            action={createHistoryItem}
            groups={groups}
            defaultGroupId={groups[0]?.id}
          />
        </section>
      ) : null}

      {groups.map((group) => {
        const groupItems = itemsByGroup.get(group.id) ?? [];
        const nextItemOrder =
          groupItems.length > 0
            ? Math.max(...groupItems.map((item) => item.sort_order)) + 1
            : 0;

        return (
          <section className="adm-panel" key={group.id}>
            <div className="adm-panel-head">
              <h2>
                {group.badge} — {group.title}
              </h2>
              <span className="adm-meta">{groupItems.length} records</span>
            </div>

            <details className="adm-row">
              <summary>
                <span className="adm-row-title">Group settings</span>
                <span className="adm-row-meta">
                  <span className="adm-pill">{group.style}</span>
                </span>
              </summary>
              <div className="adm-row-body">
                <GroupForm action={updateGroup} group={group} />
              </div>
            </details>

            {groupItems.map((item) => (
              <details className="adm-row" key={item.id}>
                <summary>
                  <span className="adm-row-title">
                    {item.num ? `${item.num}. ` : ''}
                    {item.client}
                  </span>
                  <span className="adm-row-meta">
                    {item.value ? <span>{item.value}</span> : null}
                    {item.is_mega ? <span className="adm-pill">Flagship</span> : null}
                    {item.is_ongoing ? <span className="adm-pill">Ongoing</span> : null}
                    <span
                      className={`adm-pill ${item.is_published ? 'adm-pill-on' : 'adm-pill-off'}`}
                    >
                      {item.is_published ? 'Live' : 'Hidden'}
                    </span>
                  </span>
                </summary>
                <div className="adm-row-body">
                  <ItemForm
                    action={updateHistoryItem}
                    groups={groups}
                    item={item}
                    nextSortOrder={nextItemOrder}
                  />
                </div>
              </details>
            ))}

            {groupItems.length === 0 ? (
              <p className="adm-meta">No records in this group yet.</p>
            ) : null}
          </section>
        );
      })}

      {groups.length === 0 && !error ? (
        <div className="adm-note adm-note-info">
          No year groups yet. Run <code>supabase/seed.sql</code> to import the 26
          records from the current site, or start a group above.
        </div>
      ) : null}
    </>
  );
}
