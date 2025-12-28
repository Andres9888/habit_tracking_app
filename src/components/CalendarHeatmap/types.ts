/**
 * TypeScript Interfaces for CalendarHeatmap Component
 */

import type { Id } from '../../../convex/_generated/dataModel';

// ============================================================================
// GRID THEME SYSTEM
// ============================================================================

/**
 * Available theme preset names
 */
export type GridThemeName = 'github' | 'tiles' | 'dots' | 'pixels';

/**
 * Cell shape variants for different visual styles
 */
export type CellShape =
  | 'rounded-sm'
  | 'rounded-md'
  | 'rounded-lg'
  | 'rounded-full'
  | 'rounded-none';

/**
 * Completion indicator display style
 */
export type CompletionIndicator = 'checkmark' | 'fill-only' | 'dot' | 'glow';

/**
 * Cell spacing density
 */
export type CellDensity = 'compact' | 'comfortable' | 'spacious';

/**
 * Border style for incomplete/empty cells
 */
export type CellBorderStyle = 'none' | 'solid' | 'dashed';

/**
 * Configuration for streak-based color intensity gradients
 * Maps streak length thresholds to color values
 */
export interface StreakColorConfig {
  /** Color for streaks 1-6 days (starting/new) */
  level1: string;
  /** Color for streaks 7-13 days (week+) */
  level2: string;
  /** Color for streaks 14-29 days (strong) */
  level3: string;
  /** Color for streaks 30+ days (legendary) */
  level4: string;
}

/**
 * Cell size configuration in pixels
 */
export interface CellSizeConfig {
  /** Standard cell size (3-month/year views) */
  standard: number;
  /** Large cell size (week/month views) */
  large: number;
}

/**
 * Complete grid theme configuration
 * Defines all visual aspects of the calendar heatmap cells
 */
export interface GridTheme {
  /** Unique identifier for the theme */
  id: GridThemeName;

  /** Human-readable theme name */
  name: string;

  /** Brief description of the theme style */
  description: string;

  // Cell Appearance
  /** Shape of calendar cells */
  cellShape: CellShape;

  /** Cell size in pixels (for standard/compact views) */
  cellSize: CellSizeConfig;

  /** Spacing between cells in pixels */
  cellGap: number;

  // Completion Styling
  /** How to display completed days */
  completionIndicator: CompletionIndicator;

  /** Streak-based color intensity configuration */
  streakColors: StreakColorConfig;

  /** Whether to show checkmark icon on completed cells */
  showCheckmark: boolean;

  /** Checkmark size (if shown) - relative to cell */
  checkmarkScale: number;

  // Empty/Incomplete Cell Styling
  /** Border style for incomplete cells */
  incompleteBorder: CellBorderStyle;

  /** Border width for incomplete cells (if border is shown) */
  incompleteBorderWidth: number;

  /** Background color for incomplete cells (Tailwind class or hex) */
  incompleteBackground: string;

  // Today Indicator
  /** Today cell border color (Tailwind class or hex) */
  todayBorderColor: string;

  /** Today pulse animation intensity (0 = none, 1 = subtle, 2 = prominent) */
  todayPulseIntensity: 0 | 1 | 2;

  // Future/Before Creation Cells
  /** Background color for future dates */
  futureBackground: string;

  /** Border style for future dates */
  futureBorder: CellBorderStyle;

  /** Background color for pre-creation dates */
  beforeCreationBackground: string;

  // Visual Effects
  /** Enable shadow on completed cells */
  enableShadow: boolean;

  /** Shadow color (if enabled) */
  shadowColor: string;

  /** Enable glow effect on strong streaks */
  enableStreakGlow: boolean;
}

/**
 * Deep partial type that makes nested objects also partial
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Partial theme for customization - allows overriding specific properties
 * Uses DeepPartial to allow partial overrides of nested objects like cellSize and streakColors
 */
export type GridThemeOverrides = DeepPartial<Omit<GridTheme, 'id' | 'name'>>;

