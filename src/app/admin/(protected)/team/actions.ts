'use server';

import { z } from 'zod';
import {
  checkbox,
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

const schema = z.object({
  name: text(160, 'Please enter a name.'),
  role: text(160, 'Please enter a role.'),
  bio: optionalText(2000),
  quote: optionalText(1000),
  image_url: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .transform((value) => (value ? value : null)),
  image_width: z.coerce.number().int().min(0).max(20000).catch(0),
  image_height: z.coerce.number().int().min(0).max(20000).catch(0),
  sort_order: sortOrder,
  is_published: checkbox,
});

type TeamInput = z.infer<typeof schema>;

function parse(formData: FormData) {
  return schema.safeParse({
    name: formData.get('name') ?? '',
    role: formData.get('role') ?? '',
    bio: formData.get('bio') ?? '',
    quote: formData.get('quote') ?? '',
    image_url: formData.get('image_url') ?? '',
    image_width: formData.get('image_width') ?? 0,
    image_height: formData.get('image_height') ?? 0,
    sort_order: formData.get('sort_order') ?? 0,
    is_published: formData.get('is_published'),
  });
}

const toRow = (data: TeamInput) => ({
  name: data.name,
  role: data.role,
  bio: data.bio,
  quote: data.quote,
  image_url: data.image_url,
  image_width: data.image_width || null,
  image_height: data.image_height || null,
  sort_order: data.sort_order,
  is_published: data.is_published,
});

export async function createTeamMember(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return withAdmin(async ({ supabase }) => {
    const parsed = parse(formData);
    if (!parsed.success) {
      return fail('Please check the highlighted fields.', zodFields(parsed.error));
    }

    const { error } = await supabase.from('team_members').insert(toRow(parsed.data));
    if (error) return fail(`Could not save: ${error.message}`);

    revalidatePublic('/about');
    return ok(`${parsed.data.name} added.`);
  });
}

export async function updateTeamMember(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return withAdmin(async ({ supabase }) => {
    const id = String(formData.get('id') ?? '');
    if (!id) return fail('Missing record id.');

    if (formData.get('intent') === 'delete') {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) return fail(`Could not delete: ${error.message}`);
      revalidatePublic('/about');
      return ok('Deleted.');
    }

    const parsed = parse(formData);
    if (!parsed.success) {
      return fail('Please check the highlighted fields.', zodFields(parsed.error));
    }

    const { error } = await supabase
      .from('team_members')
      .update(toRow(parsed.data))
      .eq('id', id);

    if (error) return fail(`Could not save: ${error.message}`);

    revalidatePublic('/about');
    return ok('Saved.');
  });
}
