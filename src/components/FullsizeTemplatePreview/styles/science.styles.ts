/**
 * Science drill-down — shared primitives: the block stack, section label,
 * and the neutral card used by most blocks.
 *
 * Layout only — colors come from `useDetailPalette()` at the call site.
 */

import { StyleSheet } from 'react-native';

import { shadows, spacing } from '../../../theme/spacing';
import { airy } from '../../../theme/airyScale';
import { fontFamilies, fontWeights } from '@/theme/typography';

export const scienceStyles = StyleSheet.create({
  stack: {
    gap: spacing.lg,
    paddingBottom: 24,
    paddingHorizontal: 20,
    // Consumers sit under DescriptionSection / evidenceBreak — not a second seam.
    paddingTop: 0,
  },
  secLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    // 12 vs card padding 16 → ~2:1 label-to-card vs card-to-card proximity.
    marginBottom: 12,
  },
  secLabelText: {
    fontFamily: fontFamilies.primary.text,
    // Match typography.heading3 so section titles read as headings, not body.
    fontSize: 20,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.2,
  },
  card: {
    // airy.cardRadius (24) — same token as sibling drill-down cards.
    borderRadius: airy.cardRadius,
    borderWidth: 1,
    padding: spacing.base,
    // Warm-paper contrast dissolves the default 0.06 card shadow; cardLifted
    // is the theme's documented remedy (surfaces.ts / spacing.ts).
    ...shadows.cardLifted,
  },
  // Separates decision blocks from credibility — only when science content exists.
  // 20 + rule/overline ≈ 44px seam vs stack gap 24 — clear break without dwarfing.
  evidenceBreak: {
    gap: 12,
    paddingBottom: 16,
    paddingTop: 20,
  },
  evidenceRule: {
    height: 1,
    width: '100%',
  },
  evidenceOverline: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 12,
    fontWeight: fontWeights.bold,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
});
