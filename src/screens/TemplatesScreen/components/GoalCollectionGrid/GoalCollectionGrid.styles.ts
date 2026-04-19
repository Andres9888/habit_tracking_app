/**
 * Styles for GoalCollectionGrid hero (transformation-first entry point)
 */

import { StyleSheet } from 'react-native';
import { fontFamilies, fontWeights } from '@/theme/typography';

export const s = StyleSheet.create({
  arrow: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 9999,
    fontSize: 13,
    fontWeight: fontWeights.bold,
    height: 24,
    lineHeight: 24,
    textAlign: 'center',
    width: 24,
  },
  arrowFeatured: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    fontSize: 16,
    height: 32,
    lineHeight: 32,
    width: 32,
  },
  card: {
    borderColor: 'rgba(0,0,0,0.04)',
    borderRadius: 16,
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
    borderRadius: 9999,
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
    fontSize: 17,
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
});
