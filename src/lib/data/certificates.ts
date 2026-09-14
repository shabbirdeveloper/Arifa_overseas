import 'server-only';
import { certificates as staticCertificates } from '@/content/certificates';
import { getPublicClient } from '@/lib/supabase/public';

export interface CertificateEntry {
  id: string;
  /** Anchor id on /certificates — kept stable for existing deep links. */
  slug: string;
  name: string;
  badge: string;
  description: string;
  authority: string;
  image: string | null;
  width: number;
  height: number;
  iconKey: string;
}

/** The anchor ids the page has always used, derived from the name. */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * The seven certificates that shipped with the site, used when Supabase is
 * unconfigured, unreachable or empty. The icon keys match the SVGs these
 * entries already used, so the fallback looks identical.
 */
const STATIC_ICON_KEYS: Record<string, string> = {
  'ssm-business-registration': 'registry',
  'ministry-of-finance-mof': 'money',
  'cidb-malaysia': 'building',
  'jcc-johor-sijil-kontraktor': 'shield-check',
  'niosh-dosh-safety-certificate': 'safety',
  'iso-9001-2015-certified': 'clipboard-check',
  'fgv-holdings-vendor-registration': 'info',
};

const fromStatic = (): CertificateEntry[] =>
  staticCertificates.map((certificate) => ({
    id: certificate.id,
    slug: certificate.id,
    name: certificate.name,
    badge: certificate.badge,
    description: certificate.description,
    authority: certificate.authority,
    image: certificate.image,
    width: certificate.width,
    height: certificate.height,
    iconKey: STATIC_ICON_KEYS[certificate.id] ?? 'registry',
  }));

export async function getCertificates(): Promise<CertificateEntry[]> {
  const supabase = getPublicClient();
  if (!supabase) return fromStatic();

  const { data, error } = await supabase
    .from('certificates')
    .select(
      'id, name, badge, description, authority, image_url, image_width, image_height, icon_key',
    )
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[data/certificates] falling back to static content:', error.message);
    return fromStatic();
  }

  if (!data || data.length === 0) return fromStatic();

  return data.map((row) => ({
    id: row.id,
    slug: slugify(row.name),
    name: row.name,
    badge: row.badge,
    description: row.description,
    authority: row.authority,
    image: row.image_url || null,
    width: row.image_width ?? 1200,
    height: row.image_height ?? 1697,
    iconKey: row.icon_key,
  }));
}
