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
  title: text(200, 'Please enter a project title.'),
  category: z.enum(['Construction', 'Manpower', 'Maintenance'], {
    message: 'Choose a category.',
  }),
  description: optionalText(600),
  image_url: text(1000, 'Upload an image or paste an image URL.'),
  image_alt: optionalText(200),
  image_width: z.coerce.number().int().min(0).max(20000).catch(0),
  image_height: z.coerce.number().int().min(0).max(20000).catch(0),
  is_tall: checkbox,
  sort_order: sortOrder,
  is_published: checkbox,
});

type ProjectInput = z.infer<typeof schema>;

function parse(formData: FormData) {
  return schema.safeParse({
    title: formData.get('title') ?? '',
    category: formData.get('category') ?? '',
    description: formData.get('description') ?? '',
    image_url: formData.get('image_url') ?? '',
    image_alt: formData.get('image_alt') ?? '',
    image_width: formData.get('image_width') ?? 0,
    image_height: formData.get('image_height') ?? 0,
    is_tall: formData.get('is_tall'),
    sort_order: formData.get('sort_order') ?? 0,
    is_published: formData.get('is_published'),
  });
}

const toRow = (data: ProjectInput) => ({
  title: data.title,
  category: data.category,
  description: data.description,
  image_url: data.image_url,
  image_alt: data.image_alt || data.title,
  image_width: data.image_width || null,
  image_height: data.image_height || null,
  is_tall: data.is_tall,
  sort_order: data.sort_order,
  is_published: data.is_published,
});

export async function createFeaturedProject(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return withAdmin(async ({ supabase }) => {
    const parsed = parse(formData);
    if (!parsed.success) {
      return fail('Please check the highlighted fields.', zodFields(parsed.error));
    }

    const { error } = await supabase
      .from('featured_projects')
      .insert(toRow(parsed.data));
    if (error) return fail(`Could not save: ${error.message}`);

    revalidatePublic('/projects');
    return ok(`${parsed.data.title} added.`);
  });
}

export async function updateFeaturedProject(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return withAdmin(async ({ supabase }) => {
    const id = String(formData.get('id') ?? '');
    if (!id) return fail('Missing record id.');

    if (formData.get('intent') === 'delete') {
      const { error } = await supabase.from('featured_projects').delete().eq('id', id);
      if (error) return fail(`Could not delete: ${error.message}`);
      revalidatePublic('/projects');
      return ok('Deleted.');
    }

    const parsed = parse(formData);
    if (!parsed.success) {
      return fail('Please check the highlighted fields.', zodFields(parsed.error));
    }

    const { error } = await supabase
      .from('featured_projects')
      .update(toRow(parsed.data))
      .eq('id', id);

    if (error) return fail(`Could not save: ${error.message}`);

    revalidatePublic('/projects');
    return ok('Saved.');
  });
}
