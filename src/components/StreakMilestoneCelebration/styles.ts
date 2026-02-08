/**
 * Styles for StreakMilestoneCelebration component
 * Uses design system: 34/22/17/13 typography, 16px border-radius, shadows
 */

import { StyleSheet } from 'react-native';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  // Modal container
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },

  // Content card
  card: {
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.large,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    ...shadows.modal,
  },

  // Emoji badge
  emojiBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.floatingActionButton,
  },

  emoji: {
    fontSize: 48,
  },

  // Title (22pt - heading2)
  title: {
    ...typography.heading2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  // Subtitle (17pt - body)
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.base,
  },

  // Streak count badge
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xl,
  },

  streakCount: {
    ...typography.displayLarge,
    fontWeight: '700',
    marginRight: spacing.xs,
  },

  streakLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },

  // Habit info row
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  habitEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },

  habitName: {
    ...typography.heading3,
    color: colors.text.primary,
  },

  // Action buttons
  actionsContainer: {
    width: '100%',
    gap: spacing.md,
  },

  primaryButton: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.base,
    alignItems: 'center',
    ...shadows.card,
  },

  primaryButtonText: {
    ...typography.button,
    color: '#FFFFFF',
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.medium,
    borderWidth: 1.5,
    borderColor: colors.gray[300],
    paddingVertical: spacing.base,
    alignItems: 'center',
  },

  secondaryButtonText: {
    ...typography.button,
    color: colors.text.secondary,
  },
});

// Achievement card styles for shareable card
export const achievementCardStyles = StyleSheet.create({
  container: {
    width: 320,
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    ...shadows.modal,
  },

  gradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },

  badge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.base,
  },

  badgeEmoji: {
    fontSize: 40,
  },

  title: {
    ...typography.heading1,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  streakText: {
    ...typography.displayLarge,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  daysLabel: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: spacing.base,
  },

  habitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },

  habitEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },

  habitName: {
    ...typography.heading3,
    color: '#FFFFFF',
  },

  appBranding: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: spacing.lg,
  },
});
