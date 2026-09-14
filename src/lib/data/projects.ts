import 'server-only';
import {
  featuredProjects as staticFeatured,
  projectHistory as staticHistory,
} from '@/content/projects';
import { getPublicClient } from '@/lib/supabase/public';
import type { HistoryGroupStyle, ProjectCategory } from '@/lib/supabase/types';

export interface FeaturedProject {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  image: string;
  imageAlt: string;
  width: number;
  height: number;
  isTall: boolean;
}

export interface HistoryItem {
  id: string;
  num: string;
  client: string;
  value: string;
  title: string;
  scope: string;
  tags: string[];
  isOngoing: boolean;
  isHighlight: boolean;
  isMega: boolean;
  megaBadge: string;
}

export interface HistoryGroup {
  id: string;
  badge: string;
  title: string;
  style: HistoryGroupStyle;
  items: HistoryItem[];
}

// ── featured projects ───────────────────────────────────────────────────────

const featuredFromStatic = (): FeaturedProject[] =>
  staticFeatured.map((project, index) => ({
    id: `static-${index}`,
    title: project.title,
    category: project.category as ProjectCategory,
    description: project.text,
    image: project.src,
    imageAlt: project.alt,
    width: project.width,
    height: project.height,
    isTall: project.tall,
  }));

export async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  const supabase = getPublicClient();
  if (!supabase) return featuredFromStatic();

  const { data, error } = await supabase
    .from('featured_projects')
    .select(
      'id, title, category, description, image_url, image_alt, image_width, image_height, is_tall',
    )
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[data/projects] featured fell back to static:', error.message);
    return featuredFromStatic();
  }

  if (!data || data.length === 0) return featuredFromStatic();

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    image: row.image_url,
    imageAlt: row.image_alt || row.title,
    width: row.image_width ?? 900,
    height: row.image_height ?? 600,
    isTall: row.is_tall,
  }));
}

// ── project history ─────────────────────────────────────────────────────────

/** Maps the legacy inline badge styles onto the four named styles. */
function styleFromLegacyBadge(badgeStyle: string): HistoryGroupStyle {
  if (badgeStyle.includes('pulseBadge')) return 'ongoing';
  if (badgeStyle.includes('rgba(56,189,248,0.3)')) return 'muted';
  if (badgeStyle.includes('var(--blue-dark)') || badgeStyle.includes('linear-gradient')) {
    return 'primary';
  }
  return 'default';
}

const historyFromStatic = (): HistoryGroup[] =>
  staticHistory.map((group, groupIndex) => ({
    id: `static-${groupIndex}`,
    badge: group.badge,
    title: group.title,
    style: styleFromLegacyBadge(group.badgeStyle),
    items: group.cards.map((card, cardIndex) => ({
      id: `static-${groupIndex}-${cardIndex}`,
      num: card.num,
      client: card.client,
      value: card.value,
      title: card.title,
      scope: card.scope,
      tags: card.tags.map((tag) => tag.label),
      isOngoing: card.ongoing,
      isHighlight: card.highlight,
      isMega: card.mega,
      megaBadge: card.megaBadge,
    })),
  }));

export async function getProjectHistory(): Promise<HistoryGroup[]> {
  const supabase = getPublicClient();
  if (!supabase) return historyFromStatic();

  const [groupsResult, itemsResult] = await Promise.all([
    supabase
      .from('project_history_groups')
      .select('id, badge, title, style, sort_order')
      .order('sort_order', { ascending: true }),
    supabase
      .from('project_history_items')
      .select(
        'id, group_id, num, client, value, title, scope, tags, is_ongoing, is_highlight, is_mega, mega_badge, sort_order',
      )
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
  ]);

  if (groupsResult.error || itemsResult.error) {
    console.error(
      '[data/projects] history fell back to static:',
      groupsResult.error?.message ?? itemsResult.error?.message,
    );
    return historyFromStatic();
  }

  const groups = groupsResult.data ?? [];
  if (groups.length === 0) return historyFromStatic();

  const itemsByGroup = new Map<string, HistoryItem[]>();
  for (const row of itemsResult.data ?? []) {
    const list = itemsByGroup.get(row.group_id) ?? [];
    list.push({
      id: row.id,
      num: row.num,
      client: row.client,
      value: row.value,
      title: row.title,
      scope: row.scope,
      tags: row.tags ?? [],
      isOngoing: row.is_ongoing,
      isHighlight: row.is_highlight,
      isMega: row.is_mega,
      megaBadge: row.mega_badge,
    });
    itemsByGroup.set(row.group_id, list);
  }

  return groups.map((group) => ({
    id: group.id,
    badge: group.badge,
    title: group.title,
    style: group.style,
    items: itemsByGroup.get(group.id) ?? [],
  }));
}
