/**
 * Science drill-down — shared primitives: the block stack, section label,
 * and the neutral card used by most blocks.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights } from '@/theme/typography';

export const scienceStyles = StyleSheet.create({
  stack: {
    gap: spacing.lg,
    paddingBottom: 24,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  secLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    marginBottom: spacing.md,
  },
  secLabelText: {
    color: colors.gray[800],
    fontFamily: fontFamilies.primary.display,
    fontSize: 17,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.2,
  },
  card: {
    backgroundColor: colors.gray[50],
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.base,
    ...shadows.card,
  },
});
