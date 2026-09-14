'use server';

import { z } from 'zod';
import { CERT_ICON_KEYS } from '@/content/certificate-icons';
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
  name: text(200, 'Please enter the certificate name.'),
  badge: optionalText(40),
  description: optionalText(600),
  authority: optionalText(200),
  // Stored as a key, never as markup: the SVG lives in
  // src/content/certificate-icons.tsx so an admin can never store raw HTML.
  icon_key: z.enum(CERT_ICON_KEYS, { message: 'Choose an icon.' }),
  image_url: optionalText(1000),
  image_width: z.coerce.number().int().min(0).max(20000).catch(0),
  image_height: z.coerce.number().int().min(0).max(20000).catch(0),
  sort_order: sortOrder,
  is_published: checkbox,
});

type CertificateInput = z.infer<typeof schema>;

function parse(formData: FormData) {
  return schema.safeParse({
    name: formData.get('name') ?? '',
    badge: formData.get('badge') ?? '',
    description: formData.get('description') ?? '',
    authority: formData.get('authority') ?? '',
    icon_key: formData.get('icon_key') ?? '',
    image_url: formData.get('image_url') ?? '',
    image_width: formData.get('image_width') ?? 0,
    image_height: formData.get('image_height') ?? 0,
    sort_order: formData.get('sort_order') ?? 0,
    is_published: formData.get('is_published'),
  });
}

const toRow = (data: CertificateInput) => ({
  name: data.name,
  badge: data.badge,
  description: data.description,
  authority: data.authority,
  icon_key: data.icon_key,
  image_url: data.image_url,
  image_width: data.image_width || null,
  image_height: data.image_height || null,
  sort_order: data.sort_order,
  is_published: data.is_published,
});

export async function createCertificate(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return withAdmin(async ({ supabase }) => {
    const parsed = parse(formData);
    if (!parsed.success) {
      return fail('Please check the highlighted fields.', zodFields(parsed.error));
    }

    const { error } = await supabase.from('certificates').insert(toRow(parsed.data));
    if (error) return fail(`Could not save: ${error.message}`);

    revalidatePublic('/certificates');
    return ok(`${parsed.data.name} added.`);
  });
}

export async function updateCertificate(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return withAdmin(async ({ supabase }) => {
    const id = String(formData.get('id') ?? '');
    if (!id) return fail('Missing record id.');

    if (formData.get('intent') === 'delete') {
      const { error } = await supabase.from('certificates').delete().eq('id', id);
      if (error) return fail(`Could not delete: ${error.message}`);
      revalidatePublic('/certificates');
      return ok('Deleted.');
    }

    const parsed = parse(formData);
    if (!parsed.success) {
      return fail('Please check the highlighted fields.', zodFields(parsed.error));
    }

    const { error } = await supabase
      .from('certificates')
      .update(toRow(parsed.data))
      .eq('id', id);

    if (error) return fail(`Could not save: ${error.message}`);

    revalidatePublic('/certificates');
    return ok('Saved.');
  });
}
