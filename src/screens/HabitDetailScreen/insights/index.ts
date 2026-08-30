/** Habit-detail insight layer — barrel export. */

export { buildInsights, MIN_DAYS_OF_DATA } from './buildInsights';
export {
  DAYPARTS,
  daypartForHour,
  findWorkingWindow,
  reminderHour,
} from './dayparts';
export {
  isMissedYesterday,
  missedLastScheduledDate,
  recoveryHeadline,
  recoveryMissedDayLabel,
} from './missedYesterday';
export { brokenRunLength } from './brokenRunLength';
export type { BrokenRunOptions } from './brokenRunLength';
export { effectiveDayDiff, type PauseWindow } from './effectiveDayDiff';
export {
  NEVER_MISS_TWICE,
  recoveryBodyCopy,
  recoveryHeadlineCopy,
  spellCount,
} from './recoveryCopy';
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
export {
  buildStreakRuns,
  rankStreakRuns,
  runRangeLabel,
  runTrend,
  streakStats,
} from './streakRuns';
export type { RunTrend, StreakRun, StreakStats } from './streakRuns';
export { useStreakRuns } from './useStreakRuns';
export { useHabitInsights } from './useHabitInsights';
export { useHabitTrackingRange } from './useHabitTrackingRange';
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
