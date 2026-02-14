/**
 * Rate Limiter (SEC-004)
 *
 * Token-bucket rate limiting for Convex mutations.
 * Uses a `rateLimits` table to track per-user, per-action consumption.
 *
 * Each bucket refills at a steady rate. If tokens are exhausted, the
 * request is rejected with a descriptive error.
 */
import { GenericDatabaseWriter } from 'convex/server';
import { GenericDataModel } from 'convex/server';

// ─── Configuration ───────────────────────────────────────────────────────────

export interface RateLimitConfig {
  /** Human-readable action name (used as DB key) */
  name: string;
  /** Maximum tokens in the bucket */
  maxTokens: number;
  /** Tokens added per millisecond (refill rate) */
  refillRate: number;
}

/**
 * Pre-configured rate limits for the app.
 *
 * habitCreate:    10 per minute  (burst up to 10)
 * habitToggle:   100 per minute  (burst up to 100)
 * settingsUpdate: 20 per minute  (burst up to 20)
 */
export const RATE_LIMITS = {
  habitCreate: {
    name: 'habitCreate',
    maxTokens: 10,
    // 10 tokens / 60 000 ms
    refillRate: 10 / 60_000,
  },
  habitToggle: {
    name: 'habitToggle',
    maxTokens: 100,
    // 100 tokens / 60 000 ms
    refillRate: 100 / 60_000,
  },
  settingsUpdate: {
    name: 'settingsUpdate',
    maxTokens: 20,
    refillRate: 20 / 60_000,
  },
} as const satisfies Record<string, RateLimitConfig>;

// ─── Hard Limits ─────────────────────────────────────────────────────────────

/** Maximum number of habits a single user may own (active + archived). */
export const MAX_HABITS_PER_USER = 50;

// ─── Core ────────────────────────────────────────────────────────────────────

/**
 * Consume one token from the user's bucket for the given action.
 * Throws if the bucket is empty (rate limit exceeded).
 *
 * This must run inside a mutation so writes are transactional.
 */
export async function rateLimit(
  db: GenericDatabaseWriter<GenericDataModel>,
  userId: string,
  config: RateLimitConfig
): Promise<void> {
  const now = Date.now();

  // Look up existing bucket
  const existing = await (db as any)
    .query('rateLimits')
    .withIndex('by_user_action', (q: any) =>
      q.eq('userId', userId).eq('action', config.name)
    )
    .unique();

  if (!existing) {
    // First request — create bucket with maxTokens - 1
    await (db as any).insert('rateLimits', {
      userId,
      action: config.name,
      tokens: config.maxTokens - 1,
      lastRefill: now,
    });
    return;
  }

  // Refill tokens based on elapsed time
  const elapsed = now - existing.lastRefill;
  const refilled = Math.min(
    config.maxTokens,
    existing.tokens + elapsed * config.refillRate
  );

  if (refilled < 1) {
    throw new Error(
      `Rate limit exceeded for ${config.name}. Please slow down and try again shortly.`
    );
  }

  await (db as any).patch(existing._id, {
    tokens: refilled - 1,
    lastRefill: now,
  });
}
