/**
 * CompletionToast Utility Functions
 */

/**
 * Get streak message based on streak count
 */
export function getStreakMessage(streak: number): string {
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
