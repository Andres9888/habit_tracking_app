/**
 * SyncingIndicator Styles
 *
 * Subtle, non-intrusive styling for the syncing status indicator.
 * Uses amber/orange tones to indicate active sync process.
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../theme/spacing';
import { typography } from '@/theme/typography';
import { colors } from '../../../theme/colors';
import type { SemanticColors } from '../../../theme/darkColors';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fffbeb', // amber-50 - warm active background
    // borderColor set by themedStyles
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  countBadge: {
    backgroundColor: '#f59e0b', // amber-500
    borderRadius: borderRadius.small,
    marginLeft: 2,
    minWidth: 16,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },

  countText: {
    color: colors.text.inverse,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },

  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#fef3c7', // amber-100
    borderRadius: borderRadius.small,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },

  text: {
    color: '#92400e', // amber-800 - visible but not harsh
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

export function themedStyles(colors: SemanticColors) {
  return StyleSheet.create({
    container: {
      borderColor: colors.borders.warningSoft,
    },
  });
}