/**
 * Theme context value passed through React context
 */
export interface GridThemeContextValue {
  /** Current active theme */
  theme: GridTheme;

  /** Current theme name */
  themeName: GridThemeName;

  /** Function to change the active theme */
  setTheme: (name: GridThemeName) => void;

  /** Function to apply custom overrides to current theme */
  applyOverrides: (overrides: GridThemeOverrides) => void;

  /** All available themes */
  availableThemes: GridThemeName[];

  /**
   * Whether the theme has been loaded from persistence.
   * True when either:
   * - Persistence is disabled (theme is immediately ready)
   * - Persisted theme has been loaded from AsyncStorage
   *
   * Use this to optionally delay rendering until the saved theme is applied.
   */
  isThemeReady: boolean;
}

// ============================================================================
// DEFAULT THEME PRESETS
// ============================================================================

/**
 * GitHub-style theme (current default)
 * Square cells with rounded corners, checkmarks, GitHub-like emerald gradient
 */
export const GITHUB_THEME: GridTheme = {
  beforeCreationBackground: '#fafaf9',
  cellGap: 3,
  cellShape: 'rounded-sm',
  cellSize: { large: 64, standard: 20 },
  checkmarkScale: 0.5,
  completionIndicator: 'checkmark',
  description: 'Classic contribution graph style with checkmarks',
  // stone-50
  enableShadow: false,

  enableStreakGlow: false,

  futureBackground: '#fafaf9',

  // stone-50
  futureBorder: 'dashed',

  id: 'github',

  incompleteBackground: '#f5f5f4',

  incompleteBorder: 'none',

  incompleteBorderWidth: 0,

  name: 'GitHub',

  shadowColor: 'transparent',

  showCheckmark: true,

  streakColors: {
    level1: '#6ee7b7', // emerald-300
    level2: '#34d399', // emerald-400
    level3: '#10b981', // emerald-500
    level4: '#059669', // emerald-600
  },

  // stone-100
  todayBorderColor: '#fbbf24',
  // amber-400
  todayPulseIntensity: 2,
};

/**
 * Tiles theme
 * Larger rounded squares, fill-only completion, high contrast
 */
export const TILES_THEME: GridTheme = {
  beforeCreationBackground: '#f5f5f4',
  cellGap: 4,
  cellShape: 'rounded-md',
  cellSize: { large: 68, standard: 22 },
  checkmarkScale: 0,
  completionIndicator: 'fill-only',
  description: 'Clean tile grid with bold fills',
  // stone-100
  enableShadow: true,

  enableStreakGlow: false,

  futureBackground: '#fafaf9',

  // stone-50
  futureBorder: 'dashed',

  id: 'tiles',

  incompleteBackground: '#fafaf9',

  incompleteBorder: 'solid',

  incompleteBorderWidth: 1,

  name: 'Tiles',

  shadowColor: 'rgba(0, 0, 0, 0.05)',

  showCheckmark: false,

  streakColors: {
    level1: '#a7f3d0', // emerald-200
    level2: '#6ee7b7', // emerald-300
    level3: '#34d399', // emerald-400
    level4: '#10b981', // emerald-500
  },

  // stone-50
  todayBorderColor: '#f59e0b',
  // amber-500
  todayPulseIntensity: 1,
};

/**
 * Dots theme
 * Circular cells, minimal design, dot indicator for completion
 */
export const DOTS_THEME: GridTheme = {
  beforeCreationBackground: 'transparent',
  cellGap: 6,
  cellShape: 'rounded-full',
  cellSize: { large: 56, standard: 16 },
  checkmarkScale: 0,
  completionIndicator: 'dot',
  description: 'Minimalist circular dots',
  enableShadow: false,
  enableStreakGlow: true,
  futureBackground: 'transparent',
  futureBorder: 'dashed',
  id: 'dots',
  incompleteBackground: 'transparent',
  incompleteBorder: 'solid',
  incompleteBorderWidth: 1,

  name: 'Dots',

  shadowColor: 'transparent',

  showCheckmark: false,

  streakColors: {
    level1: '#86efac', // green-300
    level2: '#4ade80', // green-400
    level3: '#22c55e', // green-500
    level4: '#16a34a', // green-600
  },

  todayBorderColor: '#f59e0b',
  // amber-500
  todayPulseIntensity: 2,
};

