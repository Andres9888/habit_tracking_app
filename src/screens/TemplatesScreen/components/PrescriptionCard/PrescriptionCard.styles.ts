import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.large,
    borderWidth: 1.5,
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    overflow: 'hidden',
    ...shadows.card,
  },
  cta: {
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm + 3,
  },
  ctaText: {
    ...typography.bodySmall,
    fontWeight: fontWeights.bold,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    paddingBottom: spacing.sm + 5,
    paddingHorizontal: spacing.sm + 6,
    paddingTop: spacing.md,
  },
  footerNote: {
    ...typography.caption,
    flex: 1,
    lineHeight: 16,
  },
  head: {
    paddingBottom: spacing.xs,
    paddingHorizontal: spacing.sm + 6,
    paddingTop: spacing.sm + 5,
  },
  insight: {
    fontFamily: 'Literata',
    fontSize: 17.5,
    fontWeight: fontWeights.semibold,
    lineHeight: 23,
    marginTop: spacing.xs,
  },
  overline: {
    ...typography.overline,
  },
  why: {
    ...typography.caption,
    lineHeight: 17,
    marginTop: 3,
  },
});
