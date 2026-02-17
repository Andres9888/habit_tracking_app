/**
 * LeaderboardScreen Styles
 * Following design system: 34/22/17/13 typography, 16px border radius, animations
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.heading1,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  badgeCard: {
    backgroundColor: colors.primary[100],
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary[300],
    ...shadows.floatingActionButton,
  },
  badgeIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  badgeTitle: {
    ...typography.heading2,
    color: colors.primary[700],
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  badgeSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  statValue: {
    ...typography.heading3,
    color: colors.text.primary,
  },
  statValueHighlight: {
    ...typography.heading3,
    color: colors.primary[600],
    fontWeight: '700',
  },
  recordCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.base,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
    ...shadows.card,
  },
  recordTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  recordHabitName: {
    ...typography.heading3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  recordValue: {
    ...typography.body,
    color: colors.primary[600],
    fontWeight: '600',
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  streakBadge: {
    backgroundColor: colors.primary[100],
    borderRadius: borderRadius.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  streakBadgeText: {
    ...typography.caption,
    color: colors.primary[700],
    fontWeight: '600',
  },
});
