/**
 * Weekly insights calculation helpers
 */

import type { Doc, Id } from '../_generated/dataModel';
import { HabitChange } from './types';

/**
 * Calculate habit changes for weekly insights
 */
export function calculateHabitChanges(
  habit: { _id: Id<'habits'>; name: string; icon?: string },
  trackings: Doc<'tracking'>[],
  oneWeekAgoKey: string,
  twoWeeksAgoKey: string,
  currentStreak: number
): HabitChange {
  // Tracking dates are YYYY-MM-DD calendar-day keys; compare lexicographically
  // (same pattern as streakUtils) instead of parsing into Date instants.
  const thisWeekCompletions = trackings.filter(
    (t) => t.habitId === habit._id && t.completed && t.date >= oneWeekAgoKey
  ).length;

  const lastWeekCompletions = trackings.filter(
    (t) =>
      t.habitId === habit._id &&
      t.completed &&
      t.date < oneWeekAgoKey &&
      t.date >= twoWeeksAgoKey
  ).length;

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
