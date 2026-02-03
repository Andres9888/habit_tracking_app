/**
 * Habit Calculations Module
 *
 * Provides utility functions for calculating habit metrics including:
 * - Best (longest) streak
 * - Completion percentage
 * - Activity log formatting
 *
 * All date calculations use date-fns for consistency and handle timezone
 * differences properly by normalizing to midnight.
 *
 * @module utils/habitCalculations
 */

import { format, parseISO, differenceInDays } from 'date-fns';

/**
 * Represents a single day's tracking entry for a habit
 */
interface TrackingEntry {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Whether the habit was completed on this date */
  completed: boolean;
}

/**
 * Calculate the all-time best (longest) streak for a habit.
 *
 * Finds the longest consecutive sequence of completed days in the entire
 * tracking history. This is different from "current streak" which only
 * counts consecutive days up to today.
 *
 * Algorithm:
 * 1. Extract and sort all completed dates chronologically
 * 2. Iterate through dates, counting consecutive days
 * 3. Reset counter when a gap is found (diff > 1 day)
 * 4. Track maximum streak length seen
 *
 * @param tracking - Array of tracking entries (all days, completed and incomplete)
 * @returns Longest consecutive streak length (in days), or 0 if no completions
 *
 * @example
 * ```ts
 * const tracking = [
 *   { date: '2024-01-01', completed: true },
 *   { date: '2024-01-02', completed: true },
 *   { date: '2024-01-03', completed: false }, // gap
 *   { date: '2024-01-04', completed: true },
 * ];
 * const best = calculateBestStreak(tracking); // Returns 2
 * ```
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
 *
 * Computes the percentage of days on which the habit was completed,
 * from the habit's creation date through today (inclusive).
 *
 * Formula: (completed_days / total_days_since_creation) * 100
 *
 * The result is rounded to the nearest integer for display purposes.
 *
 * @param habitCreatedAt - Habit creation timestamp (milliseconds since epoch)
 * @param tracking - Array of all tracking entries for the habit
 * @returns Completion percentage as an integer (0-100), or 0 if habit created in the future
 *
 * @example
 * ```ts
 * const createdAt = new Date('2024-01-01').getTime();
 * const tracking = [
 *   { date: '2024-01-01', completed: true },
 *   { date: '2024-01-02', completed: false },
 *   { date: '2024-01-03', completed: true },
 * ];
 * // If today is 2024-01-03:
 * const percentage = calculateCompletionPercentage(createdAt, tracking);
 * // Returns 67 (2 completed out of 3 total days)
 * ```
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
 * Format a date string for display in activity logs.
 *
 * Converts ISO date string (YYYY-MM-DD) to human-readable format.
 * Output format: "Weekday, Month Day" (e.g., "Sunday, October 19")
 *
 * @param date - ISO date string in YYYY-MM-DD format
 * @returns Formatted date string
 *
 * @example
 * ```ts
 * formatActivityDate('2024-01-15'); // "Monday, January 15"
 * ```
 */
export function formatActivityDate(date: string): string {
  return format(parseISO(date), 'EEEE, MMMM d');
}

/**
 * Format a timestamp for display in activity logs.
 *
 * Converts Unix timestamp to 12-hour time format with AM/PM.
 * Output format: "h:mm AM/PM" (e.g., "7:03 AM", "11:45 PM")
 *
 * @param timestamp - Unix timestamp in milliseconds since epoch
 * @returns Formatted time string
 *
 * @example
 * ```ts
 * const timestamp = new Date('2024-01-15T14:30:00').getTime();
 * formatActivityTime(timestamp); // "2:30 PM"
 * ```
 */
export function formatActivityTime(timestamp: number): string {
  return format(new Date(timestamp), 'h:mm a');
}
