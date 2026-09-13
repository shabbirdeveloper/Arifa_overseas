import 'server-only';

/**
 * Best-effort in-memory rate limit.
 *
 * Caveat worth knowing before you rely on it: serverless instances do not share
 * memory, so on Vercel this limits per warm instance, not globally. It stops
 * naive floods and costs nothing. If the forms start attracting real abuse,
 * swap the body of `rateLimit` for a Redis counter (Upstash works well with
 * Vercel) — the call sites do not need to change.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

function sweep(now: number): void {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds: number;
}

export function rateLimit(
  key: string,
  { windowMs = WINDOW_MS, max = MAX_REQUESTS } = {},
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  bucket.count += 1;

  if (bucket.count > max) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  return { ok: true, retryAfterSeconds: 0 };
}

/**
 * Caller IP. Vercel sets x-forwarded-for; the left-most entry is the client.
 * Falls back to a constant so a missing header degrades to a shared bucket
 * rather than to no limit at all.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}
