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
    borderRadius: borderRadius.card,
    borderWidth: 1,
    flex: 1,
    margin: spacing.sm,
    minWidth: '45%',
    padding: spacing.lg,
    // Paper fill sits close to the canvas, so the card needs the deeper lift
    // (and a hairline border) to read as an object. Matches Settings.
    ...shadows.cardLifted,
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
