'use server';

import { z } from 'zod';
import {
  checkbox,
  commaToArray,
  fail,
  ok,
  optionalText,
  revalidatePublic,
  sortOrder,
  text,
  withAdmin,
  zodFields,
  type ActionResult,
} from '@/lib/admin/actions';

// ── groups ──────────────────────────────────────────────────────────────────

const groupSchema = z.object({
  badge: text(60, 'Please enter the badge text, e.g. 2024.'),
  title: text(160, 'Please enter a heading.'),
  style: z.enum(['default', 'ongoing', 'primary', 'muted'], {
    message: 'Choose a badge style.',
  }),
  sort_order: sortOrder,
});

function parseGroup(formData: FormData) {
  return groupSchema.safeParse({
    badge: formData.get('badge') ?? '',
    title: formData.get('title') ?? '',
    style: formData.get('style') ?? 'default',
    sort_order: formData.get('sort_order') ?? 0,
  });
}

export async function createGroup(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return withAdmin(async ({ supabase }) => {
    const parsed = parseGroup(formData);
    if (!parsed.success) {
      return fail('Please check the highlighted fields.', zodFields(parsed.error));
    }

    const { error } = await supabase
      .from('project_history_groups')
      .insert(parsed.data);
    if (error) return fail(`Could not save: ${error.message}`);

    revalidatePublic('/projects');
    return ok(`${parsed.data.title} added.`);
  });
}

export async function updateGroup(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return withAdmin(async ({ supabase }) => {
    const id = String(formData.get('id') ?? '');
    if (!id) return fail('Missing record id.');

    if (formData.get('intent') === 'delete') {
      // The items FK cascades, so deleting a group removes its records too.
      const { error } = await supabase
        .from('project_history_groups')
        .delete()
        .eq('id', id);
      if (error) return fail(`Could not delete: ${error.message}`);
      revalidatePublic('/projects');
      return ok('Group and its records deleted.');
    }

    const parsed = parseGroup(formData);
    if (!parsed.success) {
      return fail('Please check the highlighted fields.', zodFields(parsed.error));
    }

    const { error } = await supabase
      .from('project_history_groups')
      .update(parsed.data)
      .eq('id', id);
    if (error) return fail(`Could not save: ${error.message}`);

    revalidatePublic('/projects');
    return ok('Saved.');
  });
}

// ── items ───────────────────────────────────────────────────────────────────

const itemSchema = z.object({
  group_id: z.string().uuid('Choose which year group this belongs to.'),
  num: optionalText(10),
  client: text(200, 'Please enter the client.'),
  value: optionalText(60),
  title: text(240, 'Please enter what the work was.'),
  scope: optionalText(1000),
  tags: commaToArray(12),
  is_ongoing: checkbox,
  is_highlight: checkbox,
  is_mega: checkbox,
  mega_badge: optionalText(60),
  sort_order: sortOrder,
  is_published: checkbox,
});

type ItemInput = z.infer<typeof itemSchema>;

function parseItem(formData: FormData) {
  return itemSchema.safeParse({
    group_id: formData.get('group_id') ?? '',
    num: formData.get('num') ?? '',
    client: formData.get('client') ?? '',
    value: formData.get('value') ?? '',
    title: formData.get('title') ?? '',
    scope: formData.get('scope') ?? '',
    tags: formData.get('tags') ?? '',
    is_ongoing: formData.get('is_ongoing'),
    is_highlight: formData.get('is_highlight'),
    is_mega: formData.get('is_mega'),
    mega_badge: formData.get('mega_badge') ?? '',
    sort_order: formData.get('sort_order') ?? 0,
    is_published: formData.get('is_published'),
  });
}

const toItemRow = (data: ItemInput) => ({
  group_id: data.group_id,
  num: data.num,
  client: data.client,
  value: data.value,
  title: data.title,
  scope: data.scope,
  tags: data.tags,
  is_ongoing: data.is_ongoing,
  is_highlight: data.is_highlight,
  is_mega: data.is_mega,
  mega_badge: data.mega_badge,
  sort_order: data.sort_order,
  is_published: data.is_published,
});

export async function createHistoryItem(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return withAdmin(async ({ supabase }) => {
    const parsed = parseItem(formData);
    if (!parsed.success) {
      return fail('Please check the highlighted fields.', zodFields(parsed.error));
    }

    const { error } = await supabase
      .from('project_history_items')
      .insert(toItemRow(parsed.data));
    if (error) return fail(`Could not save: ${error.message}`);

    revalidatePublic('/projects');
    return ok(`${parsed.data.client} added.`);
  });
}

export async function updateHistoryItem(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return withAdmin(async ({ supabase }) => {
    const id = String(formData.get('id') ?? '');
    if (!id) return fail('Missing record id.');

    if (formData.get('intent') === 'delete') {
      const { error } = await supabase
        .from('project_history_items')
        .delete()
        .eq('id', id);
      if (error) return fail(`Could not delete: ${error.message}`);
      revalidatePublic('/projects');
      return ok('Deleted.');
    }

    const parsed = parseItem(formData);
    if (!parsed.success) {
      return fail('Please check the highlighted fields.', zodFields(parsed.error));
    }

    const { error } = await supabase
      .from('project_history_items')
      .update(toItemRow(parsed.data))
      .eq('id', id);
    if (error) return fail(`Could not save: ${error.message}`);

    revalidatePublic('/projects');
    return ok('Saved.');
  });
}
