import 'server-only';
import { jobs as staticJobs } from '@/content/jobs';
import { isJobIconKey, type JobIconKey } from '@/content/job-icons';
import { getPublicClient } from '@/lib/supabase/public';
import type { JobCategory } from '@/lib/supabase/types';

export interface Job {
  id: string;
  slug: string;
  title: string;
  category: JobCategory;
  categoryLabel: string;
  location: string;
  employmentType: string;
  salary: string;
  requirements: string[];
  iconKey: JobIconKey;
  postedAt: string;
  validThrough: string;
}

/** Icon keys for the nine seeded roles, so the fallback looks identical. */
const STATIC_ICON_KEYS: Record<string, JobIconKey> = {
  'civil-engineer': 'blueprint',
  'site-supervisor': 'person',
  'certified-welder': 'bolt',
  'licensed-electrician': 'bulb',
  'mechanical-engineer': 'cog',
  'general-labourer': 'briefcase',
  'safety-officer-sho': 'shield',
  'plumber-pipe-fitter': 'pipes',
  'qa-qc-inspector': 'clipboard',
};

function defaultDates(): { postedAt: string; validThrough: string } {
  const posted = new Date();
  const valid = new Date(posted);
  valid.setMonth(valid.getMonth() + 3);
  return {
    postedAt: posted.toISOString().slice(0, 10),
    validThrough: valid.toISOString().slice(0, 10),
  };
}

const fromStatic = (): Job[] => {
  const { postedAt, validThrough } = defaultDates();
  return staticJobs.map((job) => ({
    id: job.id,
    slug: job.id,
    title: job.title,
    category: job.category,
    categoryLabel: job.categoryLabel,
    location: job.location,
    employmentType: job.type,
    salary: job.salary,
    requirements: job.requirements,
    iconKey: STATIC_ICON_KEYS[job.id] ?? 'briefcase',
    postedAt,
    validThrough,
  }));
};

export async function getJobs(): Promise<Job[]> {
  const supabase = getPublicClient();
  if (!supabase) return fromStatic();

  const { data, error } = await supabase
    .from('jobs')
    .select(
      'id, slug, title, category, category_label, location, employment_type, salary, requirements, icon_key, posted_at, valid_through',
    )
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[data/jobs] falling back to static content:', error.message);
    return fromStatic();
  }

  if (!data || data.length === 0) return fromStatic();

  const fallbackDates = defaultDates();

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    categoryLabel: row.category_label || row.category,
    location: row.location,
    employmentType: row.employment_type,
    salary: row.salary,
    requirements: row.requirements ?? [],
    // Guard against a key that was removed from the icon set after being saved.
    iconKey: isJobIconKey(row.icon_key) ? row.icon_key : 'briefcase',
    postedAt: row.posted_at ?? fallbackDates.postedAt,
    validThrough: row.valid_through ?? fallbackDates.validThrough,
  }));
}
