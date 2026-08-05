/**
 * Habit Strength Section - Constants
 *
 * Sizing, colors, and animation configuration values for the
 * HabitStrengthSection component and its sub-components.
 */

import type { SemanticColors } from '../../theme/darkColors';
import type { StrengthLabel } from '../HabitStrengthHistory/types';

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

/** Strength level color shape */
export interface StrengthColorSet {
  primary: string;
  background: string;
  gradient: { start: string; end: string };
}

/** Theme-aware strength level colors */
export function getStrengthColors(
  colors: SemanticColors
): Record<StrengthLabel, StrengthColorSet> {
  return {
    developing: {
      background: colors.status.warningLight,
      gradient: {
        end: 'rgba(245, 158, 11, 0.02)',
        start: 'rgba(245, 158, 11, 0.25)',
      },
      primary: colors.status.warning,
    },
    strong: {
      background: colors.status.successLight,
      gradient: {
        end: 'rgba(16, 185, 129, 0.02)',
        start: 'rgba(16, 185, 129, 0.25)',
      },
      primary: colors.status.success,
    },
    weak: {
      background: colors.status.errorLight,
      gradient: {
        end: 'rgba(239, 68, 68, 0.02)',
        start: 'rgba(239, 68, 68, 0.25)',
      },
      primary: colors.status.error,
    },
  };
}

/** Theme-aware neutral colors */
export function getThemeColors(colors: SemanticColors) {
  return {
    border: colors.border,
    cardBackground: colors.card,
    gridLine: colors.gray[300],
    negative: colors.status.error,
    positive: colors.status.successText,
    ringTrack: colors.gray[50],
    textMuted: colors.text.tertiary,
    textPrimary: colors.text.primary,
    textSecondary: colors.text.secondary,
  };
}

/**
 * @deprecated Use getStrengthColors(colors) instead for theme-aware colors.
 * Kept for backward compatibility with external consumers.
 */
export const STRENGTH_COLORS: Record<StrengthLabel, StrengthColorSet> = {
  developing: {
    background: '#fffbeb',
    gradient: { end: 'rgba(245, 158, 11, 0.02)', start: 'rgba(245, 158, 11, 0.25)' },
    primary: '#f59e0b',
  },
  strong: {
    background: '#ecfdf5',
    gradient: { end: 'rgba(16, 185, 129, 0.02)', start: 'rgba(16, 185, 129, 0.25)' },
    primary: '#10b981',
  },
  weak: {
    background: '#fef2f2',
    gradient: { end: 'rgba(239, 68, 68, 0.02)', start: 'rgba(239, 68, 68, 0.25)' },
    primary: '#ef4444',
  },
};

/**
 * @deprecated Use getThemeColors(colors) instead for theme-aware colors.
 * Kept for backward compatibility with external consumers.
 */
export const COLORS = {
  border: '#e7e5e4',
  cardBackground: '#ffffff',
  gridLine: '#d6d3d1',
  negative: '#ef4444',
  positive: '#15793C',
  ringTrack: '#f5f5f4',
  textMuted: '#a8a29e',
  textPrimary: '#1c1917',
  textSecondary: '#78716c',
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
