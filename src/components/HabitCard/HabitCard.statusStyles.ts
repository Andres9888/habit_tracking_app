/**
 * HabitCard Status Styles
 * Check circles, streak badges, and warning indicators
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';
import { REDESIGN_COLORS } from './HabitCard.colors';

export const statusStyles = StyleSheet.create({
  checkCircle: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    // 44x44 minimum touch target via padding (28 + 8*2 = 44)
    padding: 0,
    width: 28,
  },
  checkCircleTouchTarget: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  checkCircleCompleted: {
    backgroundColor: REDESIGN_COLORS.accent,
    borderColor: REDESIGN_COLORS.accent,
  },
  checkCircleUnchecked: {
    backgroundColor: 'transparent',
    borderColor: REDESIGN_COLORS.neutral,
  },
  checkmark: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 28,
    justifyContent: 'center',
    width: 28,
    // Parent checkCircleTouchTarget provides 44px hit area
  },
  checkmarkText: {
    color: colors.text.inverse,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.bold,
  },
  statusContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginLeft: spacing.sm,
  },
  streakBadge: {
    borderRadius: borderRadius.large,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  streakBadgeCompleted: {
    backgroundColor: REDESIGN_COLORS.accentMuted,
  },
  streakBadgeUnchecked: {
    backgroundColor: 'transparent',
  },
  streakText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.medium,
    lineHeight: 20,
  },
  streakTextCompleted: {
    color: REDESIGN_COLORS.accent,
  },
  streakTextUnchecked: {
    color: REDESIGN_COLORS.neutral,
  },
  warningBadge: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  warningText: { fontFamily: fontFamilies.primary.text, fontSize: 13 },
});
