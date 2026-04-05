import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { shadows, borderRadius, componentSpacing, spacing } from '@/theme/spacing';
import { fontWeights, typography } from '@/theme/typography';

export const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: fontWeights.semibold,
  },
  container: {
    ...shadows.card,
    backgroundColor: colors.text.inverse,
    borderRadius: borderRadius.large,
    marginHorizontal: componentSpacing.card.marginHorizontal,
    marginVertical: componentSpacing.card.marginVertical,
    overflow: 'hidden',
  },
  content: {
    padding: componentSpacing.card.padding,
  },
  completedContainer: {
    marginHorizontal: componentSpacing.card.marginHorizontal,
    borderRadius: borderRadius.large,
    marginVertical: componentSpacing.card.marginVertical,
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.primary[100],
  },
  glow: {
    backgroundColor: colors.streak[300],
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  completedEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  habitHint: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  completedSubtitle: {
    ...typography.caption,
    color: colors.primary[600],
  },
  habitIcon: {
    fontSize: 32,
  },
  completedTitle: {
    ...typography.button,
    color: colors.primary[700],
    marginBottom: 4,
  },
  habitRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  habitInfo: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitName: {
    ...typography.button,
    color: colors.gray[900],
    marginBottom: 2,
  },
  progress: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
