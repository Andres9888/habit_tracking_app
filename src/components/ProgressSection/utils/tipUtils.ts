/**
 * Actionable tip generation utilities
 */

import type { DayStats } from '../types';

/**
 * Generate an actionable tip based on user's weak days pattern
 *
 * @param dayStats - Array of day statistics
 * @param currentStreak - Current active streak count
 * @returns Actionable tip string
 */
export function generateActionableTip(
  dayStats: DayStats[],
  currentStreak: number
): string {
  // Find weak days (below 70% completion rate with at least some data)
  const weakDays = dayStats
    .filter((d) => d.total > 0 && d.rate < 70)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 2);

  // If user is on a good streak, encourage them
  if (currentStreak >= 7) {
    return 'Amazing streak! Keep the momentum going.';
  }

  // If there are weak days, suggest focusing on them
  if (weakDays.length > 0) {
    const dayNames = weakDays.map((d) => d.day).join(' & ');
    return `Focus on ${dayNames} to level up!`;
  }

  // If all days are good but short streak, encourage consistency
  if (currentStreak > 0 && currentStreak < 7) {
    return `${7 - currentStreak} more days to hit a week streak!`;
  }

  // Default tip
  return 'Complete today to start a new streak!';
}
