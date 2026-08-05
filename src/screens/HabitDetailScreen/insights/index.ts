/** Habit-detail insight layer — barrel export. */

export { buildInsights, MIN_DAYS_OF_DATA } from './buildInsights';
export {
  DAYPARTS,
  daypartForHour,
  findWorkingWindow,
  reminderHour,
} from './dayparts';
export { isMissedYesterday, recoveryHeadline } from './missedYesterday';
export {
  bestMonth,
  buildMonthlyRates,
  monthRangeLabel,
  trendCaption,
  turningPoint,
} from './monthlyTrend';
export type { MonthRate } from './monthlyTrend';
export {
  DISPLAY_ORDER,
  inclusiveDaySpan,
  isScheduledWeekday,
  parseLocalDate,
  scheduledWeekdays,
  WEEKDAY_PLURAL,
  WEEKDAY_SHORT,
} from './schedule';
export { useHabitInsights } from './useHabitInsights';
export { buildWeekdayStats, findOneFix } from './weekdayStats';
export type {
  Daypart,
  DaypartKey,
  HabitInsights,
  InsightEntry,
  OneFixInsight,
  WeekdayStat,
  WorkingInsight,
} from './types';
