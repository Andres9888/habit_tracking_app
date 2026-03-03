/**
 * Theme-aware colors for BinaryHeatmap
 *
 * Provides light/dark mode color palettes mapped to canonical theme tokens.
 * Replaces the old static COLORS object from constants.ts.
 */

import { lightColors, darkColors } from '@/theme';

export interface HeatmapColors {
  CARD_BACKGROUND: string;
  CELL_BEFORE_CREATION: string;
  CELL_EMPTY: string;
  CELL_FUTURE: string;
  TEXT_PRIMARY: string;
  TEXT_SECONDARY: string;
  TEXT_TERTIARY: string;
  TODAY_RING_WIDTH: number;
  TOOLTIP_BACKGROUND: string;
  TOOLTIP_TEXT: string;
}

const LIGHT: HeatmapColors = {
  CARD_BACKGROUND: lightColors.card,
  CELL_BEFORE_CREATION: lightColors.gray[50],
  CELL_EMPTY: lightColors.gray[200],
  CELL_FUTURE: lightColors.gray[100],
  TEXT_PRIMARY: lightColors.text.primary,
  TEXT_SECONDARY: lightColors.text.secondary,
  TEXT_TERTIARY: lightColors.text.tertiary,
  TODAY_RING_WIDTH: 2,
  TOOLTIP_BACKGROUND: darkColors.background,
  TOOLTIP_TEXT: '#ffffff',
};

const DARK: HeatmapColors = {
  CARD_BACKGROUND: darkColors.card,
  CELL_BEFORE_CREATION: darkColors.gray[100],
  CELL_EMPTY: darkColors.gray[200],
  CELL_FUTURE: darkColors.gray[100],
  TEXT_PRIMARY: darkColors.text.primary,
  TEXT_SECONDARY: darkColors.text.secondary,
  TEXT_TERTIARY: darkColors.text.tertiary,
  TODAY_RING_WIDTH: 2,
  TOOLTIP_BACKGROUND: darkColors.background,
  TOOLTIP_TEXT: '#ffffff',
};

/**
 * Returns the heatmap color palette for the given mode.
 *
 * @param isDark - Whether dark mode is active
 * @returns HeatmapColors for the requested mode
 */
export function getHeatmapColors(isDark: boolean): HeatmapColors {
  return isDark ? DARK : LIGHT;
}

/** Backward-compat alias — light mode defaults */
export const DEFAULT_COLORS: HeatmapColors = LIGHT;
