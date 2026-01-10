/**
 * Trend Calculations - Barrel Export
 *
 * Re-exports all trend calculation utilities.
 * Maintains backward compatibility with the original trendCalculations.ts API.
 */

// Types
export type { WeekOverWeekTrend, MonthOverMonthTrend } from './types';

// Date helpers
export { getWeekStart, getWeekEnd } from './dateHelpers';

// Trend calculations
export { calculateWeekOverWeekTrend } from './weeklyTrend';
export {
  calculateMonthOverMonthTrend,
  calculateMonthlyChangeForStatsGrid,
} from './monthlyTrend';
