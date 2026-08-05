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

  // Add / added toggle — tonal pair, Add reads stronger than Added
  addBg: string;
  addFg: string;
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
    closeBg: isDark ? colors.gray[200] : colors.card,
    iconTile: isDark ? colors.status.streakLight : '#F8E9CE',

    textPrimary: colors.text.primary,
    textSecondary: colors.text.secondary,
    textTertiary: colors.text.tertiary,
    textInverse: colors.text.inverse,

    chipIdle: isDark ? colors.card : colors.gray[50],
    chipActive: colors.gray[900],

    addBg: isDark ? 'rgba(52,211,153,0.20)' : '#C4EBD9',
    addFg: isDark ? '#4ADE9E' : '#04724D',
    addedBg: isDark ? 'rgba(52,211,153,0.09)' : '#E4F7EE',
    addedFg: isDark ? '#4E9B7E' : '#16A374',
  };
}

export function useBrowserPalette(): BrowserPalette {
  const { colors, isDark } = useThemeColors();
  return useMemo(() => buildBrowserPalette(colors, isDark), [colors, isDark]);
}
