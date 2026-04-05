/**
 * HabitCard Streak Styles
 * StyleSheet definitions for streak badges
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

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
    fontSize: typography.caption.fontSize,
  },
  bestStreakText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.tabBar.fontSize,
    fontWeight: fontWeights.semibold,
  },
  rippleOverlay: {
    backgroundColor: colors.streak[500],
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
    fontSize: typography.bodySmall.fontSize,
  },
  streakRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: 2,
    marginTop: spacing.xs,
  },
  streakText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
