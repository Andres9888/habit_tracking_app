/**
 * HabitItem Styles
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const habitItemStyles = StyleSheet.create({
  changePercentage: {
    ...typography.bodyBold,
    fontSize: typography.bodySmall.fontSize,
    marginLeft: spacing.xs,
  },
  habitEmoji: {
    fontSize: typography.heading1.fontSize,
    marginRight: spacing.sm,
  },
  habitInfo: {
    flex: 1,
  },
  habitItem: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  habitItemLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  habitItemRight: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  habitName: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  habitStats: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});
