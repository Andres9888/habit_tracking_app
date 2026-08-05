/**
 * Trend Calculations - Backward Compatibility Re-export
 *
 * This file re-exports from the decomposed trendCalculations/ folder
 * to maintain backward compatibility with existing imports.
 *
 * @deprecated Import directly from './trendCalculations/index' for new code.
 */

export {
  // Types
  type WeekOverWeekTrend,
  type MonthOverMonthTrend,
  // Date helpers
  getWeekStart,
  getWeekEnd,
  // Trend calculations
  calculateWeekOverWeekTrend,
  calculateMonthOverMonthTrend,
  calculateMonthlyChangeForStatsGrid,
} from './trendCalculations/index';
