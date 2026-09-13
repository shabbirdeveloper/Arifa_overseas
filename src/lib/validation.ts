import { z } from 'zod';

/**
 * Shared between the client (inline validation) and the API routes
 * (authoritative validation — never trust the browser).
 */

const name = z
  .string()
  .trim()
  .min(2, 'Please enter your name.')
  .max(120, 'That name is too long.');

const phone = z
  .string()
  .trim()
  .min(7, 'Please enter a contact number.')
  .max(32, 'That number is too long.')
  .regex(/^[+()\-\s\d]+$/, 'Use digits, spaces, + ( ) and - only.');

/** HTML5 input[type=email] pattern — the same rule browsers apply. */
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const email = z
  .string()
  .trim()
  .min(1, 'Please enter your email address.')
  .max(254, 'That email address is too long.')
  .regex(EMAIL_RE, 'Please enter a valid email address.');

/**
 * Bots fill hidden fields; humans never see them. Deliberately permissive so
 * the schema does NOT reject it — the route checks the value and returns a
 * fake success instead, which tells the bot nothing about why it failed.
 */
const honeypot = z.string().max(500).optional();

export const enquirySchema = z.object({
  name,
  phone,
  email,
  service: z.string().trim().max(80).optional().or(z.literal('')),
  message: z.string().trim().max(4000, 'Please keep it under 4000 characters.').optional().or(z.literal('')),
  company: honeypot,
});

export const applicationSchema = z.object({
  name,
  phone,
  email,
  position: z.string().trim().min(2).max(120),
  experience: z.string().trim().max(80).optional().or(z.literal('')),
  about: z.string().trim().max(4000, 'Please keep it under 4000 characters.').optional().or(z.literal('')),
  company: honeypot,
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;

/** CV upload limits, enforced server-side. */
export const RESUME_MAX_BYTES = 5 * 1024 * 1024; // 5MB
export const RESUME_ACCEPT = '.pdf,.doc,.docx';
export const RESUME_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

/**
 * Magic-number check — an attacker can set any Content-Type they like, so the
 * declared MIME type alone is not evidence of what the file actually is.
 *   %PDF      -> 25 50 44 46
 *   PK\x03\x04 -> DOCX (zip container)
 *   D0 CF 11 E0 -> legacy .doc (OLE compound file)
 */
export function sniffDocumentType(bytes: Uint8Array): 'pdf' | 'docx' | 'doc' | null {
  const starts = (sig: number[]) => sig.every((b, i) => bytes[i] === b);
  if (starts([0x25, 0x50, 0x44, 0x46])) return 'pdf';
  if (starts([0x50, 0x4b, 0x03, 0x04])) return 'docx';
  if (starts([0xd0, 0xcf, 0x11, 0xe0])) return 'doc';
  return null;
}

/** Strip path separators and control characters from a user-supplied filename. */
export function safeFilename(input: string, fallback: string): string {
  const base = input.split(/[\\/]/).pop() ?? '';
  const cleaned = base
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[<>:"|?*]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
  return cleaned.length > 0 ? cleaned : fallback;
}

/** Flatten a ZodError into `{ field: message }` for the client. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !(key in out)) out[key] = issue.message;
  }
  return out;
}
