/**
 * Hand-written row types, kept in step with supabase/schema.sql.
 *
 * Every shape here is a `type`, never an `interface`: supabase-js constrains
 * rows against `Record<string, unknown>`, and TypeScript only gives type
 * aliases an implicit index signature. Declared as interfaces, every table
 * silently resolves to `never` and inserts stop typechecking.
 *
 * If you change the schema, change these too — `npx supabase gen types` can
 * generate them instead once you have the Supabase CLI linked to the project.
 */

export type ProjectCategory = 'Construction' | 'Manpower' | 'Maintenance';
export type JobCategory = 'engineering' | 'skilled' | 'general' | 'management';
export type HistoryGroupStyle = 'default' | 'ongoing' | 'primary' | 'muted';

export type TeamMemberRow = {
  id: string;
  name: string;
  role: string;
  bio: string;
  quote: string;
  image_url: string | null;
  image_width: number | null;
  image_height: number | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type FeaturedProjectRow = {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  image_url: string;
  image_alt: string;
  image_width: number | null;
  image_height: number | null;
  is_tall: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type HistoryGroupRow = {
  id: string;
  badge: string;
  title: string;
  style: HistoryGroupStyle;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type HistoryItemRow = {
  id: string;
  group_id: string;
  num: string;
  client: string;
  value: string;
  title: string;
  scope: string;
  tags: string[];
  is_ongoing: boolean;
  is_highlight: boolean;
  is_mega: boolean;
  mega_badge: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type JobRow = {
  id: string;
  slug: string;
  title: string;
  category: JobCategory;
  category_label: string;
  location: string;
  employment_type: string;
  salary: string;
  requirements: string[];
  icon_key: string;
  posted_at: string;
  valid_through: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type CertificateRow = {
  id: string;
  name: string;
  badge: string;
  description: string;
  authority: string;
  image_url: string;
  image_width: number | null;
  image_height: number | null;
  icon_key: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type AdminUserRow = {
  user_id: string;
  email: string | null;
  created_at: string;
}

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

/**
 * Declared as a `type`, not an `interface` — supabase-js constrains the schema
 * against index-signature types, and interfaces do not get TypeScript's
 * implicit index signature. As an interface every table resolves to `never`
 * and inserts stop typechecking.
 */
export type Database = {
  public: {
    Tables: {
      team_members: Table<TeamMemberRow>;
      featured_projects: Table<FeaturedProjectRow>;
      project_history_groups: Table<HistoryGroupRow>;
      project_history_items: Table<HistoryItemRow>;
      jobs: Table<JobRow>;
      certificates: Table<CertificateRow>;
      admin_users: Table<AdminUserRow>;
    };
    Views: Record<never, never>;
    Functions: {
      is_admin: {
        Args: Record<never, never>;
        Returns: boolean;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}
