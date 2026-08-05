/**
 * Constants for DayBar component
 */

/** Single character day labels */
export const DAY_LABELS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Delay between each bar's animation start (ms) */
export const BAR_STAGGER_DELAY = 50;

/** Bar dimensions per spec */
export const BAR_WIDTH = 20;
export const BAR_MAX_HEIGHT = 40;

/**
 * Get bar color based on performance rate and best/worst status.
 * Accepts theme gray colors to support dark mode.
 */
export function getBarColor(
  rate: number,
  isBest: boolean,
  isWorst: boolean,
  grayColors?: { 200: string; 300: string; 400: string },
  successColor?: string
): string {
  if (isBest) return successColor ?? '#10b981';
  if (isWorst) return '#fbbf24'; // amber-400
  if (rate >= 70) return grayColors?.['400'] ?? '#a8a29e';
  if (rate >= 50) return grayColors?.['300'] ?? '#d6d3d1';
  return grayColors?.['200'] ?? '#e7e5e4';
}

/**
 * Get day label hex color based on best/worst status.
 * Returns a hex color string for use in inline styles.
 */
export function getDayLabelColor(
  isBest: boolean,
  isWorst: boolean,
  secondaryColor?: string,
  successTextColor?: string
): string {
  if (isBest) return successTextColor ?? '#059669';
  if (isWorst) return '#d97706'; // amber-600
  return secondaryColor ?? '#78716c';
}

/**
 * Whether the day label should be bold
 */
export function isDayLabelBold(isBest: boolean, isWorst: boolean): boolean {
  return isBest || isWorst;
}
