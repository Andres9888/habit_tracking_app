/**
 * Premium Feature Access Control
 *
 * SEC-005: Server-side premium validation for feature gating
 *
 * Premium features must be validated on the server side to prevent
 * client-side bypass. This module provides helpers for checking
 * premium status across all mutations.
 */

import type { QueryCtx } from '../_generated/server';

/**
 * Check if a user has premium access
 *
 * @param ctx - Convex query context
 * @param userId - The user's ID (Clerk ID)
 * @returns true if user has premium, false otherwise
 */
export async function hasPremiumAccess(
  ctx: QueryCtx,
  userId: string
): Promise<boolean> {
  const settings = await ctx.db
    .query('userSettings')
    .withIndex('by_userId', (q) => q.eq('userId', userId))
    .first();

  return settings?.hasPremium ?? false;
}

/**
 * Require premium access or throw an error
 *
 * @param ctx - Convex query context
 * @param userId - The user's ID (Clerk ID)
 * @param featureName - Name of the feature for error message
 * @throws Error if user does not have premium
 */
export async function requirePremium(
  ctx: QueryCtx,
  userId: string,
  featureName: string = 'this feature'
): Promise<void> {
  const hasPremium = await hasPremiumAccess(ctx, userId);
  if (!hasPremium) {
    throw new Error(
      `Premium required: ${featureName} is only available for premium users. Upgrade to unlock unlimited access.`
    );
  }
}

/**
 * Validate timestamp from RevenueCat webhook
 *
 * RevenueCat sends timestamps in milliseconds since epoch.
 * This validates the timestamp is reasonable (not negative, not too far in the past/future)
 *
 * @param timestamp - Timestamp in milliseconds
 * @param fieldName - Field name for error message
 * @returns validated timestamp or undefined
 */
export function validateWebhookTimestamp(
  timestamp: number | undefined,
  fieldName: string
): number | undefined {
  if (timestamp === undefined) {
    return undefined;
  }

  // Must be a positive number
  if (typeof timestamp !== 'number' || timestamp <= 0) {
    console.error(
      `[RevenueCat] Invalid ${fieldName}: ${timestamp} - must be positive number`
    );
    return undefined;
  }

  // Check if timestamp is within reasonable range: 2020 (before the app
  // existed) up to one year from now. A relative upper bound avoids the
  // hardcoded-cutoff bug where legitimate webhooks start failing after a
  // fixed year, while still catching obvious errors like sending seconds
  // instead of milliseconds.
  const minDate = new Date('2020-01-01').getTime();
  const maxDate = Date.now() + 365 * 24 * 60 * 60 * 1000;

  if (timestamp < minDate || timestamp > maxDate) {
    console.error(
      `[RevenueCat] Suspicious ${fieldName}: ${timestamp} (${new Date(timestamp).toISOString()}) — rejecting out-of-range timestamp`
    );
    return undefined;
  }

  return timestamp;
}

export function isStaleWebhookTimestamp(
  lastProcessedTimestamp: number | undefined,
  incomingTimestamp: number
): boolean {
  return (
    typeof lastProcessedTimestamp === 'number' &&
    incomingTimestamp < lastProcessedTimestamp
  );
}
