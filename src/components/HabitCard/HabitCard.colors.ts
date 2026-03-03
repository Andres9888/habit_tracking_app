/**
 * HabitCard Color Constants
 * Theme-aware color palette for HabitCard components.
 *
 * Dynamic colors (cardBg, cardSurface, dominant) adapt to light/dark mode
 * via the semantic palette. Static palette values remain constant.
 */

import { colors } from '../../theme/colors';
import { darkColors, lightColors } from '../../theme/darkColors';

/**
 * Get theme-aware redesign colors based on dark mode state.
 */
export function getRedesignColors(isDark: boolean) {
  const palette = isDark ? darkColors : lightColors;
  return {
    accent: colors.primary[500],
    accentMuted: colors.primary[100],
    cardBg: palette.gray[50],
    cardSurface: palette.card,
    dominant: palette.background,
    metaText: colors.gray[500],
    neutral: colors.gray[200],
    secondaryText: colors.text.primary,
    streakText: colors.primary[700],
  } as const;
}

/** Backward-compatible static export (light mode defaults) */
export const REDESIGN_COLORS = getRedesignColors(false);
