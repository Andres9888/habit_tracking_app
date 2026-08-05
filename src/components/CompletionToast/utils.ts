/**
 * CompletionToast Utility Functions
 */

import { milestoneMessage } from '../../constants/milestones';

/**
 * Get streak message based on streak count. On round-number milestone streaks
 * (7/30/100/365) returns the shared milestone copy so the today-screen toast
 * and DayCompleteBeat read the same.
 */
export function getStreakMessage(streak: number): string {
  const milestone = milestoneMessage(streak);
  if (milestone) return milestone;
  if (streak === 1) return '1 day streak';
  return `${streak} day streak`;
}

/**
 * Get celebration emoji based on streak milestones
 */
export function getStreakEmoji(streak: number): string {
  if (streak >= 100) return '💎';
  if (streak >= 50) return '⭐';
  if (streak >= 30) return '🏆';
  if (streak >= 14) return '💪';
  if (streak >= 7) return '🌟';
  return '🔥';
}
