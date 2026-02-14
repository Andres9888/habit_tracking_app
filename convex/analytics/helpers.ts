/**
 * Analytics helpers
 *
 * Utility functions for analytics calculations.
 */

import { Doc, Id } from '../_generated/dataModel';

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

/**
 * Get difficulty weighting factor for streak scoring
 * Easy: 1.0x, Medium: 1.3x, Hard: 1.6x
 * Higher difficulty multiplies strength for analytics rankings
 */
export function getDifficultyWeighting(difficulty?: string): number {
  switch (difficulty) {
    case 'easy':
      return 1.0;
    case 'hard':
      return 1.6;
    case 'medium':
    default:
      return 1.3;
  }
}
