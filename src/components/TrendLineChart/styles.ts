/**
 * Styles for TrendLineChart component
 */

import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, shadows } from '../../theme/spacing';

const { width: screenWidth } = Dimensions.get('window');
export const chartWidth = screenWidth - spacing.xl * 2;
export const chartHeight = 200;

export const styles = StyleSheet.create({
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
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  legendLine: {
    height: 2,
    marginRight: spacing.xs,
    width: 20,
  },
  legendText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  tooltip: {
    ...shadows.modal,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.sm,
    position: 'absolute',
    right: spacing.md,
    shadowOpacity: 0.1,
    top: spacing.md,
  },
  tooltipDate: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xxs,
  },
  tooltipValue: {
    ...typography.bodyBold,
    color: colors.text.primary,
    fontSize: 12,
  },
});
