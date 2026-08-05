import { StyleSheet } from 'react-native';
import { airy } from '@/theme/airyScale';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const paywallSheetStyles = StyleSheet.create({
  close: { position: 'absolute', right: spacing.base, top: spacing.base },
  content: { alignItems: 'center' },
  cta: {
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.medium,
    height: 56,
    justifyContent: 'center',
    marginTop: spacing.lg,
    width: '100%',
  },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { ...typography.button, color: colors.text.inverse },
  description: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  emoji: { fontSize: typography.displayLarge.fontSize, textAlign: 'center' },
  headline: {
    ...typography.heading2,
    color: colors.text.primary,
    textAlign: 'center',
  },
  perkEmoji: { fontSize: 20 },
  perkIcon: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  perkLabel: { ...typography.body, color: colors.text.primary, flex: 1 },
  perkRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  perks: { gap: airy.sectionGap, marginTop: spacing.lg, width: '100%' },
  pricing: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
