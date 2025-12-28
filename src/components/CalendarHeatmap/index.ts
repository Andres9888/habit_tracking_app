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

export type {
  CalendarHeatmapProps,
  CalendarDay,
  DayCellProps,
  InsightCardProps,
  MonthStats,
  DayOfWeekStat,
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
