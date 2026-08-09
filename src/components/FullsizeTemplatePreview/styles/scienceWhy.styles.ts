/**
 * Science drill-down — "Why it works" credibility card styles: accent bar,
 * gradient header with read-paper pill, and the lead/evidence body.
 *
 * Layout only — colors come from `useDetailPalette()` at the call site.
 */

import { StyleSheet } from 'react-native';

import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { airy } from '../../../theme/airyScale';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const scienceWhyStyles = StyleSheet.create({
  whyCard: {
    // airy.cardRadius (24) — same token as science card + start-small panel.
    borderRadius: airy.cardRadius,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    // Warm-paper contrast dissolves the default 0.06 card shadow; cardLifted
    // is the theme's documented remedy (surfaces.ts / spacing.ts).
    ...shadows.cardLifted,
  },
  whyAccentBar: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4,
    zIndex: 2,
  },
  // Pill-only header (badge removed — claim already on hero chip + overline).
  whyHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.base,
    paddingLeft: spacing.base + 2,
    paddingVertical: 14,
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
