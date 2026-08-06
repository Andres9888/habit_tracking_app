/**
 * Client mirror of the server free-tier boundary.
 *
 * The cap itself lives in `convex/subscriptions/freeTier.ts` and is enforced
 * there; this module exists so the app can reach the paywall *before* the
 * mutation fails. A user who taps "new habit" at the cap should meet an offer,
 * not an error dialog — the two produce very different conversion rates from
 * the same moment of intent.
 */

/** Keep in sync with `FREE_HABIT_LIMIT` in convex/subscriptions/freeTier.ts. */
export const FREE_HABIT_LIMIT = 3;

/** Prefix the server attaches to entitlement errors. */
const PREMIUM_REQUIRED_CODE = 'PREMIUM_REQUIRED';

/** A habit shape reduced to the fields that decide free-tier occupancy. */
interface TierCountableHabit {
  archived?: boolean | undefined;
  paused?: boolean | undefined;
}

/**
 * Count habits occupying a free-tier slot — active meaning neither archived
 * nor paused, matching `countActiveHabits` on the server.
 */
export function countActiveHabits(habits: readonly TierCountableHabit[]): number {
  return habits.filter((habit) => habit.archived !== true && !habit.paused)
    .length;
}

/**
 * Whether the user can add another habit without upgrading.
 *
 * @param isPremiumUser - Current entitlement state.
 * @param habits - The user's habits, archived ones included.
 */
export function canAddHabit(
  isPremiumUser: boolean,
  habits: readonly TierCountableHabit[]
): boolean {
  return isPremiumUser || countActiveHabits(habits) < FREE_HABIT_LIMIT;
}

/**
 * Whether a thrown value is the server's "this needs premium" signal rather
 * than a genuine failure. Used to route to the paywall instead of a retry
 * alert, which for an entitlement error would loop forever.
 */
export function isPremiumRequiredError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : typeof error === 'string' ? error : '';
  return message.includes(PREMIUM_REQUIRED_CODE);
}
