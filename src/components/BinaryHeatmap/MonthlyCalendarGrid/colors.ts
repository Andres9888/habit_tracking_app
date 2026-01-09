/**
 * MonthlyCalendarGrid Colors
 *
 * Stone color palette and color utilities.
 */

export const COLORS = {
  BORDER: '#e7e5e4',
  CARD_BG: '#ffffff',
  TEXT_MUTED: '#d6d3d1',
  TEXT_PRIMARY: '#1c1917',
  TEXT_SECONDARY: '#78716c',
  TEXT_TERTIARY: '#a8a29e',
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
