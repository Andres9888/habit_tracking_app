/**
 * Science drill-down — "Why it works" credibility card styles: accent bar,
 * gradient header with badge + read-paper pill, and the lead/evidence body.
 *
 * Layout only — colors come from `useDetailPalette()` at the call site.
 */

import { StyleSheet } from 'react-native';

import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const scienceWhyStyles = StyleSheet.create({
  whyCard: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.card,
  },
  whyAccentBar: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4,
    zIndex: 2,
  },
  // Mock lays the badge and Read-paper pill out as one row. Their combined
  // intrinsic width overflows the card on a 375pt screen (and on any screen
  // once Dynamic Type is on), so the row wraps rather than clipping the pill
  // off the card edge.
  whyHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingLeft: spacing.base + 2,
    paddingVertical: 14,
  },
  whyBadge: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    flexShrink: 1,
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 7,
    ...shadows.subtle,
  },
  whyBadgeText: {
    flexShrink: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.bold,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  whyReadBtn: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    flexDirection: 'row',
    flexShrink: 0,
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  whyReadText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.bold,
  },
  whyBody: {
    paddingHorizontal: spacing.base,
    paddingLeft: spacing.base + 2,
    paddingVertical: spacing.base,
  },
  whyOverline: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.bold,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  whyLead: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 17,
    letterSpacing: -0.2,
    lineHeight: 26,
  },
  whyEvidence: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: 20,
    marginTop: spacing.md,
  },
});
