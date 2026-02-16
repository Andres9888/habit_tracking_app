/**
 * Analytics helpers
 *
 * Utility functions for analytics calculations including strength computation,
 * date manipulation, and heatmap level determination.
 *
 * These helpers are used by:
 * - analyticsOverview.ts: Dashboard overview statistics
 * - analyticsTrend.ts: 30-day trend data
 * - analyticsCompliance.ts: Compliance heatmap
 * - analyticsWeekly.ts: Weekly insights
 */

import { Doc, Id } from '../_generated/dataModel';

/**
 * Calculate habit strength from habit data and completion rate.
 *
 * Uses the stored strength value from the habit document when available,
 * otherwise falls back to calculating from completion rate.
 *
 * @param habit - The habit document from the database
 * @param completionRate - Completion rate as decimal (0-1), defaults to 0
 * @returns Strength as percentage (0-100)
 *
 * @example
 * // Using stored strength
 * const strength = calculateHabitStrength(habit, 0.5); // Returns habit.strength * 100
 *
 * @example
 * // Using calculated rate
 * const strength = calculateHabitStrength(habitWithoutStrength, 0.75); // Returns 75
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
 * Get date string in YYYY-MM-DD format from a Date object.
 *
 * @param date - JavaScript Date object
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * const today = getDateString(new Date()); // "2024-01-15"
 */
export function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get a Date object N days ago from today.
 * Time is set to midnight (00:00:00.000) for date-only comparisons.
 *
 * @param days - Number of days to go back
 * @returns Date object set to N days ago at midnight
 *
 * @example
 * const weekAgo = getDaysAgo(7); // Date object for 7 days ago
 */
export function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Determine heatmap level from completion rate.
 * Used for compliance heatmaps and visual indicators.
 *
 * @param completionRate - Completion rate as percentage (0-100)
 * @returns Heatmap level: 'none' (0%), 'low' (1-39%), 'medium' (40-69%), 'high' (70-100%)
 *
 * @example
 * getCompletionLevel(85); // 'high'
 * getCompletionLevel(50); // 'medium'
 * getCompletionLevel(20); // 'low'
 * getCompletionLevel(0);  // 'none'
 */
export function getCompletionLevel(
  completionRate: number
): 'none' | 'low' | 'medium' | 'high' {
  if (completionRate >= 70) return 'high';
  if (completionRate >= 40) return 'medium';
  if (completionRate > 0) return 'low';
  return 'none';
}
