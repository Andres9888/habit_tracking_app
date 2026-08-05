/**
 * Watch + Read action pill styles for the Science section.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { withAlpha } from '@/theme/colors';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const actionPillsStyles = StyleSheet.create({
  filled: {
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.full,
    elevation: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    shadowColor: colors.primary[700],
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
  },
  filledText: {
    color: colors.text.inverse,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
  },
  outline: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: withAlpha(colors.primary[600], 0.3),
    borderRadius: borderRadius.full,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    ...shadows.subtle,
  },
  outlineText: {
    color: colors.primary[700],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.semibold,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
