/**
 * @module colorUtils
 *
 * Color derivation for habit cards. Handles high-contrast mode,
 * dark mode, icon backgrounds, streak badge colors, and accent fallbacks.
 */

import { darkColors, lightColors } from '../../theme/darkColors';
import { colors } from '../../theme/colors';
import type { CardColors } from './types';

/** Fallback accent when no habit-specific color is set (violet-500). */
const DEFAULT_ACCENT_COLOR = '#8b5cf6';

/**
 * Return the full {@link CardColors} token set based on accessibility mode.
 * High-contrast mode uses a dark background with yellow accents for WCAG AAA.
 * Dark mode uses elevated dark surfaces per the design system.
 */
export function getCardColors(
  highContrastMode: boolean,
  isDark = false
): CardColors {
  if (highContrastMode) {
    return {
      border: '#facc15',
      cardBackground: '#111111',
      iconContainer: '#facc15',
      primaryText: '#ffffff',
      streakText: '#facc15',
      strengthBackground: colors.primary[500],
    };
  }

  if (isDark) {
    return {
      border: darkColors.border,              // #374151
      cardBackground: darkColors.card,        // #1F2937
      iconContainer: undefined,
      primaryText: darkColors.text.primary,   // #F9FAFB
      streakText: '#fb923c',                  // orange-400 (brighter for dark bg)
      strengthBackground: darkColors.primary[400], // #10B981
    };
  }

  return {
    border: '#f5f5f4', // stone-100 - subtle border
    cardBackground: '#ffffff', // Pure white for better contrast against beige bg
    iconContainer: undefined,
    primaryText: lightColors.text.primary, // #2D2A26
    streakText: '#c2410c', // orange-700 for richer streak
    strengthBackground: colors.primary[500], // #10b981
  };
}

/** Map an accent color to a soft pastel background for the icon container. */
export function getIconBackground(
  accentColor: string,
  highContrastMode: boolean,
  iconContainer: string | undefined,
  isDark = false
): string {
  if (highContrastMode) return iconContainer ?? '#facc15';

  if (isDark) {
    // Dark mode: use subtle transparent tints over dark card surface
    const darkColorMap: Record<string, string> = {
      '#0891b2': 'rgba(6, 182, 212, 0.2)',   // cyan
      '#059669': 'rgba(16, 185, 129, 0.2)',  // emerald
      '#7c3aed': 'rgba(124, 58, 237, 0.2)', // violet
      '#2563eb': 'rgba(59, 130, 246, 0.2)', // blue
      '#db2777': 'rgba(236, 72, 153, 0.2)', // pink
      '#ea580c': 'rgba(249, 115, 22, 0.2)', // orange
    };
    return darkColorMap[accentColor] || 'rgba(251, 191, 36, 0.2)'; // yellow default
  }

  const colorMap: Record<string, string> = {
    '#0891b2': 'rgba(207, 250, 254, 0.85)', // cyan-100
    '#059669': 'rgba(209, 250, 229, 0.85)', // emerald-100
    '#7c3aed': 'rgba(237, 233, 254, 0.85)', // violet-100
    '#2563eb': 'rgba(219, 234, 254, 0.85)', // blue-100
    '#db2777': 'rgba(252, 231, 243, 0.85)', // pink-100
    '#ea580c': 'rgba(255, 237, 213, 0.85)', // orange-100
  };
  return colorMap[accentColor] || 'rgba(254, 249, 195, 0.85)'; // yellow-100 default
}

/** Tiered badge colors that intensify as the streak grows (7 → 14 → 30+). */
export function getStreakBadgeColors(streak: number): {
  bg: string;
  glow: string;
} {
  if (streak >= 30) return { bg: '#7c3aed', glow: '#8b5cf6' }; // Purple for 30+
  if (streak >= 14) return { bg: '#ea580c', glow: '#f97316' }; // Orange for 14+
  if (streak >= 7) return { bg: '#dc2626', glow: '#ef4444' };  // Red for 7+
  return { bg: '#c2410c', glow: '#c2410c' };                    // Default orange-700
}

/** Resolve accent color with a fallback to the default violet. */
export function getEffectiveAccentColor(
  accentColor: string | undefined
): string {
  return accentColor || DEFAULT_ACCENT_COLOR;
}

/** Get the left accent border color (yellow in high-contrast, accent otherwise). */
export function getBorderAccentColor(
  highContrastMode: boolean,
  accentColor: string | undefined
): string {
  if (highContrastMode) return '#facc15';
  return getEffectiveAccentColor(accentColor);
}
