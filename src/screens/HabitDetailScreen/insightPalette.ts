/**
 * insightPalette — theme-aware palette for the habit-detail screen
 * ("Habit Flow Prototype" Claude Design, project "Habit insights page redesign").
 *
 * Sibling of `components/FullsizeTemplatePreview/detailPalette.ts` and
 * `screens/TemplatesScreen/browserPalette.ts`: light mode carries the mock's own
 * brand literals, dark mode delegates to semantic tokens so the screen still
 * adapts. Hero wash tokens live in `insightBand.ts`.
 *
 * THE TWO GREEN FIELDS DELIBERATELY HOLD THE SAME VALUE. `src/theme/README.md`
 * says "do not collapse the greens" and `colors/semantic.ts:9-14` separates
 * primary/CTA (#059669) from success (#15793C) — and a previous revision did split
 * them that way. It was rejected on look: the mock's single #0C7C59 is the
 * signed-off green. The fields are kept apart anyway so call sites stay
 * role-correct and re-splitting is a one-line change; do not "fix" this by
 * deleting one of them.
 *
 * The warm accent is likewise the mock's orange (#E5893B), not the app's
 * burnished gold — also tried, also rejected.
 */

import { useMemo } from 'react';
import { colors as corePalette, withAlpha } from '../../theme/colors';
import { useThemeColors } from '../../theme/ThemeContext';
import type { SemanticColors } from '../../theme/darkColors';
import {
  BAND_LOCATIONS,
  buildBandTokens,
  type BandTokens,
} from './insightBand';

export type { BandGradient } from './insightBand';
export { BAND_LOCATIONS } from './insightBand';

/** Deep forest green — accents that need to out-weigh `green`. */
export const BAND_GREEN = '#0B5D42';
/** Cream foreground used on green fills — design #F5F2EA. */
export const BAND_FG = '#F5F1ED';
/** The design's single green, used for both the CTA and success roles. */
const DESIGN_GREEN = '#0C7C59';

export interface InsightPalette extends BandTokens {
  /** Stop positions for the hero wash. */
  bandLocations: readonly [number, number, number];

  card: string;
  cardBorder: string;
  divider: string;

  textPrimary: string;
  textSecondary: string;
  textTertiary: string;

  /** Success green — completed cells, checkmarks, "done" states. */
  green: string;
  /** Primary/CTA green — the complete bar, eyebrows, interactive tints. */
  ctaGreen: string;
  /** Half-strength green — paused/skipped days and weaker bars. */
  greenSoft: string;
  greenTint: string;
  /** Soft wash behind the completed "Done today" confirmation. */
  greenWash: string;
  /** Recovery body ink — warm brown on the amber card only. */
  recoveryInk: string;
  /** Cream ink on a green fill — checkmarks, CTA labels. */
  onGreen: string;
  /** Cream sub-copy inside the green check-in confirmation. */
  onGreenMuted: string;

  /** Strength dial arc while today is still open. */
  dialArc: string;

  /** Amber accent — "what's working" card and the streak stat. */
  amber: string;
  amberBar: string;
  amberBg: string;
  amberBorder: string;

  /** Sage icon-tile fill on History / Analytics / why cards. */
  tileBg: string;

  /** Heatmap + week-dot neutrals. */
  cellEmpty: string;
  cellFuture: string;
  /** Dashed ring on a missed scheduled day. */
  missedRing: string;
}

/** Pure builder, exported for unit tests. */
export function buildInsightPalette(
  colors: SemanticColors,
  isDark: boolean
): InsightPalette {
  const green = isDark ? colors.primary[500] : DESIGN_GREEN;
  const amberBar = isDark ? colors.status.streak : '#E5893B';

  return {
    // Dark stops derive from `accent` (#34D399) rather than primary[600]
    // (#6EE7B7), which goes pastel and washes the band out.
    ...buildBandTokens(colors, isDark, isDark ? colors.accent : green),
    amber: isDark ? '#E5A76B' : '#B0723A',
    amberBar,
    amberBg: isDark ? withAlpha(amberBar, 0.12) : '#FBF0E3',
    amberBorder: isDark ? withAlpha(amberBar, 0.24) : '#F0DFC8',
    bandLocations: BAND_LOCATIONS,
    card: isDark ? colors.card : corePalette.light.cardElevated,
    cardBorder: colors.border,
    cellEmpty: isDark ? withAlpha(colors.text.primary, 0.1) : '#F0EDE4',
    cellFuture: isDark ? withAlpha(colors.text.primary, 0.05) : '#F7F5EF',
    ctaGreen: green,
    dialArc: isDark ? amberBar : '#F5A25B',
    divider: withAlpha(colors.border, 0.9),
    green,
    greenSoft: isDark ? withAlpha(green, 0.45) : '#8FC3AB',
    greenTint: isDark ? withAlpha(green, 0.16) : '#CFE3D8',
    greenWash: isDark ? withAlpha(green, 0.16) : '#E8F2EC',
    missedRing: isDark ? withAlpha(colors.text.primary, 0.28) : '#D6CFC3',
    onGreen: BAND_FG,
    recoveryInk: isDark ? colors.text.primary : '#4C3D28',
    onGreenMuted: isDark ? withAlpha(BAND_FG, 0.78) : '#BFE3D2',
    textPrimary: colors.text.primary,
    textSecondary: colors.text.secondary,
    textTertiary: colors.text.tertiary,
    tileBg: isDark ? withAlpha(green, 0.16) : '#EAF1EC',
  };
}

export function useInsightPalette(): InsightPalette {
  const { colors, isDark } = useThemeColors();
  return useMemo(() => buildInsightPalette(colors, isDark), [colors, isDark]);
}
