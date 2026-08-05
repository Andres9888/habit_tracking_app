/**
 * Per-user rate limiting (SR-2026-04-17-09).
 *
 * Hot write paths that don't have in-function throttling rely entirely
 * on Convex platform defaults. If a session cookie is stolen or abused,
 * an attacker can spam habit creation, toggle tracking repeatedly, or
 * force user upserts until the platform intervenes. This module
 * provides a simple sliding-window limiter keyed by (userId, action).
 *
 * Storage model: a single row per (userId, action) with windowStartMs
 * and count. When `enforceRateLimit` runs, it either resets the row
 * (new window) or increments the count. The row double-serves as the
 * limiter state and a cheap audit trail.
 */
import type { MutationCtx } from '../_generated/server';

export interface RateLimitConfig {
  /** Max number of calls allowed per window. */
  readonly limit: number;
  /** Window length in milliseconds. */
  readonly windowMs: number;
}

/** Canonical limits per action. Tune here, not at call sites. */
export const RATE_LIMITS = {
  'habit.batch': { limit: 10, windowMs: 60_000 },
  'habit.create': { limit: 20, windowMs: 60_000 },
  'habit.toggle': { limit: 120, windowMs: 60_000 },
  'habit.update': { limit: 60, windowMs: 60_000 },
  'settings.update': { limit: 60, windowMs: 60_000 },
  'storage.generateUploadUrl': { limit: 10, windowMs: 60 * 60_000 },
  'storage.validateImageUpload': { limit: 20, windowMs: 60 * 60_000 },
  'templates.seed': { limit: 5, windowMs: 60_000 },
  'user.getOrCreate': { limit: 10, windowMs: 60_000 },
  'user.updateProfileImage': { limit: 10, windowMs: 60_000 },
} as const satisfies Record<string, RateLimitConfig>;

export type RateLimitAction = keyof typeof RATE_LIMITS;

/**
 * Enforce the rate limit for (userId, action). Throws a user-facing
 * error when the caller has exceeded the limit in the current window.
 *
 * Safe to call from any mutation context.
 */
export async function enforceRateLimit(
  ctx: MutationCtx,
  userId: string,
  action: RateLimitAction
): Promise<void> {
  const config = RATE_LIMITS[action];
  const now = Date.now();

  const existing = await ctx.db
    .query('rateLimits')
    .withIndex('by_user_and_action', (q) =>
      q.eq('userId', userId).eq('action', action)
    )
    .first();

  if (!existing) {
    await ctx.db.insert('rateLimits', {
      action,
      count: 1,
      userId,
      windowStartMs: now,
    });
    return;
  }

  const windowEndMs = existing.windowStartMs + config.windowMs;

  if (now >= windowEndMs) {
    // Window expired — reset.
    await ctx.db.patch(existing._id, { count: 1, windowStartMs: now });
    return;
  }

  if (existing.count >= config.limit) {
    const retryMs = Math.max(windowEndMs - now, 0);
    const retrySec = Math.ceil(retryMs / 1000);
    throw new Error(
      `Rate limit exceeded for ${action}. Try again in ${retrySec}s.`
    );
  }

  await ctx.db.patch(existing._id, { count: existing.count + 1 });
}
