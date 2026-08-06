/**
 * Free-tier limits — single source of truth.
 *
 * The free-habit cap used to be duplicated as a bare `const FREE_HABIT_LIMIT = 3`
 * inside archive.ts and batchArchive.ts while `create.ts` enforced nothing at
 * all. The result was a tier that free users could exceed by creating habits
 * but not by restoring them — the cap only ever fired on the one path where
 * hitting it reads as a bug rather than an upsell.
 *
 * Errors thrown here carry the PREMIUM_REQUIRED prefix so the client can tell a
 * paywall moment apart from a genuine failure and route to the paywall instead
 * of an "unable to do that, please try again" alert.
 */

/** Active (non-paused, non-archived) habits allowed without a subscription. */
export const FREE_HABIT_LIMIT = 3;

/** Prefix every entitlement error carries so clients can classify it. */
export const PREMIUM_REQUIRED_CODE = 'PREMIUM_REQUIRED';

/**
 * Build the entitlement error thrown when a free user hits a paid boundary.
 *
 * @param reason - Human-readable clause explaining what was blocked.
 */
export function premiumRequiredError(reason: string): Error {
  return new Error(`${PREMIUM_REQUIRED_CODE}: ${reason}`);
}

/**
 * Whether a free user may add one more active habit.
 *
 * @param isPremiumUser - Result of `hasPremiumAccess`.
 * @param activeHabitCount - Current non-paused, non-archived habit count.
 */
export function canAddActiveHabit(
  isPremiumUser: boolean,
  activeHabitCount: number
): boolean {
  return isPremiumUser || activeHabitCount < FREE_HABIT_LIMIT;
}
