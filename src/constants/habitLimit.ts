/**
 * Free-tier habit cap. Server unarchive uses the same number
 * (`FREE_HABIT_LIMIT = 3` in convex/habits/archive.ts).
 */
export const FREE_HABIT_LIMIT = 3;

export function countHabitsTowardFreeLimit(
  habits: ReadonlyArray<{ paused?: boolean | null }>
): number {
  return habits.filter((habit) => !habit.paused).length;
}

export function hasReachedFreeHabitLimit(
  habits: ReadonlyArray<{ paused?: boolean | null }>,
  isPremium: boolean
): boolean {
  return !isPremium && countHabitsTowardFreeLimit(habits) >= FREE_HABIT_LIMIT;
}

export function shouldGuardFreeHabitAction(
  isPremium: boolean,
  habitCount: number
): boolean {
  return !isPremium && habitCount >= FREE_HABIT_LIMIT;
}
