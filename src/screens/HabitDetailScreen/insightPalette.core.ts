import { useMemo } from 'react';
import { colors as corePalette, withAlpha } from '../../theme/colors';
import { useThemeColors } from '../../theme/ThemeContext';
import type { SemanticColors } from '../../theme/darkColors';
import { BAND_LOCATIONS, buildBandTokens } from './insightBand';
import { DESIGN_GREEN, LIGHT_INSIGHT_COLORS } from './insightPalette.tokens';
import type { InsightPalette } from './insightPalette.types';

/**
 * Cream foreground used on green fills.
 *
 * Re-exported from the core palette rather than hardcoded: it is exactly
 * `gray.100`, the app's warm parchment.
 */
export const BAND_FG = corePalette.gray[100];

export function buildInsightPalette(
  colors: SemanticColors,
  isDark: boolean
): InsightPalette {
  /**
   * Stays on `DESIGN_GREEN`, not a theme token. Deriving it from `primary.*` has
   * been tried and rejected twice on look; `__tests__/insightPalette.test.ts`
   * guards that. It already clears AA at 4.62:1 on the parchment background, so
   * there is no accessibility argument for overriding the design call either.
   */
  const green = isDark ? colors.primary[500] : DESIGN_GREEN;
  /**
   * Identical value to the prototype's `#E5893B`, now read through the shared
   * `status.recovery` token so other screens can use the same orange. Pure
   * re-sourcing: this renders exactly what it rendered before.
   */
  const amberBar = isDark ? colors.status.streak : colors.status.recovery;

  return {
    ...buildBandTokens(
      colors,
      isDark,
      isDark ? colors.accent : green,
      amberBar
    ),
    amber: isDark ? corePalette.recovery[400] : LIGHT_INSIGHT_COLORS.amber,
    amberBar,
    amberBg: isDark
      ? withAlpha(amberBar, 0.12)
      : colors.status.recoveryLight,
    amberBorder: isDark
      ? withAlpha(amberBar, 0.24)
      : corePalette.recovery[200],
    bandLocations: BAND_LOCATIONS,
    card: isDark ? colors.card : corePalette.light.cardElevated,
    cardBorder: colors.border,
    cellEmpty: isDark
      ? withAlpha(colors.text.primary, 0.1)
      : LIGHT_INSIGHT_COLORS.cellEmpty,
    cellFuture: isDark
      ? withAlpha(colors.text.primary, 0.05)
      : LIGHT_INSIGHT_COLORS.cellFuture,
    ctaGreen: green,
    dialArc: isDark ? amberBar : corePalette.recovery[300],
    divider: withAlpha(colors.border, 0.9),
    green,
    greenSoft: isDark ? withAlpha(green, 0.45) : LIGHT_INSIGHT_COLORS.greenSoft,
    greenTint: isDark ? withAlpha(green, 0.16) : LIGHT_INSIGHT_COLORS.greenTint,
    greenWash: isDark ? withAlpha(green, 0.16) : LIGHT_INSIGHT_COLORS.greenWash,
    missedRing: isDark
      ? withAlpha(colors.text.primary, 0.28)
      : LIGHT_INSIGHT_COLORS.missedRing,
    onGreen: BAND_FG,
    onGreenMuted: isDark
      ? withAlpha(BAND_FG, 0.78)
      : LIGHT_INSIGHT_COLORS.onGreenMuted,
    recoveryInk: isDark
      ? colors.text.primary
      : LIGHT_INSIGHT_COLORS.recoveryInk,
    textPrimary: colors.text.primary,
    textSecondary: colors.text.secondary,
    textTertiary: colors.text.tertiary,
    tileBg: isDark ? withAlpha(green, 0.16) : LIGHT_INSIGHT_COLORS.tileBg,
  };
}

export function useInsightPalette(): InsightPalette {
  const { colors, isDark } = useThemeColors();
  return useMemo(() => buildInsightPalette(colors, isDark), [colors, isDark]);
}
