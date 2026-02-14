/**
 * Styles for StatCard component
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

export const styles = StyleSheet.create({
  skeletonSubtitle: {
    backgroundColor: colors.border,
    borderRadius: 4,
    height: 10,
    width: 60,
  },
  skeletonTitle: {
    backgroundColor: colors.border,
    borderRadius: 4,
    height: 12,
    marginBottom: spacing.xs,
    width: 80,
  },
  skeletonValue: {
    backgroundColor: colors.border,
    borderRadius: 4,
    height: 28,
    marginBottom: spacing.xs,
    width: 100,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    elevation: 3,
    flex: 1,
    margin: spacing.sm,
    minWidth: '45%',
    padding: spacing.lg,
    shadowColor: '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  statCardEmoji: {
    ...typography.heading2,
    marginRight: spacing.xs,
  },
  statCardLoading: {
    height: 80,
  },
  statCardSubtitle: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  statCardTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statCardValue: {
    ...typography.heading2,
    color: colors.text.primary,
  },
  statCardValueRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
