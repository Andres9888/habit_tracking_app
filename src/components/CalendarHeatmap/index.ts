/**
 * CalendarHeatmap Component Exports
 */

export { CalendarHeatmap } from './CalendarHeatmap';
export { CollapsibleCalendar } from './CollapsibleCalendar';
export { CalendarGrid } from './CalendarGrid';
export { WeekGrid } from './WeekGrid';
export { DayCell } from './DayCell';
export { InsightCard } from './InsightCard';
export { DayDetailTooltip } from './DayDetailTooltip';

// Theme Context and Hooks
export {
  GridThemeProvider,
  useGridTheme,
  useGridThemeOptional,
} from './GridThemeContext';
export type { GridThemeProviderProps } from './GridThemeContext';

export type {
  CalendarHeatmapProps,
  CalendarDay,
  DayCellProps,
  InsightCardProps,
  MonthStats,
  DayOfWeekStat,
  // Grid Theme Types
  GridThemeName,
  GridTheme,
  GridThemeOverrides,
  GridThemeContextValue,
  CellShape,
  CompletionIndicator,
  CellDensity,
  CellBorderStyle,
  StreakColorConfig,
  CellSizeConfig,
} from './types';

// Grid Theme Presets and Utilities
export {
  GITHUB_THEME,
  TILES_THEME,
  DOTS_THEME,
  PIXELS_THEME,
  GRID_THEMES,
  DEFAULT_THEME,
  getTheme,
  mergeThemeOverrides,
} from './types';

export type {
  CollapsibleCalendarProps,
  MiniPreviewDot,
  MiniPreviewDotState,
} from './CollapsibleCalendarTypes';

export {
  generateMonthGrid,
  calculateMonthStats,
  calculateDayOfWeekStats,
  detectWeakDay,
  calculateStreakPosition,
  formatDateForAccessibility,
  getDayAccessibilityLabel,
  DAY_LABELS,
  DAY_NAMES_FULL,
} from './utils';

export type { DayOfWeekStat as UtilsDayOfWeekStat } from './utils';
