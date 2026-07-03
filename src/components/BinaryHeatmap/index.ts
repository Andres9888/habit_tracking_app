/**
 * BinaryHeatmap Component Exports
 *
 * GitHub-style binary (on/off) heatmap for visualizing
 * daily habit completion data.
 */

// Component exports
export { BinaryHeatmap } from './BinaryHeatmapNew';
export { BinaryHeatmapGrid } from './BinaryHeatmapGrid';
export { BinaryCell } from './BinaryCell';
export { TimeRangeToggle } from './TimeRangeToggle';
export { HeatmapLegend } from './HeatmapLegend';
export { MonthLabelsRow } from './MonthLabelsRow';
export { HeatmapTooltip } from './HeatmapTooltip';
export { StatsRow } from './StatsRow';
export { MonthlyCalendarGrid } from './MonthlyCalendarGrid';
export { InlineHeatmapGrid } from './InlineHeatmapGrid';

// Type exports
export type {
  TimeRange,
  BinaryCellState,
  BinaryDay,
  BinaryMonthLabel,
  BinaryGridData,
  BinaryGridStats,
  BinaryHeatmapProps,
  BinaryHeatmapGridProps,
  BinaryCellProps,
  TimeRangeToggleProps,
  HeatmapLegendProps,
  HeatmapTooltipProps,
  StatsRowProps,
} from './types';

// Constants exports
export {
  CELL_SIZE,
  CELL_GAP,
  CELL_BORDER_RADIUS,
  DAY_LABEL_WIDTH,
  ANIMATION,
  TIME_RANGE_CONFIG,
  COLORS,
  DAY_LABELS,
  DAY_NAMES_FULL,
  GRID,
  LEGEND_INDICATOR_SIZE,
  TOOLTIP,
  MONTH_LABEL,
} from './constants';

// Utility exports
export {
  generateBinaryGrid,
  calculateBinaryGridStats,
  getTimeRangeDays,
  getCellState,
  formatDateForAccessibility,
  getBinaryCellAccessibilityLabel,
  formatTooltipText,
  getTotalCellCount,
  calculateCellAnimationDelay,
  isValidDateString,
  formatDateString,
} from './utils';
