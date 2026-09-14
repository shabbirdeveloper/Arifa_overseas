import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from './env';
import type { Database } from './types';

/**
 * Read-only client for the public website.
 *
 * Deliberately does NOT touch cookies. Reading cookies would opt every page
 * into dynamic rendering and lose static generation — the public pages have no
 * per-visitor state, so they read as the anonymous role and RLS limits them to
 * published rows.
 */
let cached: SupabaseClient<Database> | null = null;

export function getPublicClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) return null;

  cached ??= createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
