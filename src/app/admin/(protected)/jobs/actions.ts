'use server';

import { z } from 'zod';
import { JOB_ICON_KEYS } from '@/content/job-icons';
import {
  checkbox,
  fail,
  linesToArray,
  ok,
  optionalText,
  revalidatePublic,
  sortOrder,
  text,
  withAdmin,
  zodFields,
  type ActionResult,
} from '@/lib/admin/actions';

const CATEGORY_LABELS: Record<string, string> = {
  engineering: 'Engineering',
  skilled: 'Skilled Trade',
  general: 'General',
  management: 'Management',
};

const schema = z.object({
  title: text(160, 'Please enter a job title.'),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(120)
    .optional()
    .transform((value) => value ?? ''),
  category: z.enum(['engineering', 'skilled', 'general', 'management'], {
    message: 'Choose a department.',
  }),
  category_label: optionalText(60),
  location: optionalText(160),
  employment_type: optionalText(60),
  salary: optionalText(120),
  requirements: linesToArray(20),
  icon_key: z.enum(JOB_ICON_KEYS, { message: 'Choose an icon.' }),
  posted_at: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the date picker.')
    .optional()
    .or(z.literal('')),
  valid_through: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the date picker.')
    .optional()
    .or(z.literal('')),
  sort_order: sortOrder,
  is_published: checkbox,
});

type JobInput = z.infer<typeof schema>;

/** URL-safe slug, used for the /careers anchor and the JobPosting URL. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function parse(formData: FormData) {
  return schema.safeParse({
    title: formData.get('title') ?? '',
    slug: formData.get('slug') ?? '',
    category: formData.get('category') ?? '',
    category_label: formData.get('category_label') ?? '',
    location: formData.get('location') ?? '',
    employment_type: formData.get('employment_type') ?? '',
    salary: formData.get('salary') ?? '',
    requirements: formData.get('requirements') ?? '',
    icon_key: formData.get('icon_key') ?? '',
    posted_at: formData.get('posted_at') ?? '',
    valid_through: formData.get('valid_through') ?? '',
    sort_order: formData.get('sort_order') ?? 0,
    is_published: formData.get('is_published'),
  });
}

function toRow(data: JobInput) {
  const slug = slugify(data.slug || data.title);
  return {
    slug,
    title: data.title,
    category: data.category,
    category_label: data.category_label || CATEGORY_LABELS[data.category] || '',
    location: data.location || 'Johor Bahru, Malaysia',
    employment_type: data.employment_type || 'Full Time',
    salary: data.salary,
    requirements: data.requirements,
    icon_key: data.icon_key,
    posted_at: data.posted_at || new Date().toISOString().slice(0, 10),
    valid_through: data.valid_through || null,
    sort_order: data.sort_order,
    is_published: data.is_published,
  };
}

/** The unique index on slug surfaces as Postgres error 23505. */
function describeError(message: string, code?: string): string {
  if (code === '23505') {
    return 'Another job already uses that web address (slug). Change the slug and try again.';
  }
  return `Could not save: ${message}`;
}

export async function createJob(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return withAdmin(async ({ supabase }) => {
    const parsed = parse(formData);
    if (!parsed.success) {
      return fail('Please check the highlighted fields.', zodFields(parsed.error));
    }

    const row = toRow(parsed.data);
    if (!row.slug) return fail('Could not build a web address from that title.');

    const { error } = await supabase.from('jobs').insert(row);
    if (error) return fail(describeError(error.message, error.code));

    revalidatePublic('/careers');
    return ok(`${row.title} added.`);
  });
}

export async function updateJob(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return withAdmin(async ({ supabase }) => {
    const id = String(formData.get('id') ?? '');
    if (!id) return fail('Missing record id.');

    if (formData.get('intent') === 'delete') {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (error) return fail(`Could not delete: ${error.message}`);
      revalidatePublic('/careers');
      return ok('Deleted.');
    }

    const parsed = parse(formData);
    if (!parsed.success) {
      return fail('Please check the highlighted fields.', zodFields(parsed.error));
    }

    const { error } = await supabase.from('jobs').update(toRow(parsed.data)).eq('id', id);
    if (error) return fail(describeError(error.message, error.code));

    revalidatePublic('/careers');
    return ok('Saved.');
  });
}
