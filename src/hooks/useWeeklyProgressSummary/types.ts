/**
 * Types for Weekly Progress Summary
 *
 * Prepares notification content and data for weekly progress summaries.
 * The actual notification delivery is handled elsewhere — this hook
 * computes the data and generates the copy.
 */

export interface WeeklyProgressData {
  /** Total habits completed this week */
  totalCompleted: number;

  /** Total possible completions */
  totalPossible: number;

  /** Completion percentage (0-100) */
  completionRate: number;

  /** Number of perfect days (all habits completed) */
  perfectDays: number;

  /** Current longest streak across all habits */
  longestStreak: number;

  /** Number of habits that improved this week */
  habitsImproved: number;

  /** Best day of the week */
  bestDay: { dayName: string; completionRate: number } | null;

  /** Generated notification title */
  notificationTitle: string;

  /** Generated notification body */
  notificationBody: string;

  /** Short summary for widget/badge */
  shortSummary: string;

  /** Whether data is ready */
  isReady: boolean;
}

export interface HabitWeekData {
  habitId: string;
  habitName: string;
  /** Completions per day this week (0 = not done, 1 = done) */
  dailyCompletions: number[];
  /** Current streak for this habit */
  currentStreak: number;
  /** Previous week's completion count for comparison */
  previousWeekCompletions?: number;
}
