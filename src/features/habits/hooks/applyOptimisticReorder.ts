/**
 * Helper to apply optimistic reorder to habits array.
 * Reorders habits according to pendingOrder IDs,
 * handling edge cases like deleted or newly added habits.
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';

export function applyOptimisticReorder(
  habits: Habit[],
  pendingOrder: Id<'habits'>[]
): Habit[] {
  const habitMap = new Map(habits.map((h) => [h._id, h]));

  const reordered: Habit[] = [];
  for (const id of pendingOrder) {
    const habit = habitMap.get(id);
    if (habit !== undefined) {
      reordered.push(habit);
      habitMap.delete(id);
    }
  }

  // Append any habits not in pendingOrder (e.g. created during drag)
  for (const habit of habitMap.values()) {
    reordered.push(habit);
  }

  return reordered;
}
