'use server';

import {
  fail,
  ok,
  revalidatePublic,
  withAdmin,
  type ActionResult,
} from '@/lib/admin/actions';

/**
 * Tables that may be reordered, and which public page each one affects.
 *
 * An allow-list, not a parameter: the table name arrives from the browser, and
 * letting the client name an arbitrary table would be an injection of a
 * different kind — RLS would still block writes, but this keeps the surface
 * honest and the revalidation correct.
 */
const REORDERABLE = {
  team_members: '/about',
  featured_projects: '/projects',
  project_history_items: '/projects',
  project_history_groups: '/projects',
  jobs: '/careers',
  certificates: '/certificates',
} as const;

export type ReorderableTable = keyof typeof REORDERABLE;

/**
 * Persists a new order as sequential sort_order values.
 *
 * Writes each row individually rather than upserting: an upsert would need
 * every non-null column, and a partial upsert silently blanks fields.
 */
export async function reorderRows(
  table: ReorderableTable,
  orderedIds: string[],
): Promise<ActionResult> {
  return withAdmin(async ({ supabase }) => {
    if (!(table in REORDERABLE)) return fail('Unknown section.');
    if (orderedIds.length === 0) return ok('Nothing to reorder.');
    if (orderedIds.length > 300) return fail('Too many rows to reorder at once.');

    const results = await Promise.all(
      orderedIds.map((id, index) =>
        supabase.from(table).update({ sort_order: index }).eq('id', id),
      ),
    );

    const failed = results.find((result) => result.error);
    if (failed?.error) return fail(`Could not save the order: ${failed.error.message}`);

    revalidatePublic(REORDERABLE[table]);
    return ok('Order saved.');
  });
}
