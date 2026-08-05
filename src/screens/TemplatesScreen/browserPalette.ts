/**
 * browserPalette — theme-aware palette for the Habit Browser (Templates
 * library) screen, evolved from the "Habit Browser Final" Claude Design.
 *
 * Keeps the editorial look (light cards on warm bg, ink chips, amber icon
 * tiles) while snapping every value to the app's semantic theme tokens, so
 * the screen adapts to dark mode like the rest of the app.
 */

import { useMemo } from 'react';
import { useThemeColors } from '../../theme/ThemeContext';
import type { SemanticColors } from '../../theme/darkColors';

export interface BrowserPalette {
  // Surfaces
  background: string;
  card: string;
  border: string;
  detailsFill: string;
  startSmallBg: string;
  metaPillBg: string;
  closeBg: string;
  iconTile: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Chips
  chipIdle: string;
  chipActive: string;

  // Add / added toggle
  addBg: string;
  addedBg: string;
  addedFg: string;
}

/**
 * Pure builder, exported for unit tests.
 *
 * `textSecondary` must stay a 6-digit hex in both modes — it's used with an
 * alpha-suffix (e.g. `${textSecondary}30`) in TemplateReadRowHeader.
 */
export function buildBrowserPalette(
  colors: SemanticColors,
  isDark: boolean
): BrowserPalette {
  return {
    background: colors.background,
    card: isDark ? colors.card : colors.cardPaper,
    border: colors.border,
    detailsFill: isDark ? colors.gray[200] : '#FFFFFF',
    startSmallBg: isDark ? colors.background : colors.card,
    metaPillBg: isDark ? colors.background : colors.card,
    closeBg: isDark ? colors.gray[200] : colors.card,
    iconTile: isDark ? colors.status.streakLight : '#F8E9CE',

    textPrimary: colors.text.primary,
    textSecondary: colors.text.secondary,
    textTertiary: colors.text.tertiary,
    textInverse: colors.text.inverse,

    chipIdle: isDark ? colors.card : colors.gray[50],
    chipActive: colors.gray[900],

    addBg: colors.accent,
    addedBg: colors.status.successLight,
    addedFg: colors.status.successText,
  };
}

export function useBrowserPalette(): BrowserPalette {
  const { colors, isDark } = useThemeColors();
  return useMemo(() => buildBrowserPalette(colors, isDark), [colors, isDark]);
}
