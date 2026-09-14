'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseUrl } from './env';
import type { Database } from './types';

let cached: SupabaseClient<Database> | null = null;

/**
 * Browser client — used only in the admin area, for signing in and for
 * uploading images straight to Storage (so large files never pass through a
 * server action's request body).
 */
export function getBrowserClient(): SupabaseClient<Database> {
  cached ??= createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  return cached;
}
