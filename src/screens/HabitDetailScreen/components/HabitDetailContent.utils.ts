/**
 * Helpers for HabitDetailContent — completion rate derivation.
 */
import type { Habit } from '../../../features/habits/types';

export function computeCompletionRate(
  habit: Habit,
  totalCompletions: number
): number {
  if (!habit.createdAt) return 0;
  const created = new Date(habit.createdAt).getTime();
  if (Number.isNaN(created)) return 0;
  const daysSince = Math.max(
    1,
    Math.ceil((Date.now() - created) / 86_400_000)
  );
  return Math.round((totalCompletions / daysSince) * 100);
}
