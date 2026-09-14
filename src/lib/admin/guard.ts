import 'server-only';
import { redirect } from 'next/navigation';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { createSessionClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

export interface AdminSession {
  supabase: SupabaseClient<Database>;
  user: User;
}

/**
 * Server-side gate for everything under /admin.
 *
 * Two distinct checks, because they fail differently:
 *   - signed in at all  → otherwise bounce to the login page;
 *   - listed in admin_users → otherwise a valid Supabase user who is not an
 *     admin would see the UI (they still could not write anything, because RLS
 *     blocks that, but showing them the screens would be misleading).
 *
 * The middleware performs the first check too. This one is the real boundary:
 * middleware is a convenience, not a guarantee.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createSessionClient();

  if (!supabase) redirect('/admin/login');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const { data: isAdmin, error } = await supabase.rpc('is_admin');

  if (error) {
    console.error('[admin] is_admin check failed:', error.message);
    redirect('/admin/login?error=check-failed');
  }

  if (!isAdmin) redirect('/admin/login?error=not-admin');

  return { supabase, user };
}

/**
 * Same check for Server Actions, which must not redirect mid-mutation —
 * they return an error to the form instead.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createSessionClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) return null;

  return { supabase, user };
}
