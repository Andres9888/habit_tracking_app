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
 * Get bar color based on performance rate and best/worst status
 */
export function getBarColor(
  rate: number,
  isBest: boolean,
  isWorst: boolean
): string {
  if (isBest) return '#10b981'; // emerald-500
  if (isWorst) return '#fbbf24'; // amber-400
  if (rate >= 70) return '#a8a29e'; // stone-400
  if (rate >= 50) return '#d6d3d1'; // stone-300
  return '#e7e5e4'; // stone-200
}

/**
 * Get day label CSS class based on best/worst status
 */
export function getDayLabelClass(isBest: boolean, isWorst: boolean): string {
  if (isBest) return 'text-emerald-600 font-bold';
  if (isWorst) return 'text-amber-600 font-bold';
  return 'text-stone-500';
}
