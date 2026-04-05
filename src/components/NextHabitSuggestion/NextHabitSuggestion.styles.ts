import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import { borderRadius, shadows } from '@/theme/spacing';
import { fontWeights, typography } from '@/theme/typography';

export const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  badgeText: { ...typography.caption, color: colors.warning, fontWeight: fontWeights.semibold },
  completedContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderRadius: borderRadius.large,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    padding: spacing.lg,
  },
  completedEmoji: { fontSize: 36, marginBottom: spacing.sm },
  completedSubtitle: { ...typography.bodySmall, color: colors.primary[600] },
  completedTitle: {
    ...typography.button,
    color: colors.primary[700],
    marginBottom: 4,
  },
  container: {
    backgroundColor: colors.light.surfaceMuted,
    borderRadius: borderRadius.large,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    overflow: 'hidden',
    ...shadows.card,
  },
  content: { padding: spacing.base },
  glow: {
    backgroundColor: colors.streak[300],
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  habitHint: { ...typography.caption, color: colors.gray[300] },
  habitIcon: { fontSize: 32 },
  habitInfo: { flex: 1 },
  habitName: {
    ...typography.button,
    color: colors.gray[900],
    marginBottom: 2,
  },
  habitRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  progress: { ...typography.caption, color: colors.gray[300] },
});
