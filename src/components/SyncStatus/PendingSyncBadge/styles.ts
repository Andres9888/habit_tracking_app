/**
 * PendingSyncBadge Styles
 *
 * Subtle, non-intrusive styling for the pending sync badge.
 * Uses soft orange/amber tones to indicate pending state without being alarming.
 * Designed to overlay on HabitCard completion indicators.
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { borderRadius } from '../../../theme/spacing';

export const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: colors.streak[100],
    borderColor: colors.streak[300],
    borderRadius: borderRadius.small,
    borderWidth: 1,
    justifyContent: 'center',
  },

  badgeMedium: {
    height: 18,
    width: 18,
  },

  badgeSmall: {
    borderRadius: borderRadius.xs,
    height: 14,
    width: 14,
  },

  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Icon sizes for different badge sizes
export const ICON_SIZES = {
  medium: 10,
  small: 8,
} as const;

// Icon color - amber-600 for visibility
export const ICON_COLOR = colors.streak[500];
