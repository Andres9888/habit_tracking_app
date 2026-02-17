/**
 * Habit Strength Section - Constants
 *
 * Sizing, colors, and animation configuration values for the
 * HabitStrengthSection component and its sub-components.
 */

import type { StrengthLabel } from '../HabitStrengthHistory/types';
import { colors } from '../../theme/colors';

// ============================================================================
// Layout & Sizing
// ============================================================================

/** Circular progress ring dimensions (compact for above-fold layout) */
export const RING_SIZE = 64; // Reduced from 72 to fit above fold
export const RING_STROKE_WIDTH = 5; // Slightly thinner for smaller ring
export const RING_RADIUS = (RING_SIZE - RING_STROKE_WIDTH) / 2;
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

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
  developing: {
    // amber-500
    background: '#fffbeb',
    // amber-50
    gradient: {
      end: 'rgba(245, 158, 11, 0.02)',
      start: 'rgba(245, 158, 11, 0.25)',
    },
    primary: '#f59e0b',
  },
  strong: {
    // emerald-500
    background: '#ecfdf5',
    // emerald-50
    gradient: {
      // 25% opacity
      end: 'rgba(16, 185, 129, 0.02)',
      start: 'rgba(16, 185, 129, 0.25)', // 2% opacity
    },
    primary: '#10b981',
  },
  weak: {
    // red-500
    background: '#fef2f2',
    // red-50
    gradient: {
      end: 'rgba(239, 68, 68, 0.02)',
      start: 'rgba(239, 68, 68, 0.25)',
    },
    primary: '#ef4444',
  },
};

/** Neutral colors — light mode defaults (override with useThemeColors() in components) */
export const COLORS = {
  /** Border/divider color */
  border: colors.gray[200],         // #DDD8D2

  /** Card background */
  cardBackground: '#ffffff',

  /** Grid line color */
  gridLine: colors.gray[300],       // #C4BFB7

  /** Negative delta color (red-500) */
  negative: colors.error,           // #B53030

  /** Positive delta color (success green) */
  positive: colors.success,         // #15793C

  /** Ring track color */
  ringTrack: colors.gray[50],       // #FAF8F5

  /** Text muted */
  textMuted: colors.gray[400],      // #6E6660

  /** Text primary */
  textPrimary: colors.text.primary, // #2D2A26

  /** Text secondary */
  textSecondary: colors.text.secondary, // #6B6560
};

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

  /** Ring fill animation duration (ms) */
  ringDuration: 1000,
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
