/**
 * HabitRankingItem Styles
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export const itemStyles = StyleSheet.create({
  habitEmoji: {
    fontSize: typography.heading2.fontSize,
    marginRight: spacing.xs,
  },
  habitHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  habitInfo: {
    flex: 1,
  },
  habitItem: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  habitItemLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  habitItemRight: {
    alignItems: 'flex-end',
    marginLeft: spacing.md,
  },
  habitName: {
    ...typography.bodyBold,
    color: colors.text.primary,
    flex: 1,
  },
  habitStats: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  rankBadge: {
    fontSize: typography.heading1.fontSize,
  },
  rankContainer: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 32,
  },
  rankNumber: {
    ...typography.bodyBold,
    color: colors.text.tertiary,
    fontSize: typography.bodySmall.fontSize,
  },
  riskBadge: {
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    borderRadius: borderRadius.xs,
    flexDirection: 'row',
    marginLeft: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  riskText: {
    ...typography.caption,
    color: colors.error,
    fontSize: typography.tabBar.fontSize,
    marginLeft: 2,
  },
  statItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: spacing.md,
  },
  statText: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginLeft: spacing.xs,
  },
  strengthPercentage: {
    ...typography.heading3,
    color: colors.primary[700],
    marginBottom: spacing.xs,
  },
});
