/**
 * Achievement card styles for shareable card
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const achievementCardStyles = StyleSheet.create({
  appBranding: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: spacing.lg,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.xl,
    height: 80,
    justifyContent: 'center',
    marginBottom: spacing.base,
    width: 80,
  },
  badgeEmoji: { fontSize: 34 },
  container: {
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    width: 320,
    ...shadows.modal,
  },
  daysLabel: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.base,
    textAlign: 'center',
  },
  gradient: { alignItems: 'center', padding: spacing.xl },
  habitContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  habitEmoji: { fontSize: typography.heading3.fontSize, marginRight: spacing.sm },
  habitName: { ...typography.heading3, color: colors.text.inverse },
  streakText: {
    ...typography.displayLarge,
    color: colors.text.inverse,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  title: {
    ...typography.heading1,
    color: colors.text.inverse,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
