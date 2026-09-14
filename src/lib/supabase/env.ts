/**
 * Supabase configuration.
 *
 * Both values are safe to expose to the browser: the anon/publishable key only
 * grants what Row Level Security allows. The service-role key is deliberately
 * NOT used anywhere in this app — admin writes run as the signed-in user so
 * the database enforces permissions rather than trusting our code.
 */

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';

export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ??
  '';

/**
 * False when the project has no Supabase credentials. The site then falls back
 * to the content files in src/content, so an unconfigured deploy still renders
 * the full site instead of empty pages.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** Hostname used for next/image remotePatterns and storage URL checks. */
export function supabaseHostname(): string | null {
  if (!supabaseUrl) return null;
  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return null;
  }
}
