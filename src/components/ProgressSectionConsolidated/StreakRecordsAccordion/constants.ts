/**
 * Constants for StreakRecordsAccordion
 */

/** Animation duration for expand/collapse (ms) */
export const ANIMATION_DURATION = 250;

/** Medal configurations */
export const MEDALS = ['🥇', '🥈', '🥉'] as const;

export const MEDAL_COLORS = [
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

export type MedalColor = (typeof MEDAL_COLORS)[number];
