import { StyleSheet } from 'react-native';
import { shadows, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1.5,
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    overflow: 'hidden',
    ...shadows.card,
  },
  cta: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  ctaText: {
    ...typography.bodySmall,
    color: '#FFFFFF',
    fontWeight: fontWeights.bold,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    paddingBottom: 13,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  footerNote: {
    ...typography.caption,
    color: '#6E6660',
    flex: 1,
    lineHeight: 16,
  },
  head: { paddingBottom: 4, paddingHorizontal: 14, paddingTop: 13 },
  insight: {
    fontFamily: 'Literata',
    fontSize: 17.5,
    fontWeight: fontWeights.semibold,
    lineHeight: 23,
    marginTop: 4,
  },
  overline: {
    ...typography.overline,
    color: '#1E3A5F',
    fontSize: 10.5,
    letterSpacing: 1,
  },
  why: {
    ...typography.caption,
    color: '#6B6560',
    lineHeight: 17,
    marginTop: 3,
  },
});
