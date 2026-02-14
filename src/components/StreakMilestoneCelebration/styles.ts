/**
 * Styles for StreakMilestoneCelebration component
 */

import { StyleSheet } from 'react-native';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';

export { achievementCardStyles } from './achievementCardStyles';

export const styles = StyleSheet.create({
  actionsContainer: { gap: spacing.md, width: '100%' },
  card: {
    alignItems: 'center',
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.large,
    maxWidth: 340,
    ...shadows.alert,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  emoji: { fontSize: 48 },
  emojiBadge: {
    alignItems: 'center',
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    width: 100,
    ...shadows.floatingActionButton,
  },
  habitEmoji: { fontSize: 24, marginRight: spacing.sm },
  habitName: { ...typography.heading3, color: colors.text.primary },
  habitRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  modalContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.medium,
    paddingVertical: spacing.base,
    ...shadows.card,
  },
  primaryButtonText: { ...typography.button, color: '#FFFFFF' },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: colors.gray[300],
    borderRadius: borderRadius.medium,
    borderWidth: 1.5,
    paddingVertical: spacing.base,
  },
  secondaryButtonText: { ...typography.button, color: colors.text.secondary },
  streakBadge: {
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  streakCount: {
    ...typography.displayLarge,
    fontWeight: '700',
    marginRight: spacing.xs,
  },
  streakLabel: { ...typography.body, color: colors.text.secondary },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.base,
    textAlign: 'center',
  },
  title: {
    ...typography.heading2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
