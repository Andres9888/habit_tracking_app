import { StyleSheet } from 'react-native';
import { spacing, borderRadius } from '../../../theme/spacing';
import { typography, fontWeights } from '../../../theme/typography';

export const headerRowStyles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 80,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 80,
  },
  avatarEmoji: {
    fontSize: typography.displayLarge.fontSize,
    lineHeight: 41,
  },
  avatarGradient: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  avatarRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelCol: {
    flexDirection: 'column',
  },
  levelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  levelText: {
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.3125,
    lineHeight: 24,
  },
  sparkleEmoji: {
    fontSize: typography.body.fontSize,
  },
  titleText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.15,
    lineHeight: 20,
  },
  trophyBadge: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  trophyGradient: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  trophyText: {
    color: 'white',
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.3125,
    lineHeight: 24,
  },
});
