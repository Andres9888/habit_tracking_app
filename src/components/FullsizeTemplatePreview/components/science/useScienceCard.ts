/**
 * useScienceCard — the themed card surface shared by every science block, plus
 * the row divider and section-glyph color, so each block wires theme once.
 */

import { useMemo } from 'react';
import type { ViewStyle } from 'react-native';

import { scienceStyles } from '../../styles/science.styles';
import { useDetailPalette, type DetailPalette } from '../../detailPalette';

interface ScienceCard {
  palette: DetailPalette;
  /** Card surface with padding — for blocks that lay out their own content. */
  card: ViewStyle[];
  /** Card surface with padding removed — for full-bleed row lists. */
  flushCard: ViewStyle[];
  /** Top divider between rows in a flush card. */
  divider: ViewStyle;
  /** Color for the SecLabel leading glyph. */
  glyph: string;
}

export function useScienceCard(): ScienceCard {
  const palette = useDetailPalette();

  return useMemo(() => {
    const surface: ViewStyle = {
      backgroundColor: palette.card,
      borderColor: palette.border,
    };
    return {
      palette,
      card: [scienceStyles.card, surface],
      flushCard: [
        scienceStyles.card,
        surface,
        { overflow: 'hidden', padding: 0 },
      ],
      divider: { borderTopColor: palette.border, borderTopWidth: 1 },
      glyph: palette.textPrimary,
    };
  }, [palette]);
}
