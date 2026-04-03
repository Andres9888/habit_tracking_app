import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import { borderRadius, shadows } from '@/theme/spacing';
import { fontFamilies, fontWeights } from '@/theme/typography';

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
  badgeText: { color: colors.warning, fontFamily: fontFamilies.primary.text, fontSize: 13, fontWeight: fontWeights.semibold },
  completedContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderRadius: borderRadius.large,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    padding: spacing.lg,
  },
  completedEmoji: { fontSize: 36, marginBottom: spacing.sm },
  completedSubtitle: { color: colors.primary[600], fontFamily: fontFamilies.primary.text, fontSize: 14 },
  completedTitle: {
    color: colors.primary[700],
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.semibold,
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
  habitHint: { color: colors.gray[300], fontFamily: fontFamilies.primary.text, fontSize: 13 },
  habitIcon: { fontSize: 32 },
  habitInfo: { flex: 1 },
  habitName: {
    color: colors.gray[900],
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: fontWeights.semibold,
    marginBottom: 2,
  },
  habitRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  progress: { color: colors.gray[300], fontFamily: fontFamilies.primary.text, fontSize: 13, fontWeight: fontWeights.medium },
});
