/**
 * MonthlyCalendarGrid Colors
 *
 * Theme-aware color palette for the monthly calendar grid.
 * Replaces the old static COLORS with dynamic light/dark support.
 */

import { lightColors, darkColors } from '@/theme';

export interface MonthlyGridColors {
  BORDER: string;
  CARD_BG: string;
  GREEN_COMPLETED: string;
  GREEN_COMPLETED_LIGHT: string;
  GREEN_EMPTY: string;
  TEXT_MUTED: string;
  TEXT_PRIMARY: string;
  TEXT_SECONDARY: string;
  TEXT_TERTIARY: string;
}

const LIGHT: MonthlyGridColors = {
  BORDER: lightColors.border,
  CARD_BG: lightColors.card,
  GREEN_COMPLETED: lightColors.primary[700],
  GREEN_COMPLETED_LIGHT: lightColors.primary[600],
  GREEN_EMPTY: lightColors.primary[100],
  TEXT_MUTED: lightColors.gray[300],
  TEXT_PRIMARY: lightColors.text.primary,
  TEXT_SECONDARY: lightColors.text.secondary,
  TEXT_TERTIARY: lightColors.text.tertiary,
};

const DARK: MonthlyGridColors = {
  BORDER: darkColors.border,
  CARD_BG: darkColors.card,
  GREEN_COMPLETED: darkColors.primary[500],
  GREEN_COMPLETED_LIGHT: darkColors.primary[400],
  GREEN_EMPTY: darkColors.primary[100],
  TEXT_MUTED: darkColors.gray[300],
  TEXT_PRIMARY: darkColors.text.primary,
  TEXT_SECONDARY: darkColors.text.secondary,
  TEXT_TERTIARY: darkColors.text.tertiary,
};

/** Returns the monthly grid color palette for the given mode. */
export function getMonthlyGridColors(isDark: boolean): MonthlyGridColors {
  return isDark ? DARK : LIGHT;
}

/** Backward-compat alias — light mode defaults */
export const DEFAULT_COLORS: MonthlyGridColors = LIGHT;

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
