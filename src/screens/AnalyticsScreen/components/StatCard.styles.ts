/**
 * Styles for StatCard component
 */
import { StyleSheet } from 'react-native';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';

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
    borderRadius: borderRadius.card,
    elevation: 3,
    flex: 1,
    margin: spacing.sm,
    minWidth: '45%',
    padding: spacing.lg,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
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
