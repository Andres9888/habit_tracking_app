/**
 * Habit Strength Section - Constants
 *
 * Sizing, colors, and animation configuration values for the
 * HabitStrengthSection component and its sub-components.
 */

import type { StrengthLabel } from '../HabitStrengthHistory/types';

// ============================================================================
// Layout & Sizing
// ============================================================================

/** Circular progress ring dimensions */
export const RING_SIZE = 72;
export const RING_STROKE_WIDTH = 6;
export const RING_RADIUS = (RING_SIZE - RING_STROKE_WIDTH) / 2;
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/** Chart dimensions */
export const CHART_HEIGHT = 112;
export const CHART_PADDING_X = 16;
export const CHART_PADDING_TOP = 8;
export const CHART_PADDING_BOTTOM = 24; // Space for X-axis labels

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

/** Strength level colors based on design system */
export const STRENGTH_COLORS: Record<
  StrengthLabel,
  {
    primary: string;
    background: string;
    gradient: {
      start: string;
      end: string;
    };
  }
> = {
  strong: {
    primary: '#10b981', // emerald-500
    background: '#ecfdf5', // emerald-50
    gradient: {
      start: 'rgba(16, 185, 129, 0.25)', // 25% opacity
      end: 'rgba(16, 185, 129, 0.02)', // 2% opacity
    },
  },
  developing: {
    primary: '#f59e0b', // amber-500
    background: '#fffbeb', // amber-50
    gradient: {
      start: 'rgba(245, 158, 11, 0.25)',
      end: 'rgba(245, 158, 11, 0.02)',
    },
  },
  weak: {
    primary: '#ef4444', // red-500
    background: '#fef2f2', // red-50
    gradient: {
      start: 'rgba(239, 68, 68, 0.25)',
      end: 'rgba(239, 68, 68, 0.02)',
    },
  },
};

/** Neutral colors */
export const COLORS = {
  /** Card background */
  cardBackground: '#ffffff',
  /** Text primary */
  textPrimary: '#1c1917', // stone-900
  /** Text secondary */
  textSecondary: '#78716c', // stone-500
  /** Text muted */
  textMuted: '#a8a29e', // stone-400
  /** Border/divider color */
  border: '#e7e5e4', // stone-200
  /** Grid line color */
  gridLine: '#d6d3d1', // stone-300
  /** Positive delta color */
  positive: '#10b981', // emerald-500
  /** Negative delta color */
  negative: '#ef4444', // red-500
  /** Ring track color */
  ringTrack: '#f5f5f4', // stone-100
};

// ============================================================================
// Animation Timing
// ============================================================================

export const ANIMATION = {
  /** Ring fill animation duration (ms) */
  ringDuration: 1000,
  /** Number count-up duration (ms) */
  countUpDuration: 800,
  /** Chart path draw duration (ms) */
  chartDrawDuration: 1500,
  /** Pulsing dot animation duration (ms) */
  pulseDuration: 2000,
  /** Fade-in animation duration (ms) */
  fadeInDuration: 300,
  /** Easing function for animations */
  easing: 'ease-out',
};

// ============================================================================
// Time Range Labels
// ============================================================================

/** Time range toggle options */
export const TIME_RANGE_OPTIONS = [
  { value: '1m' as const, label: '1M' },
  { value: '1y' as const, label: '1Y' },
  { value: 'all' as const, label: 'All' },
];

/** Days for each time range */
export const TIME_RANGE_DAYS = {
  '1m': 30,
  '1y': 365,
  all: Infinity,
};

// ============================================================================
// Strength Labels
// ============================================================================

/** Human-readable labels for strength levels */
export const STRENGTH_LABELS: Record<StrengthLabel, string> = {
  strong: 'Strong',
  developing: 'Developing',
  weak: 'Weak',
};
