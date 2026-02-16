/**
 * PendingSyncBadge Styles
 *
 * Subtle, non-intrusive styling for the pending sync badge.
 * Uses soft orange/amber tones to indicate pending state without being alarming.
 * Designed to overlay on HabitCard completion indicators.
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../theme/spacing';
import type { SemanticColors } from '../../../theme/darkColors';

export const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: '#fef3c7', // amber-100 - soft pending indicator
    // borderColor set by themedStyles
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
export const ICON_COLOR = '#d97706';

export function themedStyles(colors: SemanticColors) {
  return StyleSheet.create({
    badge: {
      borderColor: colors.borders.warningSubtle,
    },
  });
}
