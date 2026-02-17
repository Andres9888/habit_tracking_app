/**
 * MonthlyCalendarGrid Colors
 *
 * Stone color palette and color utilities.
 * Use COLORS for light mode, COLORS_DARK for dark mode.
 * Components should use useThemeColors() + isDark to select the correct set.
 */

import { colors } from '../../../theme/colors';
import { darkColors } from '../../../theme/darkColors';

export const COLORS = {
  BORDER: '#e7e5e4',                            // stone-200
  CARD_BG: '#ffffff',                           // pure white card
  TEXT_MUTED: '#d6d3d1',                        // stone-300
  TEXT_PRIMARY: '#1c1917',                      // stone-900
  TEXT_SECONDARY: '#78716c',                    // stone-500
  TEXT_TERTIARY: '#a8a29e',                     // stone-400
  // Green colors for streak calendar — reference theme tokens
  GREEN_COMPLETED: colors.primary[700],         // #047857
  GREEN_COMPLETED_LIGHT: colors.primary[600],   // #059669
  GREEN_EMPTY: colors.primary[100],             // #D1FAE5
};

/**
 * Dark mode color overrides for MonthlyCalendarGrid.
 */
export const COLORS_DARK = {
  BORDER: darkColors.border,                    // #374151
  CARD_BG: darkColors.card,                     // #1F2937
  TEXT_MUTED: darkColors.gray[300],             // #4B5563
  TEXT_PRIMARY: darkColors.text.primary,        // #F9FAFB
  TEXT_SECONDARY: darkColors.text.secondary,    // #9CA3AF
  TEXT_TERTIARY: darkColors.gray[500],          // #9CA3AF
  GREEN_COMPLETED: darkColors.primary[500],     // #34D399
  GREEN_COMPLETED_LIGHT: darkColors.primary[400], // #10B981
  GREEN_EMPTY: darkColors.primary[100],         // #064E3B
};

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
