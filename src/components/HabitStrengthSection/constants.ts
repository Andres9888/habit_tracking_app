/**
 * Habit Strength Section - Constants
 *
 * Sizing, colors, and animation configuration values for the
 * HabitStrengthSection component and its sub-components.
 */

import type { StrengthLabel } from '../HabitStrengthHistory/types';
export {
  COLORS,
  getStrengthColors,
  getThemeColors,
  STRENGTH_COLORS,
  type StrengthColorSet,
} from './strengthColors';

// ============================================================================
// Layout & Sizing
// ============================================================================

/** Circular progress ring dimensions — hero-sized so strength reads as a moment of pride */
export const RING_SIZE = 128;
export const RING_STROKE_WIDTH = 9;
export const RING_RADIUS = (RING_SIZE - RING_STROKE_WIDTH) / 2;
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
/** Usable inner width for centered text inside the ring (subtracting stroke on both sides) */
export const RING_INNER_WIDTH = RING_SIZE - RING_STROKE_WIDTH * 2;
/** Horizontal padding so percentage text never touches the inner stroke */
export const RING_CENTER_TEXT_WIDTH = RING_INNER_WIDTH - 12;
/** Level emoji sits in the ring gap at 12 o'clock */
export const RING_EMOJI_FONT_SIZE = 22;

/** Chart dimensions (compact for above-fold layout) */
export const CHART_HEIGHT = 88; // Reduced from 112 to fit above fold
export const CHART_PADDING_X = 16;
export const CHART_PADDING_TOP = 6; // Reduced from 8
export const CHART_PADDING_BOTTOM = 20; // Reduced from 24, space for X-axis labels

/** Grid line configuration */
export const GRID_LINE_COUNT = 3; // 0%, 50%, 100%
export const GRID_LINE_DASH = '4,4';
export const GRID_LINE_OPACITY = 0.2;

/** Pulsing dot size */
export const DOT_RADIUS = 4;
export const DOT_PULSE_RADIUS = 8;

// ============================================================================
// Colors
// ============================================================================

// ============================================================================
// Animation Timing
// ============================================================================

export const ANIMATION = {
  /** Chart path draw duration (ms) */
  chartDrawDuration: 1500,

  /** Number count-up duration (ms) */
  countUpDuration: 800,

  /** Easing function for animations */
  easing: 'ease-out',

  /** Fade-in animation duration (ms) */
  fadeInDuration: 300,

  /** Pulsing dot animation duration (ms) */
  pulseDuration: 2000,

  /** Ring fill animation duration (ms) — aligned with theme durations.progress */
  ringDuration: 800,
};

// ============================================================================
// Time Range Labels
// ============================================================================

/** Time range toggle options */
export const TIME_RANGE_OPTIONS = [
  { label: '1M', value: '1m' as const },
  { label: '3M', value: '3m' as const },
  { label: '1Y', value: '1y' as const },
];

/** Days for each time range */
export const TIME_RANGE_DAYS = {
  '1m': 30,
  '1y': 365,
  '3m': 90,
};

// ============================================================================
// Strength Labels
// ============================================================================

/** Human-readable labels for strength levels */
export const STRENGTH_LABELS: Record<StrengthLabel, string> = {
  developing: 'Developing',
  strong: 'Strong',
  weak: 'Weak',
};
