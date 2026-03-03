import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '../../../../theme/spacing';
import { typography } from '@/theme/typography';

export const noStreakStyles = StyleSheet.create({
  noStreakContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: spacing.xs,
  },
  noStreakIcon: {
    marginRight: spacing.md,
  },
  noStreakSubtext: {
    color: colors.gray[500],
    fontSize: typography.caption.fontSize,
    marginTop: 2,
  },
  noStreakTextContainer: {
    flex: 1,
  },
  noStreakTitle: {
    color: colors.gray[700],
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
});
