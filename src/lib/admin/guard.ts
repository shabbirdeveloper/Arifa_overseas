import 'server-only';
import { notFound, redirect } from 'next/navigation';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { createSessionClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

export interface AdminSession {
  supabase: SupabaseClient<Database>;
  user: User;
}

export type AdminAccess =
  | { status: 'ok'; supabase: SupabaseClient<Database>; user: User }
  | { status: 'not-admin'; user: User }
  | { status: 'check-failed'; user: User; message: string };

/**
 * Server-side gate for everything under /admin.
 *
 * Only ONE outcome redirects: no session at all, which sends you to the login
 * page. Every other failure returns a status the layout renders in place.
 *
 * That asymmetry is deliberate. An earlier version redirected a signed-in
 * non-admin back to /admin/login, while the middleware redirected a signed-in
 * user from /admin/login to /admin — two pages each bouncing to the other, so
 * anyone signed in but not yet in admin_users hit ERR_TOO_MANY_REDIRECTS with
 * no way out. A dead end that explains itself is always better than a redirect
 * that might come back.
 */
export async function checkAdminAccess(): Promise<AdminAccess> {
  const supabase = await createSessionClient();

  // No Supabase configured at all — nothing to sign in to.
  if (!supabase) redirect('/admin/login');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const { data: isAdmin, error } = await supabase.rpc('is_admin');

  if (error) {
    console.error('[admin] is_admin check failed:', error.message);
    return { status: 'check-failed', user, message: error.message };
  }

  if (!isAdmin) return { status: 'not-admin', user };

  return { status: 'ok', supabase, user };
}

/**
 * For the CRUD pages, which run inside the protected layout and therefore
 * already know access was granted. Kept separate so each page still proves it
 * for itself rather than trusting the layout.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const access = await checkAdminAccess();

  // notFound(), not a redirect. The layout above already renders a proper
  // explanation for a signed-in non-admin; this is only the belt-and-braces
  // check for the page itself, and it has to terminate rather than send the
  // browser somewhere that might send it back.
  if (access.status !== 'ok') notFound();

  return { supabase: access.supabase, user: access.user };
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
