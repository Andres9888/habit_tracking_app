/**
 * Jump-nav chip row styles — sits above the science drill-down scroll area.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const jumpNavStyles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.gray[50],
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  row: {
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  chip: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 14,
  },
  chipText: {
    color: colors.gray[700],
    ...typography.caption,
    fontFamily: fontFamilies.primary.text,
    fontWeight: fontWeights.bold,
  },
  chipTextActive: { color: '#FFFFFF' },
});
