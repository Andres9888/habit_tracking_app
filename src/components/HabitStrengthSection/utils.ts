/**
 * Habit Strength Section - Utility Functions
 *
 * Re-exports from utils/ module for backwards compatibility.
 *
 * @see ./utils/index.ts for the decomposed implementation
 */

export {
  // History filtering
  filterHistoryByTimeRange,
  sampleHistoryForChart,
  // Delta calculations
  calculateWeekDelta,
  calculateMonthDelta,
  // Extended metrics
  calculateExtendedMetrics,
  // Chart data generation
  generateChartDataFromCompletions,
} from './utils/index';
