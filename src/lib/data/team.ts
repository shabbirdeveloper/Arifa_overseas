import 'server-only';
import { team as staticTeam, type TeamMemberWithSize } from '@/content/company';
import { getPublicClient } from '@/lib/supabase/public';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  quote: string;
  image: string | null;
  width: number;
  height: number;
}

const fromStatic = (): TeamMember[] =>
  staticTeam.map((member: TeamMemberWithSize, index) => ({
    id: `static-${index}`,
    name: member.name,
    role: member.role,
    bio: member.bio,
    quote: member.quote,
    image: member.image,
    width: member.width,
    height: member.height,
  }));

/**
 * Leadership team for /about.
 *
 * Falls back to the content file whenever Supabase is unconfigured, errors, or
 * returns nothing — an empty leadership section would look broken, and a
 * database hiccup should not take content off the site.
 */
export async function getTeam(): Promise<TeamMember[]> {
  const supabase = getPublicClient();
  if (!supabase) return fromStatic();

  const { data, error } = await supabase
    .from('team_members')
    .select('id, name, role, bio, quote, image_url, image_width, image_height')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[data/team] falling back to static content:', error.message);
    return fromStatic();
  }

  if (!data || data.length === 0) return fromStatic();

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    quote: row.quote,
    image: row.image_url,
    width: row.image_width ?? 600,
    height: row.image_height ?? 600,
  }));
}
