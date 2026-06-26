/**
 * KeyFacts decision band styles (SPEC_01) — a white, bordered row of equal
 * cells: a JetBrains Mono numeral + unit over a small caption label, with a
 * 1px divider between cells.
 */

import { StyleSheet } from 'react-native';

import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

export const keyFactsStyles = StyleSheet.create({
  band: {
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    overflow: 'hidden',
    ...shadows.card,
  },
  cell: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 13,
  },
  valueRow: { alignItems: 'baseline', flexDirection: 'row', gap: 2 },
  value: {
    fontFamily: fontFamilies.monospace,
    fontSize: 18,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.5,
  },
  unit: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.bold,
  },
  label: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 11,
    fontWeight: fontWeights.medium,
    lineHeight: 13,
    textAlign: 'center',
  },
});
