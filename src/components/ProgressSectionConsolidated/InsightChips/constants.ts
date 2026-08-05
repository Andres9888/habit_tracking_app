/**
 * InsightChips Constants
 *
 * Animation timing and color configuration
 */

/** Stagger delay between chip entrance animations (ms) */
export const CHIP_STAGGER_DELAY = 50;

/** Duration of chip entrance animation (ms) */
export const CHIP_ENTRANCE_DURATION = 300;

/** Pulse animation cycle duration (ms) */
export const PULSE_DURATION = 2000;

/** Border color mapping - defined at module level to avoid recreation */
export const BORDER_COLOR_MAP: Record<string, string> = {
  'amber-200': '#fde68a',
  'success-200': '#a7f3d0',
  'orange-200': '#fed7aa',
  'violet-200': '#ddd6fe',
};
