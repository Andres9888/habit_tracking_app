/**
 * CompletionToast Constants
 */

import { colors } from '@/theme/colors';

/** Threshold for swipe to dismiss */
export const DISMISS_THRESHOLD = 50;

/** Toast colors */
export const COLORS = {
  streakBadgeBg: 'rgba(251, 146, 60, 0.15)',
  streakTextColor: '#EA580C',
  successGreen: colors.primary[500],
  white: colors.text.inverse,
} as const;
