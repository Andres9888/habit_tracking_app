/**
 * Constants for PreviousStreakVoiceNotes component
 */

// Animation spring configs
export const SPRING_BUTTON = { damping: 15, stiffness: 300 };

/**
 * Format days ago text for display
 */
export function formatDaysAgoText(daysAgo: number): string {
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  return `${daysAgo} days ago`;
}
