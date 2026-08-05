/**
 * Streak utilities module - shared exports
 */
export type { StreakData, TrackingRecord } from './types';
export { calculateBestStreakFromDates, differenceInDays } from './dateHelpers';
export { calculateStreakFromHistory } from './historyCalculation';
export { updateStreak } from './updateStreak';
