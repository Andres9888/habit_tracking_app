/**
 * PremiumPackCard styles
 */

import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '../../../../theme/typography';

export const s = StyleSheet.create({
  content: { flex: 1 },
  cta: {
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  ctaText: { ...typography.caption, fontWeight: fontWeights.bold },
  desc: {
    ...typography.caption,
    marginTop: spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  emoji: { fontSize: 22 },
  emojiGroup: { flexDirection: 'row', gap: spacing.sm },
  gradient: {
    alignItems: 'center',
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.md,
    marginHorizontal: spacing.base,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
  },
  habitCount: {
    ...typography.caption,
    fontFamily: fontFamilies.monospace,
    marginTop: spacing.xs,
  },
  name: {
    ...typography.body,
    fontWeight: fontWeights.bold,
    marginTop: spacing.sm,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
