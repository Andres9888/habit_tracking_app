/**
 * Science drill-down accent + gradient wash.
 *
 * One trust-green token set (the mock shows one consistent green regardless of
 * template category), now sourced from `detailPalette` so it adapts to dark
 * mode alongside the rest of the drill-down.
 */

import { useMemo } from 'react';
import { useDetailPalette } from '../../detailPalette';

export interface ScienceTheme {
  accent: string;
  gradientStart: string;
  gradientEnd: string;
}

export function useScienceTheme(): ScienceTheme {
  const palette = useDetailPalette();
  return useMemo(
    () => ({
      accent: palette.green,
      gradientStart: palette.greenTint,
      gradientEnd: palette.greenSoft,
    }),
    [palette]
  );
}
