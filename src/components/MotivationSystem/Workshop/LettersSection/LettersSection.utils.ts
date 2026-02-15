/**
 * LettersSection Utilities
 * Helper functions for the Letters to Self feature
 */

import { ONE_DAY_MS } from './LettersSection.constants';
import { formatLocaleDate } from '../../../../utils/dateFormat';

/**
 * Format timestamp as relative time
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatLocaleDate(timestamp);
}

/**
 * Calculate days until unlock
 */
export function calculateDaysUntilUnlock(unlockAt: number): number {
  const now = Date.now();
  return Math.ceil((unlockAt - now) / ONE_DAY_MS);
}

/**
 * Check if a letter is locked
 */
export function isLetterLocked(unlockAt: number): boolean {
  return unlockAt > Date.now();
}

/**
 * Check if a letter is new (unlocked and unread)
 */
export function isLetterNew(unlockAt: number, isRead: boolean): boolean {
  return !isRead && !isLetterLocked(unlockAt);
}
