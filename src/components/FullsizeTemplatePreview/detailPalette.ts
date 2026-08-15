/**
 * detailPalette — theme-aware palette for the template drill-down
 * (FullsizeTemplatePreview), evolved from the "Habit Detail" Claude Design.
 *
 * Sibling of `screens/TemplatesScreen/browserPalette.ts`: keeps the editorial
 * warm-peach hero + cream cards in light mode while snapping every value to
 * semantic theme tokens, so the drill-down finally supports dark mode.
 *
 * The hero gradient is a FIXED warm peach (not derived from the template's
 * iconColor or category) so catalog → drill-down reads as one surface.
 */

import { useMemo } from 'react';
import { useThemeColors } from '../../theme/ThemeContext';
import type { SemanticColors } from '../../theme/darkColors';
import { buildHabitAddedPalette } from '../HabitAddedPanel/palette';

export interface DetailPalette {
  /** Hero gradient stops, top → bottom. Last stop must equal `body`. */
  heroGradient: readonly [string, string, string];
  /** Locations for the three hero stops. */
  heroLocations: readonly [number, number, number];

  // Surfaces
  body: string;
  card: string;
  border: string;
  iconTile: string;
  chipBg: string;
  chipBorder: string;
  closeBg: string;
  /** Opaque fill for badges/pills that sit on top of a tinted card. */
  raised: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textQuiet: string;

  // Science accents
  green: string;
  greenTint: string;
  greenSoft: string;
  gold: string;
  goldFill: string;

  // Add / added CTA
  addBg: string;
  addFg: string;
  addedBg: string;
  addedFg: string;
  addShadow: string;
}

/** Pure builder, exported for unit tests. */
export function buildDetailPalette(
  colors: SemanticColors,
  isDark: boolean
): DetailPalette {
  const body = colors.background;
  // The add / added CTA colors are shared with the library's post-add toast —
  // one definition, in HabitAddedPanel/palette, so contrast fixes can't drift
  // between the two surfaces that render the same confirmation.
  const added = buildHabitAddedPalette(colors, isDark);

  return {
    // Light: mock's #F6DEC8 → #F3E3D2 → canvas. Dark: the same warm amber wash
    // (browserPalette's `status.streakLight` precedent) but PRE-BLENDED to
    // opaque hex — the header tint, hero stop 0 and the ScrollView overscroll
    // tint all read this value, so an alpha stop would composite three times.
    heroGradient: isDark
      ? ['#362D23', '#1F2025', body]
      : ['#F6DEC8', '#F3E3D2', body],
    heroLocations: [0, 0.62, 1],

    body,
    card: added.card,
    border: added.border,
    iconTile: isDark ? colors.cardPaper : '#FAF7F0',
    chipBg: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(250,247,240,0.75)',
    chipBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.55)',
    closeBg: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(250,247,240,0.7)',
    raised: isDark ? colors.cardPaper : '#FFFFFF',

    textPrimary: colors.text.primary,
    textSecondary: colors.text.secondary,
    textTertiary: colors.text.tertiary,
    textQuiet: isDark ? colors.gray[400] : colors.gray[500],

    green: isDark ? '#4ADE9E' : '#15793C',
    greenTint: isDark ? 'rgba(52,211,153,0.14)' : '#DCF7E4',
    greenSoft: isDark ? 'rgba(52,211,153,0.09)' : '#EAF6EC',
    gold: isDark ? '#F0C462' : '#E8B94D',
    goldFill: isDark ? 'rgba(240,196,98,0.18)' : '#F2E3B8',

    addBg: added.addBg,
    addFg: added.addFg,
    addedBg: added.addedBg,
    addedFg: added.addedFg,
    addShadow: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(21,122,78,0.28)',
  };
}

export function useDetailPalette(): DetailPalette {
  const { colors, isDark } = useThemeColors();
  return useMemo(() => buildDetailPalette(colors, isDark), [colors, isDark]);
}
