/**
 * Styles for StatCard component
 */
import { StyleSheet } from 'react-native';
import { typography } from '../../../theme/typography';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';

export const styles = StyleSheet.create({
  skeletonSubtitle: {
    borderRadius: borderRadius.xs,
    height: 10,
    width: 60,
  },
  skeletonTitle: {
    borderRadius: borderRadius.xs,
    height: 12,
    marginBottom: spacing.xs,
    width: 80,
  },
  skeletonValue: {
    borderRadius: borderRadius.xs,
    height: 28,
    marginBottom: spacing.xs,
    width: 100,
  },
  statCard: {
    ...shadows.card,
    borderRadius: borderRadius.card,
    flex: 1,
    margin: spacing.sm,
    minWidth: '45%',
    padding: spacing.lg,
  },
  statCardEmoji: {
    fontSize: typography.heading1.fontSize,
    marginRight: spacing.xs,
  },
  statCardLoading: {
    height: 80,
  },
  statCardSubtitle: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
  },
  statCardTitle: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  statCardValue: {
    ...typography.heading2,
  },
  statCardValueRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
