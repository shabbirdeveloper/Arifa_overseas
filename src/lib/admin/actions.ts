import 'server-only';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAdminSession, type AdminSession } from './guard';

export interface ActionResult {
  ok: boolean;
  message: string;
  /** Field-level messages, keyed by input name. */
  fields?: Record<string, string>;
}

export const ok = (message: string): ActionResult => ({ ok: true, message });
export const fail = (
  message: string,
  fields?: Record<string, string>,
): ActionResult => ({ ok: false, message, fields });

/**
 * Runs `work` with an admin session, or returns a failure result.
 *
 * Every Server Action re-checks admin membership. A Server Action is a public
 * HTTP endpoint — it is never protected by the fact that the page that renders
 * its form was itself protected.
 */
export async function withAdmin(
  work: (session: AdminSession) => Promise<ActionResult>,
): Promise<ActionResult> {
  const session = await getAdminSession();

  if (!session) {
    return fail('Your session has expired. Please sign in again.');
  }

  try {
    return await work(session);
  } catch (error) {
    console.error('[admin action] unexpected failure:', error);
    return fail('Something went wrong. Please try again.');
  }
}

/** Turns a ZodError into `{ field: message }` for the form. */
export function zodFields(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !(key in out)) out[key] = issue.message;
  }
  return out;
}

/**
 * Purges the cached HTML for the public pages an edit affects, so a save is
 * visible within seconds while visitors still get pre-rendered pages.
 */
export function revalidatePublic(...paths: string[]): void {
  for (const path of paths) revalidatePath(path);
}

// ── shared field helpers ────────────────────────────────────────────────────

export const text = (max: number, message = 'This field is required.') =>
  z.string().trim().min(1, message).max(max, `Keep this under ${max} characters.`);

export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .optional()
    .transform((value) => value ?? '');

export const sortOrder = z.coerce
  .number()
  .int('Use a whole number.')
  .min(0, 'Cannot be negative.')
  .max(9999, 'Too large.')
  .catch(0);

export const checkbox = z
  .union([z.literal('on'), z.literal('true'), z.literal('false'), z.undefined(), z.null()])
  .transform((value) => value === 'on' || value === 'true');

/** Splits a textarea of newline-separated values into a clean array. */
export const linesToArray = (max: number) =>
  z
    .string()
    .optional()
    .transform((value) =>
      (value ?? '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, max),
    );

/** Splits a comma-separated field into a clean array. */
export const commaToArray = (max: number) =>
  z
    .string()
    .optional()
    .transform((value) =>
      (value ?? '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, max),
    );
