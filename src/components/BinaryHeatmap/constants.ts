/**
 * Constants for BinaryHeatmap Component
 *
 * Centralized configuration for dimensions, colors, and animation timing.
 */

/**
 * Cell dimensions (in pixels)
 */
export const CELL_SIZE = 10;

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

  /** Duration of tap feedback animation (ms) */
  TAP_DURATION: 100,

  /** Scale factor on hover */
  HOVER_SCALE: 1.4,

  /** Scale factor on tap */
  TAP_SCALE: 0.9,
} as const;

/**
 * Time range configurations
 */
export const TIME_RANGE_CONFIG = {
  '3m': {
    /** Number of days to display */
    days: 91,
    /** Number of weeks (approximate) */
    weeks: 13,
    /** Label for display */
    label: '3m',
  },
  '6m': {
    days: 182,
    weeks: 26,
    label: '6m',
  },
  '1y': {
    days: 365,
    weeks: 52,
    label: '1y',
  },
} as const;

/**
 * Default colors (using design system tokens)
 */
export const COLORS = {
  /** Empty/missed cell background */
  CELL_EMPTY: '#e7e5e4', // stone-200

  /** Future cell background */
  CELL_FUTURE: '#f5f5f4', // stone-100

  /** Before creation cell background */
  CELL_BEFORE_CREATION: '#fafaf9', // stone-50

  /** Today cell ring color (will use habit color at runtime) */
  TODAY_RING_WIDTH: 2,

  /** Card background */
  CARD_BACKGROUND: '#ffffff',

  /** Text colors */
  TEXT_PRIMARY: '#1f2937', // gray-800
  TEXT_SECONDARY: '#78716c', // stone-500
  TEXT_TERTIARY: '#9ca3af', // gray-400

  /** Tooltip */
  TOOLTIP_BACKGROUND: '#1c1917', // stone-900
  TOOLTIP_TEXT: '#ffffff',
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
  /** Number of rows (days of week) */
  ROWS: 7,

  /** Minimum number of weeks to display */
  MIN_WEEKS: 4,

  /** Maximum number of weeks to display */
  MAX_WEEKS: 53,
} as const;

/**
 * Legend indicator size (in pixels)
 */
export const LEGEND_INDICATOR_SIZE = 8;

/**
 * Tooltip configuration
 */
export const TOOLTIP = {
  /** Padding inside tooltip */
  PADDING_X: 10,
  PADDING_Y: 6,

  /** Border radius */
  BORDER_RADIUS: 6,

  /** Font size */
  FONT_SIZE: 11,

  /** Arrow size */
  ARROW_SIZE: 6,

  /** Offset from cell */
  OFFSET: 8,
} as const;
