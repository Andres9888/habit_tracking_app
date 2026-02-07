/**
 * HabitCard Streak Styles
 * StyleSheet definitions for streak badges
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';

export const streakStyles = StyleSheet.create({
  bestStreakBadge: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  bestStreakIcon: {
    fontSize: 12,
  },
  bestStreakText: {
    fontSize: 11,
    fontWeight: '600',
  },
  rippleOverlay: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.xl,
    height: 40,
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
    position: 'absolute',
    top: '50%',
    width: 40,
  },
  streakBadge: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  streakFireIcon: {
    fontSize: 14,
  },
  streakRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: 2,
    marginTop: spacing.xs,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
