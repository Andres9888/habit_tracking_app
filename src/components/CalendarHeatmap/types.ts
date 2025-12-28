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
}

// ============================================================================
// DEFAULT THEME PRESETS
// ============================================================================

/**
 * GitHub-style theme (current default)
 * Square cells with rounded corners, checkmarks, GitHub-like emerald gradient
 */
export const GITHUB_THEME: GridTheme = {
  cellGap: 3,
  cellShape: 'rounded-sm',
  cellSize: { large: 64, standard: 20 },
  checkmarkScale: 0.5,
  completionIndicator: 'checkmark',
  description: 'Classic contribution graph style with checkmarks',
  futureBackground: '#fafaf9',
  id: 'github',
  beforeCreationBackground: '#fafaf9',
  incompleteBackground: '#f5f5f4',
  // stone-50
  enableShadow: false,

  name: 'GitHub',

  enableStreakGlow: false,

  incompleteBorder: 'none',

  // stone-50
  futureBorder: 'dashed',

  showCheckmark: true,

  incompleteBorderWidth: 0,

  streakColors: {
    level1: '#6ee7b7', // emerald-300
    level2: '#34d399', // emerald-400
    level3: '#10b981', // emerald-500
    level4: '#059669', // emerald-600
  },

  shadowColor: 'transparent',

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
  cellGap: 4,
  cellShape: 'rounded-md',
  cellSize: { large: 68, standard: 22 },
  checkmarkScale: 0,
  completionIndicator: 'fill-only',
  description: 'Clean tile grid with bold fills',
  futureBackground: '#fafaf9',
  id: 'tiles',
  beforeCreationBackground: '#f5f5f4',
  incompleteBackground: '#fafaf9',
  // stone-100
  enableShadow: true,

  name: 'Tiles',

  enableStreakGlow: false,

  incompleteBorder: 'solid',

  // stone-50
  futureBorder: 'dashed',

  showCheckmark: false,

  incompleteBorderWidth: 1,

  streakColors: {
    level1: '#a7f3d0', // emerald-200
    level2: '#6ee7b7', // emerald-300
    level3: '#34d399', // emerald-400
    level4: '#10b981', // emerald-500
  },

  shadowColor: 'rgba(0, 0, 0, 0.05)',

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
  cellGap: 6,
  cellShape: 'rounded-full',
  cellSize: { large: 56, standard: 16 },
  checkmarkScale: 0,
  completionIndicator: 'dot',
  description: 'Minimalist circular dots',
  futureBackground: 'transparent',
  id: 'dots',
  beforeCreationBackground: 'transparent',
  incompleteBackground: 'transparent',
  enableShadow: false,
  name: 'Dots',
  enableStreakGlow: true,
  incompleteBorder: 'solid',
  futureBorder: 'dashed',

  showCheckmark: false,

  incompleteBorderWidth: 1,

  streakColors: {
    level1: '#86efac', // green-300
    level2: '#4ade80', // green-400
    level3: '#22c55e', // green-500
    level4: '#16a34a', // green-600
  },

  shadowColor: 'transparent',

  todayBorderColor: '#f59e0b',
  // amber-500
  todayPulseIntensity: 2,
};

/**
 * Pixels theme
 * Sharp square edges, no rounding, retro pixel-art feel
 */
export const PIXELS_THEME: GridTheme = {
  cellGap: 2,
  cellShape: 'rounded-none',
  cellSize: { large: 60, standard: 18 },
  checkmarkScale: 0.6,
  completionIndicator: 'fill-only',
  description: 'Retro pixel-art style with sharp edges',
  futureBackground: '#292524',
  id: 'pixels',
  beforeCreationBackground: '#1c1917',
  incompleteBackground: '#1c1917',
  // stone-900
  enableShadow: false,

  name: 'Pixels',

  enableStreakGlow: true,

  incompleteBorder: 'solid',

  // stone-800
  futureBorder: 'none',

  showCheckmark: true,

  incompleteBorderWidth: 1,

  streakColors: {
    level1: '#bef264', // lime-300
    level2: '#a3e635', // lime-400
    level3: '#84cc16', // lime-500
    level4: '#65a30d', // lime-600
  },

  shadowColor: 'transparent',

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
