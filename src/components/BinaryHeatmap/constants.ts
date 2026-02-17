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
 * Default colors (light mode — reference theme tokens where possible).
 * Components should call useThemeColors() for dark mode overrides.
 */
export const COLORS = {
  /** Card background (light mode) */
  CARD_BACKGROUND: '#ffffff',

  /** Before creation cell background (stone-50) */
  CELL_BEFORE_CREATION: '#fafaf9',

  /** Empty/missed cell background (stone-200) */
  CELL_EMPTY: '#e7e5e4',

  /** Future cell background (stone-100) */
  CELL_FUTURE: '#f5f5f4',

  /** Primary text color (matches lightColors.text.primary family) */
  TEXT_PRIMARY: '#1f2937',

  /** Secondary text color (stone-500) */
  TEXT_SECONDARY: '#78716c',

  /** Tertiary text color (gray-500) */
  TEXT_TERTIARY: '#6B7280',

  /** Today cell ring border width */
  TODAY_RING_WIDTH: 2,

  /** Tooltip background (stone-900) */
  TOOLTIP_BACKGROUND: '#1c1917',
  TOOLTIP_TEXT: '#ffffff',
} as const;

/**
 * Dark mode color overrides for BinaryHeatmap.
 * Components using COLORS should switch to these when isDark is true.
 */
export const COLORS_DARK = {
  CARD_BACKGROUND: '#1F2937',    // darkColors.card
  CELL_BEFORE_CREATION: '#111827', // darkColors.background
  CELL_EMPTY: '#374151',           // darkColors.border
  CELL_FUTURE: '#1F2937',          // darkColors.card
  TEXT_PRIMARY: '#F9FAFB',         // darkColors.text.primary
  TEXT_SECONDARY: '#9CA3AF',       // darkColors.text.secondary
  TEXT_TERTIARY: '#6B7280',        // unchanged (neutral)
  TODAY_RING_WIDTH: 2,
  TOOLTIP_BACKGROUND: '#F9FAFB',   // darkColors.text.primary (inverted tooltip)
  TOOLTIP_TEXT: '#111827',         // darkColors.background
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
