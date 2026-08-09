/**
 * Science drill-down — shared primitives: the block stack, section label,
 * and the neutral card used by most blocks.
 *
 * Layout only — colors come from `useDetailPalette()` at the call site.
 */

import { StyleSheet } from 'react-native';

import { shadows, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights } from '@/theme/typography';

export const scienceStyles = StyleSheet.create({
  stack: {
    gap: spacing.lg,
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: spacing.sm,
  },
  secLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    marginBottom: 16,
  },
  secLabelText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 18,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.2,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: spacing.base,
    // Warm-paper contrast dissolves the default 0.06 card shadow; cardLifted
    // is the theme's documented remedy (surfaces.ts / spacing.ts).
    ...shadows.cardLifted,
  },
  // Separates decision blocks from credibility — only when science content exists.
  evidenceBreak: {
    gap: 12,
    paddingBottom: 16,
    paddingTop: 36,
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
