import { durations } from '@/theme/animations';
/**
 * Constants for StrengthComparisonCards
 */

// Animation constants
export const RING_ANIMATION_DURATION = durations.progress;
export const NUMBER_COUNT_UP_DURATION = durations.progress;
export const RING_SIZE = 56;
export const RING_STROKE_WIDTH = 4;

// WCAG AA compliant colors (4.5:1 minimum contrast ratio)
export const DELTA_BADGE_COLORS = {
  // Emerald-700 (WCAG AA: 5.48:1)
  negative: '#dc2626',
  // Red-600 (WCAG AA: 4.83:1)
  neutral: '#78716c',
  positive: '#047857', // Stone-500 (WCAG AA: 4.80:1)
} as const;