/**
 * Pixels theme
 * Sharp square edges, no rounding, retro pixel-art feel
 */
export const PIXELS_THEME: GridTheme = {
  beforeCreationBackground: '#1c1917',
  cellGap: 2,
  cellShape: 'rounded-none',
  cellSize: { large: 60, standard: 18 },
  checkmarkScale: 0.6,
  completionIndicator: 'fill-only',
  description: 'Retro pixel-art style with sharp edges',
  // stone-900
  enableShadow: false,

  enableStreakGlow: true,

  futureBackground: '#292524',

  // stone-800
  futureBorder: 'none',

  id: 'pixels',

  incompleteBackground: '#1c1917',

  incompleteBorder: 'solid',

  incompleteBorderWidth: 1,

  name: 'Pixels',

  shadowColor: 'transparent',

  showCheckmark: true,

  streakColors: {
    level1: '#bef264', // lime-300
    level2: '#a3e635', // lime-400
    level3: '#84cc16', // lime-500
    level4: '#65a30d', // lime-600
  },

  // stone-900 (dark mode feel)
  todayBorderColor: '#facc15',
  // yellow-400
  todayPulseIntensity: 1,
};

/**
 * All available theme presets indexed by name
 */
export const GRID_THEMES: Record<GridThemeName, GridTheme> = {
  dots: DOTS_THEME,
  github: GITHUB_THEME,
  pixels: PIXELS_THEME,
  tiles: TILES_THEME,
};

/**
 * Default theme to use when none is specified
 */
export const DEFAULT_THEME: GridThemeName = 'github';

/**
 * Get a theme by name, falling back to default if not found
 */
export function getTheme(name: GridThemeName): GridTheme {
  return GRID_THEMES[name] ?? GRID_THEMES[DEFAULT_THEME];
}

/**
 * Merge theme with custom overrides
 */
