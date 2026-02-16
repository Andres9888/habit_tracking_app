/**
 * Constants for StreakRecordsAccordion
 */

/** Animation duration for expand/collapse (ms) */
export const ANIMATION_DURATION = 250;

/** Medal configurations */
export const MEDALS = ['🥇', '🥈', '🥉'] as const;

/**
 * Medal color palettes for light and dark modes.
 * Dark mode uses lower-saturation tones for comfortable reading.
 */
export const MEDAL_COLORS_LIGHT = [
  {
    bg: '#fffbeb', // amber-50
    border: '#fde68a', // amber-200
    subtext: '#f59e0b', // amber-500
    text: '#b45309', // amber-700
  },
  {
    bg: '#fafaf9', // stone-50
    border: '#e7e5e4', // stone-200
    subtext: '#78716c', // stone-500
    text: '#44403c', // stone-700
  },
  {
    bg: '#fff7ed', // orange-50
    border: '#fed7aa', // orange-200
    subtext: '#f97316', // orange-500
    text: '#c2410c', // orange-700
  },
] as const;

export const MEDAL_COLORS_DARK = [
  {
    bg: '#422006', // amber-950
    border: '#78350F', // amber-900
    subtext: '#FBBF24', // amber-400
    text: '#FDE68A', // amber-200
  },
  {
    bg: '#1C1917', // stone-900
    border: '#44403C', // stone-700
    subtext: '#A8A29E', // stone-400
    text: '#D6D3D1', // stone-300
  },
  {
    bg: '#431407', // orange-950
    border: '#7C2D12', // orange-900
    subtext: '#FB923C', // orange-400
    text: '#FED7AA', // orange-200
  },
] as const;

/** @deprecated Use MEDAL_COLORS_LIGHT / MEDAL_COLORS_DARK with useThemeColors() */
export const MEDAL_COLORS = MEDAL_COLORS_LIGHT;

export type MedalColor = (typeof MEDAL_COLORS_LIGHT)[number];
