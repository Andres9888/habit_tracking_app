/**
 * HabitInsightsCard Styles
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  title: {
    ...typography.heading3,
    color: colors.text.primary,
  },
  scoreBadge: {
    backgroundColor: colors.primary[100],
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  scoreText: {
    ...typography.caption,
    color: colors.primary[700],
    fontWeight: '600',
  },
  scrollContent: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  progressContainer: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  progressIconContainer: {
    backgroundColor: colors.primary[50],
    borderRadius: 40,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  progressTitle: {
    ...typography.heading3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  progressMessage: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  progressBar: {
    backgroundColor: colors.neutral[200],
    borderRadius: 8,
    height: 8,
    marginBottom: spacing.sm,
    width: '100%',
  },
  progressFill: {
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    height: '100%',
  },
  progressLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  generatedText: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.md,
  },
});
