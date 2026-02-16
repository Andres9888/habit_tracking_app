/**
 * ConflictNotification Styles
 *
 * Amber-themed styling for the conflict resolution notification.
 * Uses amber tones to indicate informational status (conflict handled).
 * Distinct from green (success) and red (error) themes.
 */

import { StyleSheet } from 'react-native';

import { borderRadius } from '../../../theme/spacing';
import { typography } from '@/theme/typography';
import type { SemanticColors } from '../../../theme/darkColors';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fffbeb', // amber-50 - soft warning background
    // borderColor set by themedStyles
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  countText: {
    color: '#92400e', // amber-800
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
  },

  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#fef3c7', // amber-100
    borderRadius: borderRadius.medium,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },

  text: {
    color: '#92400e', // amber-800
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

export const ICON_SIZE = 12;
export const ICON_COLOR = '#d97706'; // amber-600

export function themedStyles(colors: SemanticColors) {
  return StyleSheet.create({
    container: {
      borderColor: colors.borders.warningSubtle,
    },
  });
}
