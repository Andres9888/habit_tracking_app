/**
 * Constants for PreviousStreakVoiceNotes component
 */

import { springs } from '@/theme/animations';

// Animation spring configs
export const SPRING_BUTTON = springs.responsive;

/**
 * Format days ago text for display
 */
export function formatDaysAgoText(daysAgo: number): string {
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  return `${daysAgo} days ago`;
}
