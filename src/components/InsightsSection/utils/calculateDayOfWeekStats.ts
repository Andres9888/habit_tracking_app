import { getLocalDateString } from '@/utils/getLocalDateString';
/**
 * Calculates completion rate by day of week
 */

import type { HabitTrackingEntry } from '../../../features/habits/types';
import type { DayStats } from '../InsightsSection.types';
import { DAY_LABELS } from '../InsightsSection.constants';

/**
 * Calculate completion rate for each day of the week
 * @param tracking - Array of habit tracking entries
 * @param habitCreatedAt - Timestamp when habit was created (optional)
 * @returns Array of day statistics with completion rates
 */
export function calculateDayOfWeekStats(
  tracking: HabitTrackingEntry[],
  habitCreatedAt?: number
): DayStats[] {
  const dayStats: Record<number, { completed: number; total: number }> = {};

  // Initialize all days
  for (let i = 0; i < 7; i++) {
    dayStats[i] = { completed: 0, total: 0 };
  }

  // Get the start date (habit creation or first tracking entry)
  const startDate = habitCreatedAt
    ? new Date(habitCreatedAt)
    : tracking.length > 0
      ? new Date(tracking.at(-1)?.date ?? Date.now())
      : new Date();

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // Create a set of completed dates for quick lookup
  const completedDates = new Set(
    tracking.filter((t) => t.completed).map((t) => t.date)
  );

  // Iterate through each day from start to today
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  while (current <= today) {
    const dayOfWeek = current.getDay();
    const dateStr = getLocalDateString(current);

    dayStats[dayOfWeek].total++;
    if (completedDates.has(dateStr)) {
      dayStats[dayOfWeek].completed++;
    }

    current.setDate(current.getDate() + 1);
  }

  return DAY_LABELS.map((day, index) => ({
    completed: dayStats[index].completed,
    day,
    dayIndex: index,
    rate:
      dayStats[index].total > 0
        ? Math.round((dayStats[index].completed / dayStats[index].total) * 100)
        : 0,
    total: dayStats[index].total,
  }));
}
