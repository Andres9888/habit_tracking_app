/**
 * MonthlyCalendarGrid Colors
 *
 * Stone color palette and color utilities.
 */

import { colors } from '@/theme/colors';

export const COLORS = {
  BORDER: colors.gray[200],
  CARD_BG: '#ffffff',
  TEXT_MUTED: colors.gray[300],
  TEXT_PRIMARY: colors.gray[900],
  TEXT_SECONDARY: colors.gray[500],
  TEXT_TERTIARY: colors.gray[400],
  GREEN_COMPLETED: colors.primary[700],
  GREEN_COMPLETED_LIGHT: colors.primary[600],
  GREEN_EMPTY: colors.primary[100],
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
