/**
 * Trend Calculation Types
 *
 * Type definitions for week-over-week and month-over-month
 * delta comparisons for habit tracking progress indicators.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

/**
 * Week-over-week comparison data
 */
export interface WeekOverWeekTrend {
  /** This week's completion count */
  thisWeekCompleted: number;
  /** This week's total days (up to today) */
  thisWeekTotal: number;
  /** This week's completion rate (0-100) */
  thisWeekRate: number;
  /** Last week's completion count */
  lastWeekCompleted: number;
  /** Last week's total days (always 7) */
  lastWeekTotal: number;
  /** Last week's completion rate (0-100) */
  lastWeekRate: number;
  /** Change in completion count (thisWeek - lastWeek) */
  countChange: number;
  /** Change in completion rate (thisWeekRate - lastWeekRate) */
  rateChange: number;
}

/**
 * Month-over-month comparison data
 */
export interface MonthOverMonthTrend {
  /** This month's completion count */
  thisMonthCompleted: number;
  /** This month's total days (up to today) */
  thisMonthTotal: number;
  /** This month's completion rate (0-100) */
  thisMonthRate: number;
  /** Last month's completion count */
  lastMonthCompleted: number;
  /** Last month's total days */
  lastMonthTotal: number;
  /** Last month's completion rate (0-100) */
  lastMonthRate: number;
  /** Change in completion count */
  countChange: number;
  /** Change in completion rate (thisMonthRate - lastMonthRate) */
  rateChange: number;
}
