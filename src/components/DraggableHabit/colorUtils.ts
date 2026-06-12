/**
 * @module colorUtils
 *
 * Color derivation for habit cards. Handles icon backgrounds,
 * streak badge colors, and accent fallbacks.
 */

import type { CardColors } from './types';

/** Fallback accent when no habit-specific color is set (violet-500). */
const DEFAULT_ACCENT_COLOR = '#8b5cf6';

/** Return the full {@link CardColors} token set. */
export function getCardColors(): CardColors {
  return {
    border: '#f5f5f4', // stone-100 - subtle border
    cardBackground: '#ffffff', // Pure white for better contrast against beige bg
    iconContainer: undefined,
    primaryText: '#1c1917', // stone-900
    streakText: '#c2410c', // orange-700 for richer streak
    strengthBackground: '#10b981',
  };
}

/** Map an accent color to a soft pastel background for the icon container. */
export function getIconBackground(accentColor: string): string {
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
  if (streak >= 7) return { bg: '#dc2626', glow: '#ef4444' }; // Red for 7+
  return { bg: '#c2410c', glow: '#c2410c' }; // Default orange-700
}

/** Resolve accent color with a fallback to the default violet. */
export function getEffectiveAccentColor(
  accentColor: string | undefined
): string {
  return accentColor || DEFAULT_ACCENT_COLOR;
}

/** Get the left accent border color from the habit accent. */
export function getBorderAccentColor(accentColor: string | undefined): string {
  return getEffectiveAccentColor(accentColor);
}
