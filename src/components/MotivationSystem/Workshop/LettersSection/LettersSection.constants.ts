/**
 * LettersSection Constants
 * Configuration values for the Letters to Self feature
 */

import type { UnlockDurationOption } from './LettersSection.types';

/** Maximum content length (matching Convex validation) */
export const MAX_CONTENT_LENGTH = 5000;

/** Maximum title length */
export const MAX_TITLE_LENGTH = 100;

/** Minimum content length required */
export const MIN_CONTENT_LENGTH = 10;

/** Unlock duration options (in days) */
export const UNLOCK_DURATION_OPTIONS: readonly UnlockDurationOption[] = [
  { description: 'Quick motivation boost', label: '1 Week', value: 7 },
  { description: 'Short-term reflection', label: '2 Weeks', value: 14 },
  { description: 'Monthly milestone', label: '1 Month', value: 30 },
  { description: 'Long-term commitment', label: '3 Months', value: 90 },
] as const;

/** Milliseconds in one hour (for "just unlocked" detection) */
export const ONE_HOUR_MS = 60 * 60 * 1000;

/** Milliseconds in one day */
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/** Number of letters to display in preview list */
export const PREVIEW_LETTER_COUNT = 3;
