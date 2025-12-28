/**
 * CalendarHeatmap Component Exports
 */

export { CalendarHeatmap } from './CalendarHeatmap';
export { CollapsibleCalendar } from './CollapsibleCalendar';
export { CalendarGrid } from './CalendarGrid';
export { WeekGrid } from './WeekGrid';
export { MonthGrid } from './MonthGrid';
export { SwipeableMonthGrid } from './SwipeableMonthGrid';
export type {
  SwipeableMonthGridProps,
  SwipeDirection,
} from './SwipeableMonthGrid';
export { DayCell } from './DayCell';
export { InsightCard } from './InsightCard';
export { DayDetailTooltip } from './DayDetailTooltip';
export { ThemePickerSheet } from './ThemePickerSheet';
export type { ThemePickerSheetProps } from './ThemePickerSheet';
export { MonthPickerSheet } from './MonthPickerSheet';
export type { MonthPickerSheetProps } from './MonthPickerSheet';
export { TodayJumpButton } from './TodayJumpButton';
export type { TodayJumpButtonProps } from './TodayJumpButton';
export { PinchToZoomContainer } from './PinchToZoomContainer';
export type {
  PinchToZoomContainerProps,
  CalendarViewMode,
  ZoomDirection,
} from './PinchToZoomTypes';
export {
  VIEW_ZOOM_ORDER,
  VIEW_MODE_LABELS,
  getZoomInView,
  getZoomOutView,
  canZoomIn,
  canZoomOut,
} from './PinchToZoomTypes';

// Theme Context and Hooks
export {
  GridThemeProvider,
  useGridTheme,
  useGridThemeOptional,
} from './GridThemeContext';
export type { GridThemeProviderProps } from './GridThemeContext';

// Week Start Context and Hooks
export {
  WeekStartProvider,
  useWeekStart,
  useWeekStartOptional,
} from './WeekStartContext';
export type { WeekStartProviderProps } from './WeekStartContext';

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
  // Week Start Types
  WeekStartDay,
  WeekStartDayName,
  WeekStartContextValue,
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
  // Week Start Utilities
  WEEK_START_DAY_MAP,
  WEEK_START_DAY_NAMES,
  DEFAULT_WEEK_START,
  getRotatedDayLabels,
  getRotatedDayNamesFull,
} from './types';

export type {
  CollapsibleCalendarProps,
  MiniPreviewDot,
  MiniPreviewDotState,
} from './CollapsibleCalendarTypes';

export {
  generateMonthGrid,
  generateWeekGrid,
  calculateMonthStats,
  calculateWeekStats,
  calculateDayOfWeekStats,
  detectWeakDay,
  calculateStreakPosition,
  formatDateForAccessibility,
  getDayAccessibilityLabel,
  DAY_LABELS,
  DAY_NAMES_FULL,
} from './utils';

export type { DayOfWeekStat as UtilsDayOfWeekStat } from './utils';
