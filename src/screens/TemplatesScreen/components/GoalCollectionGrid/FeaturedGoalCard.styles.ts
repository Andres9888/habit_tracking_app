/**
 * Styles for FeaturedGoalCard hero (transformation hero card).
 */

import { StyleSheet } from 'react-native';
import { fontFamilies, fontWeights } from '@/theme/typography';

export const hero = StyleSheet.create({
  badge: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 9999,
    fontSize: 9,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 2,
    textTransform: 'uppercase',
  },
  body: { flexDirection: 'row', gap: 14, marginTop: 14 },
  cta: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 9999,
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ctaCount: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 11,
    fontWeight: fontWeights.semibold,
    opacity: 0.85,
  },
  ctaPrimary: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.1,
  },
  emoji: { fontSize: 60, lineHeight: 64 },
  gradient: { borderRadius: 18, overflow: 'hidden', padding: 18 },
  outcome: {
    alignSelf: 'flex-start',
    borderRadius: 9999,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  outcomeText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 11,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.1,
  },
  label: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 24,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.3,
  },
  promise: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    lineHeight: 19,
    marginTop: 4,
    opacity: 0.92,
  },
  text: { flex: 1, paddingTop: 4 },
  topRow: { alignItems: 'flex-start', flexDirection: 'row' },
  wrapper: {
    alignItems: 'stretch',
    flexDirection: 'column',
    gap: 0,
    justifyContent: 'flex-start',
    minHeight: 0,
    padding: 0,
  },
});
