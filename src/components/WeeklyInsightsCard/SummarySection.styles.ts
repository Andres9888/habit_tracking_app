/**
 * SummarySection Styles
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';

export const summaryStyles = StyleSheet.create({
  summaryCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.small,
    padding: spacing.md,
  },
  summaryCompletions: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  summaryDivider: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: spacing.sm,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryValue: {
    ...typography.heading3,
    marginLeft: spacing.xs,
  },
  summaryValueContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
