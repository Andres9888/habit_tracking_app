import type { Habit } from '../../types';

/**
 * Returns the target plus the closest surrounding rows that must be laid out
 * before the Template Library may reveal the focused region.
 */
export function getFocusNeighborhoodIds(
  habits: Habit[],
  targetIndex: number
): string[] {
  const neighborhoodSize = Math.min(3, habits.length);
  const maxStart = Math.max(0, habits.length - neighborhoodSize);
  const start = Math.min(Math.max(0, targetIndex - 1), maxStart);

  return habits
    .slice(start, start + neighborhoodSize)
    .map((habit) => habit._id);
}

export function isFocusNeighborhoodLaidOut(
  habits: Habit[],
  targetIndex: number,
  laidOutIds: ReadonlySet<string>
): boolean {
  const ids = getFocusNeighborhoodIds(habits, targetIndex);
  return ids.length > 0 && ids.every((id) => laidOutIds.has(id));
}
