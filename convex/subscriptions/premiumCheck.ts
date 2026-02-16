/**
 * Premium Feature Access Control
 *
 * SEC-005: Server-side premium validation for feature gating
 *
 * Premium features must be validated on the server side to prevent
 * client-side bypass. This module provides helpers for checking
 * premium status across all mutations.
 */

import type { Id } from '../_generated/dataModel';
import type { QueryCtx } from '../_generated/server';

/**
 * Free tier limits for premium features
 * Users can use these features up to the limit without premium
 */
export const FREE_TIER_LIMITS = {
  /** Voice notes: 1 free recording per habit */
  VOICE_NOTES_PER_HABIT: 1,
  /** Vision board: 4 images per habit */
  VISION_BOARD_IMAGES_PER_HABIT: 4,
  /** Affirmations: 2 free per habit */
  AFFIRMATIONS_PER_HABIT: 2,
} as const;

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
 * Check if user can add more voice notes to a habit
 *
 * Free tier: 1 voice note per habit
 * Premium: unlimited
 *
 * @param ctx - Convex query context
 * @param userId - The user's ID
 * @param habitId - The habit ID
 * @returns true if user can add more voice notes
 */
export async function canAddVoiceNote(
  ctx: QueryCtx,
  userId: string,
  habitId: Id<'habits'>
): Promise<{ allowed: boolean; reason?: string }> {
  const hasPremium = await hasPremiumAccess(ctx, userId);
  if (hasPremium) {
    return { allowed: true };
  }

  const existingNotes = await ctx.db
    .query('voiceNotes')
    .withIndex('by_habit', (q) => q.eq('habitId', habitId))
    .collect();

  if (existingNotes.length >= FREE_TIER_LIMITS.VOICE_NOTES_PER_HABIT) {
    return {
      allowed: false,
      reason: `Free tier limited to ${FREE_TIER_LIMITS.VOICE_NOTES_PER_HABIT} voice note per habit. Upgrade to premium for unlimited recordings.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if user can add more vision board images to a habit
 *
 * Free tier: 4 images per habit
 * Premium: unlimited
 *
 * @param ctx - Convex query context
 * @param userId - The user's ID
 * @param habitId - The habit ID
 * @returns true if user can add more images
 */
export async function canAddVisionBoardImage(
  ctx: QueryCtx,
  userId: string,
  habitId: Id<'habits'>
): Promise<{ allowed: boolean; reason?: string }> {
  const hasPremium = await hasPremiumAccess(ctx, userId);
  if (hasPremium) {
    return { allowed: true };
  }

  const existingImages = await ctx.db
    .query('visionBoardImages')
    .withIndex('by_habit', (q) => q.eq('habitId', habitId))
    .collect();

  if (existingImages.length >= FREE_TIER_LIMITS.VISION_BOARD_IMAGES_PER_HABIT) {
    return {
      allowed: false,
      reason: `Free tier limited to ${FREE_TIER_LIMITS.VISION_BOARD_IMAGES_PER_HABIT} vision board images per habit. Upgrade to premium for unlimited images.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if user can add more affirmations to a habit
 *
 * Free tier: 2 affirmations per habit
 * Premium: unlimited (up to MAX_AFFIRMATIONS_PER_HABIT)
 *
 * @param ctx - Convex query context
 * @param userId - The user's ID
 * @param habitId - The habit ID
 * @returns true if user can add more affirmations
 */
export async function canAddAffirmation(
  ctx: QueryCtx,
  userId: string,
  habitId: Id<'habits'>
): Promise<{ allowed: boolean; reason?: string }> {
  const hasPremium = await hasPremiumAccess(ctx, userId);
  if (hasPremium) {
    return { allowed: true };
  }

  const existingAffirmations = await ctx.db
    .query('affirmations')
    .withIndex('by_habit', (q) => q.eq('habitId', habitId))
    .collect();

  if (existingAffirmations.length >= FREE_TIER_LIMITS.AFFIRMATIONS_PER_HABIT) {
    return {
      allowed: false,
      reason: `Free tier limited to ${FREE_TIER_LIMITS.AFFIRMATIONS_PER_HABIT} affirmations per habit. Upgrade to premium for unlimited affirmations.`,
    };
  }

  return { allowed: true };
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

  // Check if timestamp is within reasonable range (2020-2030)
  // This catches obvious errors like sending seconds instead of milliseconds
  const minDate = new Date('2020-01-01').getTime();
  const maxDate = new Date('2030-01-01').getTime();

  if (timestamp < minDate || timestamp > maxDate) {
    console.error(
      `[RevenueCat] Suspicious ${fieldName}: ${timestamp} (${new Date(timestamp).toISOString()})`
    );
    // Still return it, but log the warning
  }

  return timestamp;
}
