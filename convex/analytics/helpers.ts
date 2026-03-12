/**
 * Analytics helpers
 *
 * Utility functions for analytics calculations.
 */

import { Doc } from '../_generated/dataModel';

/**
 * Calculate habit strength from habit data and completion rate
 */
export function calculateHabitStrength(
  habit: Doc<'habits'>,
  completionRate: number = 0
): number {
  // Use the habit's stored strength if available
  if (habit.strength !== undefined) {
    return habit.strength * 100;
  }
  // Otherwise calculate based on completion rate
  return completionRate * 100;
}

/**
 * Get date string in YYYY-MM-DD format
 */
export function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get date N days ago from today
 */
export function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Determine heatmap level from completion rate
 */
export function getCompletionLevel(
  completionRate: number
): 'none' | 'low' | 'medium' | 'high' {
  if (completionRate >= 70) return 'high';
  if (completionRate >= 40) return 'medium';
  if (completionRate > 0) return 'low';
  return 'none';
}
