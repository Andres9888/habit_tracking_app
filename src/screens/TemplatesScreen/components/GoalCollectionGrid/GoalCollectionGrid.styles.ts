/**
 * Styles for GoalCollectionGrid hero (transformation-first entry point)
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '@/theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

export const s = StyleSheet.create({
  arrow: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: borderRadius.full,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  card: {
    borderColor: 'rgba(0,0,0,0.04)',
    borderRadius: borderRadius.large,
    borderWidth: 1,
    padding: 14,
  },
  cardBottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 10,
  },
  container: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  emoji: { fontSize: 30, lineHeight: 32 },
  emojiFeatured: { fontSize: 42, lineHeight: 44 },
  featuredBadge: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: borderRadius.full,
    fontSize: 9,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 2,
    position: 'absolute',
    right: 12,
    textTransform: 'uppercase',
    top: 12,
  },
  featuredCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'space-between',
    marginBottom: 10,
    minHeight: 116,
  },
  featuredContent: { flex: 1 },
  featuredLabel: {
    fontFamily: fontFamilies.primary.display,
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.2,
    paddingRight: 84,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridCard: { flexBasis: '48%', flexGrow: 1, minHeight: 138 },
  rail: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 16,
    paddingTop: 12,
  },
  railCard: { minHeight: 138, width: 168 },
  label: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 16,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.2,
    marginTop: 6,
  },
  meta: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 11,
    fontWeight: fontWeights.semibold,
    opacity: 0.75,
  },
  promise: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    opacity: 0.85,
  },
  outcome: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.05,
    lineHeight: 16,
    marginTop: 6,
    opacity: 0.92,
  },
});
