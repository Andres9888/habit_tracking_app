/**
 * FeaturedCollection Hero Card Styles
 *
 * This card always renders on a green gradient, so overlay text
 * is white regardless of light/dark theme.
 */

import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

/** Text/overlay colors for elements rendered on the gradient hero card */
const HERO = {
  bg20: 'rgba(255,255,255,0.20)',
  bg25: 'rgba(255,255,255,0.25)',
  circle05: 'rgba(255,255,255,0.05)',
  circle08: 'rgba(255,255,255,0.08)',
  chip18: 'rgba(255,255,255,0.18)',
  text: '#FFFFFF',
  text85: 'rgba(255,255,255,0.85)',
  text70: 'rgba(255,255,255,0.70)',
} as const;

export { HERO };

export const s = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: HERO.bg20,
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    ...typography.tabBar,
    color: HERO.text,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
  },
  chip: {
    backgroundColor: HERO.chip18,
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chipText: { color: HERO.text, fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  circleOne: {
    backgroundColor: HERO.circle08,
    borderRadius: 9999,
    height: 180,
    position: 'absolute',
    right: -40,
    top: -40,
    width: 180,
  },
  circleTwo: {
    backgroundColor: HERO.circle05,
    borderRadius: 9999,
    bottom: -60,
    height: 200,
    left: -30,
    position: 'absolute',
    width: 200,
  },
  cta: {
    alignItems: 'center',
    backgroundColor: HERO.bg25,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  ctaText: { ...typography.bodySmall, color: HERO.text, fontWeight: fontWeights.bold },
  description: { color: HERO.text85, fontSize: 14, marginTop: 4 },
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
    color: HERO.text,
    letterSpacing: -0.5,
    marginTop: 12,
  },
  habitCount: { color: HERO.text70, fontSize: 13 },
});
