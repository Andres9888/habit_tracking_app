/**
 * Styles for StatCard component
 */
import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

export const styles = StyleSheet.create({
  skeletonSubtitle: {
    height: 10,
    backgroundColor: colors.border,
    width: 60,
    borderRadius: 4,
  },
  skeletonTitle: {
    backgroundColor: colors.border,
    borderRadius: 4,
    height: 12,
    marginBottom: spacing.xs,
    width: 80,
  },
  skeletonValue: {
    height: 28,
    backgroundColor: colors.border,
    width: 100,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    elevation: 3,
    flex: 1,
    margin: spacing.sm,
    minWidth: '45%',
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statCardEmoji: {
    fontSize: 24,
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
    ...typography.h2,
    color: colors.text.primary,
  },
  statCardValueRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
