import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  chip: {
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chipSection: {
    gap: spacing.sm,
    marginTop: spacing.base,
  },
  chipSectionLabel: {
    ...typography.caption,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  chipText: {
    ...typography.bodySmall,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    padding: spacing.base,
    paddingTop: spacing.lg,
  },
  cta: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  ctaRow: {
    gap: spacing.sm,
  },
  ctaText: {
    ...typography.body,
    fontWeight: '600',
  },
  heroCircle: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: borderRadius.full,
    height: 72,
    justifyContent: 'center',
    marginBottom: spacing.base,
    width: 72,
  },
  heroEmoji: {
    fontSize: 36,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  heroSubtitle: {
    ...typography.body,
    marginTop: spacing.sm,
    maxWidth: 280,
    textAlign: 'center',
  },
  heroTitle: {
    ...typography.displayLarge,
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
  },
  input: {
    ...typography.body,
    flex: 1,
  },
  inputRow: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  spacer: {
    flex: 1,
  },
});