export function mergeThemeOverrides(
  base: GridTheme,
  overrides: GridThemeOverrides
): GridTheme {
  return {
    ...base,
    ...overrides,
    // Deep merge nested objects
    cellSize: {
      ...base.cellSize,
      ...overrides.cellSize,
    },
    streakColors: {
      ...base.streakColors,
      ...overrides.streakColors,
    },
  };
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Props for CalendarHeatmap container component
 */
export interface CalendarHeatmapProps {
  /** Habit ID for context */
  habitId: Id<'habits'>;

  /** Set of completed dates in YYYY-MM-DD format */
  completedDates: Set<string>;

  /** Date habit was created (to show tracking start) */
  habitCreatedAt?: number;

  /** Habit's accent color (hex) for theming cells */
  habitColor?: string;

  /** Callback when a day cell is tapped */
  onDayPress?: (date: string, completed: boolean) => void;

  /** Whether to show theme picker button (default: true) */
  showThemeButton?: boolean;

  /** Callback when theme picker button is pressed */
  onThemePress?: () => void;
}

/**
 * Props for DayCell component
 */
export interface DayCellProps {
  /** Calendar day data */
  day: CalendarDay;

  /** Index for staggered animation */
  index: number;

  /** Custom habit color (hex) */
  habitColor?: string;

  /** Callback when cell is pressed */
  onPress?: (date: string, completed: boolean) => void;
}

/**
 * Props for InsightCard component
 */
export interface InsightCardProps {
  /** Day-of-week completion statistics */
  dayOfWeekStats: DayOfWeekStat[];

  /** Weakest performing day (if detected) */
  weakestDay: { day: string; rate: number } | null;

  /** Callback when user wants to set a reminder */
  onSetReminder?: (day: string) => void;

  /** Callback when user wants to see tips */
  onSeeTips?: (day: string) => void;

  /** Callback when user dismisses the card */
  onDismiss?: () => void;
}

/**
 * Represents a single day in the calendar grid
 */
export interface CalendarDay {
  /** Date string in YYYY-MM-DD format, null for padding cells */
  date: string | null;

  /** Day of month (1-31) */
  dayOfMonth: number | null;

  /** Whether the habit was completed on this day */
  completed: boolean;

  /** Whether this is today */
  isToday: boolean;

  /** Whether this is a future date */
  isFuture: boolean;

  /** Whether this date is before the habit was created */
  isBeforeCreation: boolean;
}

/**
 * Monthly statistics
 */
export interface MonthStats {
  /** Number of completions in the month */
  completions: number;

  /** Number of eligible days (excluding future days and pre-creation) */
  eligibleDays: number;

  /** Success rate as percentage (0-100) */
  successRate: number;
}

/**
 * Day-of-week completion statistics
 */
export interface DayOfWeekStat {
  /** Day name (e.g., "Sunday", "Monday") */
  day: string;

  /** Completion rate as percentage (0-100) */
  rate: number;

  /** Number of completions on this day */
  count: number;

  /** Total eligible occurrences of this day */
  total: number;
}

/**
 * Month label for horizontal grid
 */
export interface MonthLabel {
  /** Index of the week column where this month starts */
  weekIndex: number;

  /** Short month name (e.g., "Oct", "Nov") */
  label: string;
}

// ============================================================================
// WEEK START CUSTOMIZATION
// ============================================================================

/**
 * Week start day as a number (matches JavaScript Date.getDay())
 * 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 */
export type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Named week start day options for UI display
 */
export type WeekStartDayName =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

/**
 * Mapping from named day to numeric value
 */
export const WEEK_START_DAY_MAP: Record<WeekStartDayName, WeekStartDay> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

/**
 * Mapping from numeric value to named day
 */
export const WEEK_START_DAY_NAMES: Record<WeekStartDay, WeekStartDayName> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

/**
 * Default week start day
 */
export const DEFAULT_WEEK_START: WeekStartDay = 0; // Sunday

/**
 * Context value for week start preference
 */
export interface WeekStartContextValue {
  /** Current week start day (0-6) */
  weekStartDay: WeekStartDay;

  /** Human-readable name for the week start day */
  weekStartDayName: WeekStartDayName;

  /** Function to change the week start day */
  setWeekStartDay: (day: WeekStartDay) => void;

  /** All available week start options */
  availableOptions: WeekStartDay[];

  /**
   * Whether the preference has been loaded from persistence.
   * True when either:
   * - Persistence is disabled (value is immediately ready)
   * - Persisted value has been loaded from AsyncStorage
   */
  isWeekStartReady: boolean;
}

/**
 * Get day labels rotated based on week start day
 * @param weekStartDay - The day the week starts on (0 = Sunday)
 * @returns Array of single-letter day labels in correct order
 *
 * @example
 * getRotatedDayLabels(0) // ['S', 'M', 'T', 'W', 'T', 'F', 'S'] (Sunday start)
 * getRotatedDayLabels(1) // ['M', 'T', 'W', 'T', 'F', 'S', 'S'] (Monday start)
 */
export function getRotatedDayLabels(weekStartDay: WeekStartDay): string[] {
  const base = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return [...base.slice(weekStartDay), ...base.slice(0, weekStartDay)];
}

/**
 * Get full day names rotated based on week start day
 * @param weekStartDay - The day the week starts on (0 = Sunday)
 * @returns Array of full day names in correct order
 *
 * @example
 * getRotatedDayNamesFull(0) // ['Sunday', 'Monday', ...] (Sunday start)
 * getRotatedDayNamesFull(1) // ['Monday', 'Tuesday', ...] (Monday start)
 */
export function getRotatedDayNamesFull(weekStartDay: WeekStartDay): string[] {
  const base = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return [...base.slice(weekStartDay), ...base.slice(0, weekStartDay)];
}
