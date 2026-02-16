/**
 * Habit Statistics Calculations
 *
 * Pure functions for calculating habit statistics:
 * - Best streak (longest consecutive completion sequence)
 * - Completion percentage (days completed / total days)
 * - Activity date/time formatting
 *
 * @module habitCalculations
 * @category Statistics
 */

import { format, parseISO, differenceInDays } from 'date-fns';

interface TrackingEntry {
  date: string;
  completed: boolean;
}

/**
 * Calculate the all-time best streak for a habit.
 * Returns the longest consecutive sequence of completed days in the entire history.
 *
 * @param tracking - Array of tracking entries with date and completed status
 * @returns Maximum consecutive days completed (0 if none)
 *
 * @example
 * const tracking = [
 *   { date: '2024-01-01', completed: true },
 *   { date: '2024-01-02', completed: true },
 *   { date: '2024-01-03', completed: true },
 *   { date: '2024-01-05', completed: true }, // gap
 *   { date: '2024-01-06', completed: true },
 * ];
 * calculateBestStreak(tracking); // returns 3
 */
export function calculateBestStreak(tracking: TrackingEntry[]): number {
  if (tracking.length === 0) return 0;

  const completedDates = tracking
    .filter((t) => t.completed)
    .map((t) => parseISO(t.date).getTime())
    .sort((a, b) => a - b); // Sort ascending

  if (completedDates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < completedDates.length; i++) {
    const prevDate = new Date(completedDates[i - 1]);
    const currDate = new Date(completedDates[i]);

    prevDate.setHours(0, 0, 0, 0);
    currDate.setHours(0, 0, 0, 0);

    const daysDiff = differenceInDays(currDate, prevDate);

    if (daysDiff === 1) {
      // Consecutive day
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (daysDiff > 1) {
      // Gap in tracking, reset streak
      currentStreak = 1;
    }
    // If daysDiff === 0 (same day), keep current streak (shouldn't happen with unique dates)
  }

  return maxStreak;
}

/**
 * Calculate completion percentage for a habit.
 * Percentage of days completed since habit creation until today.
 *
 * @param habitCreatedAt - Unix timestamp (ms) when habit was created
 * @param tracking - Array of tracking entries
 * @returns Completion percentage (0-100), rounded to nearest integer
 *
 * @example
 * const tracking = [
 *   { date: '2024-01-01', completed: true },
 *   { date: '2024-01-02', completed: true },
 *   { date: '2024-01-03', completed: false },
 * ];
 * calculateCompletionPercentage(1704067200000, tracking); // ~67 (2/3 days)
 */
export function calculateCompletionPercentage(
  habitCreatedAt: number,
  tracking: TrackingEntry[]
): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const createdDate = new Date(habitCreatedAt);
  createdDate.setHours(0, 0, 0, 0);

  // Calculate total days from creation to today (inclusive)
  const totalDays = differenceInDays(today, createdDate) + 1;

  if (totalDays <= 0) return 0;

  // Count completed days
  const completedDays = tracking.filter((t) => t.completed).length;

  // Calculate percentage
  const percentage = (completedDays / totalDays) * 100;

  return Math.round(percentage);
}

/**
 * Format activity log date in "Sunday, October 19" format.
 *
 * @param date - Date string in YYYY-MM-DD format
 * @returns Formatted date string (e.g., "Sunday, January 15")
 *
 * @example
 * formatActivityDate('2024-01-15') // "Sunday, January 15"
 */
export function formatActivityDate(date: string): string {
  return format(parseISO(date), 'EEEE, MMMM d');
}

/**
 * Format activity log time in "7:03 AM" format.
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted time string (e.g., "7:03 AM")
 *
 * @example
 * formatActivityTime(1705333380000) // "7:03 AM" (depends on local timezone)
 */
export function formatActivityTime(timestamp: number): string {
  return format(new Date(timestamp), 'h:mm a');
}
