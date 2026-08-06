/**
 * Weekly insights calculation helpers
 */

import type { Doc, Id } from '../_generated/dataModel';
import { HabitChange } from './types';

export type WeeklyCompletionCounts = { thisWeek: number; lastWeek: number };

/**
 * Bucket completions per habit for the current and previous week in one pass.
 *
 * Callers map over every active habit, so doing the filtering inside
 * `calculateHabitChanges` meant two full scans of the tracking array per habit
 * — habits x rows x 2 operations. Build this index once and hand it in.
 *
 * Tracking dates are YYYY-MM-DD calendar-day keys, compared lexicographically
 * (same pattern as streakUtils) rather than parsed into Date instants.
 */
export function buildWeeklyCompletionIndex(
  trackings: Doc<'tracking'>[],
  oneWeekAgoKey: string,
  twoWeeksAgoKey: string
): Map<Id<'habits'>, WeeklyCompletionCounts> {
  const index = new Map<Id<'habits'>, WeeklyCompletionCounts>();

  for (const t of trackings) {
    if (!t.completed) continue;

    const isThisWeek = t.date >= oneWeekAgoKey;
    const isLastWeek = t.date < oneWeekAgoKey && t.date >= twoWeeksAgoKey;
    if (!isThisWeek && !isLastWeek) continue;

    const counts = index.get(t.habitId) ?? { lastWeek: 0, thisWeek: 0 };
    if (isThisWeek) counts.thisWeek += 1;
    else counts.lastWeek += 1;
    index.set(t.habitId, counts);
  }

  return index;
}

/**
 * Calculate habit changes for weekly insights
 */
export function calculateHabitChanges(
  habit: { _id: Id<'habits'>; name: string; icon?: string },
  completionIndex: Map<Id<'habits'>, WeeklyCompletionCounts>,
  currentStreak: number
): HabitChange {
  const { lastWeek: lastWeekCompletions, thisWeek: thisWeekCompletions } =
    completionIndex.get(habit._id) ?? { lastWeek: 0, thisWeek: 0 };

  const change = thisWeekCompletions - lastWeekCompletions;
  const percentageChange =
    lastWeekCompletions > 0
      ? (change / lastWeekCompletions) * 100
      : thisWeekCompletions > 0
        ? 100
        : 0;

  return {
    change,
    currentStreak,
    emoji: habit.icon || '🎯',
    habitId: habit._id,
    lastWeek: lastWeekCompletions,
    name: habit.name,
    percentageChange,
    thisWeek: thisWeekCompletions,
  };
}

/**
 * Categorize habits by performance
 */
export function categorizeHabitChanges(habitChanges: HabitChange[]) {
  const gainedStrength = habitChanges
    .filter((h) => h.change > 0)
    .sort((a, b) => b.percentageChange - a.percentageChange)
    .slice(0, 3);

  const lostStrength = habitChanges
    .filter((h) => h.change < 0)
    .sort((a, b) => a.percentageChange - b.percentageChange)
    .slice(0, 3);

  const atRisk = habitChanges
    .filter((h) => h.thisWeek < 3 || (h.change < 0 && h.currentStreak < 7))
    .slice(0, 3);

  return { atRisk, gainedStrength, lostStrength };
}

/**
 * Calculate week-over-week change percentage
 */
export function calculateWeekOverWeekChange(habitChanges: HabitChange[]) {
  const totalCompletionsThisWeek = habitChanges.reduce(
    (sum, h) => sum + h.thisWeek,
    0
  );
  const totalCompletionsLastWeek = habitChanges.reduce(
    (sum, h) => sum + h.lastWeek,
    0
  );
  const weekOverWeekChange =
    totalCompletionsLastWeek > 0
      ? ((totalCompletionsThisWeek - totalCompletionsLastWeek) /
          totalCompletionsLastWeek) *
        100
      : 0;

  return {
    totalCompletionsLastWeek,
    totalCompletionsThisWeek,
    weekOverWeekChange,
  };
}
