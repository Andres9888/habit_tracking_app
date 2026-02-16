/**
 * Styles for StatCard component
 */
import { StyleSheet } from 'react-native';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

export const styles = StyleSheet.create({
  skeletonSubtitle: {
    borderRadius: 4,
    height: 10,
    width: 60,
  },
  skeletonTitle: {
    borderRadius: 4,
    height: 12,
    marginBottom: spacing.xs,
    width: 80,
  },
  skeletonValue: {
    borderRadius: 4,
    height: 28,
    marginBottom: spacing.xs,
    width: 100,
  },
  statCard: {
    borderRadius: 16,
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
    fontSize: 22,
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
  trendRow: {
    marginTop: spacing.xs,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
