/**
 * Habit Existence Checking
 *
 * Functions for checking if habits exist on the server.
 */

import type { Id } from '../../../../../convex/_generated/dataModel';
import type { CleanupOrphansDeps, HabitExistsResult } from './types';

/**
 * Check existence for multiple habits using single-habit checker
 * On error, assumes habit exists to avoid accidental deletion (fail-safe)
 */
export async function checkHabitsExistence(
  habitIds: Id<'habits'>[],
  checker: CleanupOrphansDeps['checkHabitExists']
): Promise<HabitExistsResult[]> {
  const results: HabitExistsResult[] = [];

  for (const habitId of habitIds) {
    try {
      const result = await checker(habitId);
      results.push(result);
    } catch {
      // On error, assume habit exists to avoid accidental deletion
      results.push({ exists: true, habitId });
    }
  }

  return results;
}
