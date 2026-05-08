import { Redis } from '@upstash/redis';
import * as Sentry from '@sentry/nextjs';

export type RateLimitResult = { allowed: boolean; remaining: number };

let redis: Redis | null = null;
let warnedMissingUpstash = false;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    // In production, log once per cold start that the limiter is degraded.
    // The whole point of this module is to escape per-instance limits — if
    // Upstash isn't wired up in Vercel, we want it loud at boot, not silent.
    if (!warnedMissingUpstash && process.env.VERCEL_ENV === 'production') {
      warnedMissingUpstash = true;
      console.warn(
        '[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN not set in production; ' +
          'falling back to per-instance in-memory limiter (effective cap is N_warm * max).',
      );
    }
    return null;
  }
  redis = new Redis({ url, token });
  return redis;
}

// Fixed-window in-memory fallback. Kept so dev + tests run without Redis.
// NOTE: per-lambda-instance on serverless; effective cap is N_warm * max.
const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

function memoryCheck(key: string, windowMs: number, max: number): RateLimitResult {
  const now = Date.now();
  const entry = memoryBuckets.get(key);
  if (!entry || now >= entry.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }
  entry.count += 1;
  return { allowed: entry.count <= max, remaining: Math.max(0, max - entry.count) };
}

/**
 * Rate limit a request by clientId using a fixed-window counter.
 *
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 * are set (production + preview); falls back to an in-memory Map otherwise so
 * local dev and the test suite don't require a running Redis.
 *
 * Window semantics: fixed window. The first request in a window sets a TTL
 * via EXPIRE ... NX, and subsequent requests inside that window just INCR.
 * When the key expires, the next request starts a fresh window. A client
 * can therefore burst up to 2*max at the window boundary (classic fixed-
 * window tradeoff); good enough for a contact-form abuse gate.
 *
 * Fails open on Redis errors so a Redis outage doesn't block the contact
 * form. The memory fallback is already per-instance, so fail-open is no
 * worse than current prod behavior; the error is logged AND captured to
 * Sentry (warning level) so a persistent outage surfaces somewhere instead
 * of silently disabling the limiter.
 */
export async function rateLimit(
  clientId: string,
  opts: { windowMs: number; max: number },
): Promise<RateLimitResult> {
  const { windowMs, max } = opts;
  const r = getRedis();
  if (!r) {
    return memoryCheck(clientId, windowMs, max);
  }
  const key = `rl:contact:${clientId}`;
  try {
    // INCR + EXPIRE-NX in a single round-trip. EXPIRE with NX only sets the
    // TTL if the key has none — so only the first hit of a window establishes
    // the window, keeping it fixed rather than sliding.
    const pipe = r.pipeline();
    pipe.incr(key);
    pipe.expire(key, Math.ceil(windowMs / 1000), 'NX');
    const results = (await pipe.exec()) as unknown[];
    const rawCount = results[0];
    // Pipeline can return null on a transient miss (which JS would coerce to
    // 0 and false-allow) or an Error object on WRONGTYPE etc. (which would
    // false-deny). Validate before using.
    if (typeof rawCount !== 'number' || !Number.isFinite(rawCount)) {
      Sentry.captureException(
        new Error(`[rate-limit] unexpected pipeline result type: ${typeof rawCount}`),
        { tags: { component: 'rate-limit', kind: 'malformed-result' }, level: 'warning' },
      );
      return { allowed: true, remaining: max };
    }
    return {
      allowed: rawCount <= max,
      remaining: Math.max(0, max - rawCount),
    };
  } catch (err) {
    console.error('[rate-limit] redis error, failing open', err);
    Sentry.captureException(err, {
      tags: { component: 'rate-limit', kind: 'redis-error' },
      level: 'warning',
    });
    return { allowed: true, remaining: max };
  }
}

/**
 * Test-only: reset the module-level Redis client, in-memory buckets, and
 * the warned-missing-upstash flag. Lets a test toggle env vars mid-suite
 * and re-pick up the new config (and re-trigger the boot warn).
 */
export function __resetRateLimitForTests(): void {
  redis = null;
  memoryBuckets.clear();
  warnedMissingUpstash = false;
}
