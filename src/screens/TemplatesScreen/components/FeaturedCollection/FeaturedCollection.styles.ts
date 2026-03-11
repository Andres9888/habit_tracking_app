/**
 * FeaturedCollection Hero Card Styles
 */

import { StyleSheet } from 'react-native';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontFamilies } from '../../../../theme/typography';

export const s = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipText: { color: '#FFFFFF', fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  circleOne: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 90,
    height: 180,
    position: 'absolute',
    right: -40,
    top: -40,
    width: 180,
  },
  circleTwo: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 100,
    bottom: -60,
    height: 200,
    left: -30,
    position: 'absolute',
    width: 200,
  },
  cta: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  ctaText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
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
    color: '#FFFFFF',
    fontFamily: fontFamilies.primary.display,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 12,
  },
  userCount: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
});
