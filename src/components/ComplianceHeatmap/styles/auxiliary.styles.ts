/**
 * Auxiliary styles for ComplianceHeatmap (container, empty, legend, summary)
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

export const auxiliaryStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 200,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.h3,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  legend: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
  },
  legendCell: {
    borderRadius: 2,
    height: 12,
    marginHorizontal: 2,
    width: 12,
  },
  legendLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 13,
    marginHorizontal: spacing.xs,
  },
  summary: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  summaryText: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 13,
  },
});
