/**
 * MonthlyCalendarGrid Colors
 *
 * Stone color palette and color utilities.
 */

import type { SemanticColors } from '../../../theme/darkColors';

export const COLORS = {
  BORDER: '#e7e5e4',
  CARD_BG: '#ffffff',
  TEXT_MUTED: '#d6d3d1',
  TEXT_PRIMARY: '#1c1917',
  TEXT_SECONDARY: '#78716c',
  TEXT_TERTIARY: '#a8a29e',
  // Green colors for streak calendar
  GREEN_COMPLETED: '#047857', // primary green
  GREEN_COMPLETED_LIGHT: '#059669', // button green
  GREEN_EMPTY: '#d1fae5', // empty circle for missed days
};

/** Theme-aware color overrides — use in components with useThemeColors() */
export function themedCalendarColors(colors: SemanticColors) {
  return {
    ...COLORS,
    BORDER: colors.border,
    CARD_BG: colors.card,
    TEXT_MUTED: colors.gray[300],
    TEXT_PRIMARY: colors.text.primary,
    TEXT_SECONDARY: colors.text.secondary,
    TEXT_TERTIARY: colors.text.tertiary,
    GREEN_COMPLETED: colors.primary[700],
    GREEN_COMPLETED_LIGHT: colors.primary[600],
    GREEN_EMPTY: colors.primary[100],
  };
}

/**
 * Converts hex color to rgba with alpha
 */
export function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(16, 185, 129, ${alpha})`; // fallback emerald
  const r = Number.parseInt(result[1], 16);
  const g = Number.parseInt(result[2], 16);
  const b = Number.parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
