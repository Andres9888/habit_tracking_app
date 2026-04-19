/**
 * FeaturedCollection Hero Card Styles
 */

import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export const s = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    ...typography.tabBar,
    color: colors.text.inverse,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chipText: { color: colors.text.inverse, fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  circleOne: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 9999,
    height: 180,
    position: 'absolute',
    right: -40,
    top: -40,
    width: 180,
  },
  circleTwo: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 9999,
    bottom: -60,
    height: 200,
    left: -30,
    position: 'absolute',
    width: 200,
  },
  cta: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: borderRadius.button,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  ctaText: { ...typography.bodySmall, color: colors.text.inverse, fontWeight: fontWeights.bold },
  description: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  gradient: {
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    padding: spacing.lg,
  },
  pressable: {
    marginHorizontal: spacing.base,
    ...shadows.floatingActionButton,
  },
  title: {
    ...typography.heading2,
    color: colors.text.inverse,
    letterSpacing: -0.5,
    marginTop: 12,
  },
  habitCount: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
});
