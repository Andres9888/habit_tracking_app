/**
 * Achievement card styles for shareable card
 */

import { StyleSheet } from 'react-native';
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
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginBottom: spacing.base,
    width: 80,
  },
  badgeEmoji: { fontSize: 40 },
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
  habitEmoji: { fontSize: 20, marginRight: spacing.sm },
  habitName: { ...typography.heading3, color: '#FFFFFF' },
  streakText: {
    ...typography.displayLarge,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  title: {
    ...typography.heading1,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
