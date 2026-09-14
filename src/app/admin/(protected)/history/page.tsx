import { requireAdmin } from '@/lib/admin/guard';
import type { HistoryGroupRow, HistoryItemRow } from '@/lib/supabase/types';
import { SortableList } from '../_components/SortableList';
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
    groups.length > 0
      ? Math.max(...groups.map((group) => group.sort_order)) + 1
      : 0;

  const hidden = items.filter((item) => !item.is_published).length;

  return (
    <>
      <div className="adm-head">
        <h1>Project history</h1>
        <p className="adm-sub">
          The track record further down the Projects page. Records sit inside
          year groups; both the groups and the records inside them can be
          reordered by dragging, or with the arrow buttons.
        </p>
      </div>

      {error ? (
        <div className="adm-note adm-note-error">
          <div>
            Could not load the history: {error.message}. If you have not run{' '}
            <code>supabase/schema.sql</code> yet, do that first.
          </div>
        </div>
      ) : null}

      {hidden > 0 ? (
        <div className="adm-note adm-note-info">
          <div>
            {hidden === 1
              ? '1 record is hidden'
              : `${hidden} records are hidden`}{' '}
            and does not appear on the site.
          </div>
        </div>
      ) : null}

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h2>Year groups</h2>
          <span className="adm-meta">
            {groups.length} {groups.length === 1 ? 'group' : 'groups'} ·{' '}
            {items.length} {items.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        <details className="adm-panel adm-new">
          <summary>Add a year group</summary>
          <GroupForm action={createGroup} nextSortOrder={nextGroupOrder} />
        </details>

        <SortableList
          table="project_history_groups"
          items={groups.map((group) => {
            const count = (itemsByGroup.get(group.id) ?? []).length;
            return {
              id: group.id,
              title: `${group.badge} — ${group.title}`,
              subtitle: `${count} ${count === 1 ? 'record' : 'records'}`,
              badges: <span className="adm-pill">{group.style}</span>,
              body: <GroupForm action={updateGroup} group={group} />,
            };
          })}
          empty={
            error ? null : (
              <div className="adm-empty">
                <h3>No year groups yet</h3>
                <p>
                  Run <code>supabase/seed.sql</code> to import the 26 records
                  from the current site, or start a group above.
                </p>
              </div>
            )
          }
        />
      </section>

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
                <span className="adm-pill">{group.badge}</span> {group.title}
              </h2>
              <span className="adm-meta">
                {groupItems.length}{' '}
                {groupItems.length === 1 ? 'record' : 'records'}
              </span>
            </div>

            <details className="adm-panel adm-new">
              <summary>Add a record to {group.badge}</summary>
              <ItemForm
                action={createHistoryItem}
                groups={groups}
                defaultGroupId={group.id}
                nextSortOrder={nextItemOrder}
              />
            </details>

            <SortableList
              table="project_history_items"
              items={groupItems.map((item) => ({
                id: item.id,
                title: `${item.num ? `${item.num}. ` : ''}${item.client}`,
                subtitle: item.title,
                badges: (
                  <>
                    {item.value ? (
                      <span className="adm-meta">{item.value}</span>
                    ) : null}
                    {item.is_mega ? (
                      <span className="adm-pill">Flagship</span>
                    ) : null}
                    {item.is_ongoing ? (
                      <span className="adm-pill">Ongoing</span>
                    ) : null}
                    <span
                      className={`adm-pill ${item.is_published ? 'adm-pill-on' : 'adm-pill-off'}`}
                    >
                      {item.is_published ? 'Live' : 'Hidden'}
                    </span>
                  </>
                ),
                body: (
                  <ItemForm
                    action={updateHistoryItem}
                    groups={groups}
                    item={item}
                  />
                ),
              }))}
              empty={<p className="adm-meta">No records in this group yet.</p>}
            />
          </section>
        );
      })}
    </>
  );
}
