/**
 * Constants for BinaryHeatmap Component
 *
 * Centralized configuration for dimensions, colors, and animation timing.
 *
 * Performance Notes:
 * - Cell count: 3m=91 days (~13 weeks), 6m=182 days (~26 weeks), 1y=365 days (~52 weeks)
 * - Max cells rendered: 52 weeks × 7 days = 364 cells
 * - Virtualization not needed: 364 lightweight cells render efficiently
 * - Animation stagger: 5ms per cell = ~1.8s total animation time for 1y view
 */

/**
 * Cell dimensions (in pixels)
 */

import { colors } from '@/theme/colors';

export const CELL_SIZE = 13;

/**
 * Gap between cells (in pixels)
 */
export const CELL_GAP = 3;

/**
 * Cell border radius (in pixels)
 */
export const CELL_BORDER_RADIUS = 2;

/**
 * Day label column width (in pixels)
 */
export const DAY_LABEL_WIDTH = 20;

/**
 * Animation timing
 */
export const ANIMATION = {
  /** Duration of cell fade-in animation (ms) */
  CELL_FADE_DURATION: 300,

  /** Delay between each cell's animation start (ms) */
  CELL_STAGGER_DELAY: 5,

  /** Duration of hover scale animation (ms) */
  HOVER_DURATION: 150,

  /** Scale factor on hover */
  HOVER_SCALE: 1.4,

  /** Duration of tap feedback animation (ms) */
  TAP_DURATION: 100,

  /** Scale factor on tap */
  TAP_SCALE: 0.9,
} as const;

/**
 * Time range configurations
 */
export const TIME_RANGE_CONFIG = {
  '1y': {
    days: 365,
    label: '1y',
    weeks: 52,
  },
  '3m': {
    /** Number of days to display */
    days: 91,

    /** Label for display */
    label: '3m',

    /** Number of weeks (approximate) */
    weeks: 13,
  },
  '6m': {
    days: 182,
    label: '6m',
    weeks: 26,
  },
} as const;

/**
 * Default colors (using design system tokens)
 */
export const COLORS = {
  /** Card background */
  CARD_BACKGROUND: '#ffffff',

  // stone-100
  /** Before creation cell background */
  CELL_BEFORE_CREATION: '#fafaf9',

  /** Empty/missed cell background */
  CELL_EMPTY: '#e7e5e4',

  // stone-200
  /** Future cell background */
  CELL_FUTURE: '#f5f5f4',

  /** Text colors */
  TEXT_PRIMARY: '#1f2937',

  // gray-800
  TEXT_SECONDARY: '#78716c',

  // stone-500
  TEXT_TERTIARY: '#6B7280',
  // stone-50
  /** Today cell ring color (will use habit color at runtime) */
  TODAY_RING_WIDTH: 2, // gray-400

  /** Tooltip */
  TOOLTIP_BACKGROUND: '#1c1917', // stone-900
  TOOLTIP_TEXT: colors.text.inverse,
} as const;

/**
 * Day of week labels (Sunday = 0)
 */
export const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

/**
 * Full day names for accessibility
 */
export const DAY_NAMES_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

/**
 * Grid layout constants
 */
export const GRID = {
  /** Maximum number of weeks to display */
  MAX_WEEKS: 53,

  /** Minimum number of weeks to display */
  MIN_WEEKS: 4,

  /** Number of rows (days of week) */
  ROWS: 7,
} as const;

/**
 * Legend indicator size (in pixels)
 */
export const LEGEND_INDICATOR_SIZE = 8;

/**
 * Month label row configuration
 */
export const MONTH_LABEL = {
  /** Font size for month labels */
  FONT_SIZE: 10,

  /** Height of the month labels row (in pixels) */
  HEIGHT: 16,

  /** Minimum width for a month label (in pixels) */
  MIN_WIDTH: 24,
} as const;

/**
 * Tooltip configuration
 */
export const TOOLTIP = {
  /** Arrow size */
  ARROW_SIZE: 6,

  /** Border radius */
  BORDER_RADIUS: 6,

  /** Font size */
  FONT_SIZE: 11,

  /** Offset from cell */
  OFFSET: 8,

  /** Padding inside tooltip */
  PADDING_X: 10,

  PADDING_Y: 6,
} as const;

/**
 * Accessibility focus indicator configuration
 * Used for keyboard navigation on web
 */
export const FOCUS = {
  /** Focus ring color (uses a high-contrast blue) */
  RING_COLOR: '#2563eb', // blue-600

  /** Focus ring offset from element */
  RING_OFFSET: 2,

  /** Focus ring width */
  RING_WIDTH: 2,
} as const;
