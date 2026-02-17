/**
 * Streak utilities module - shared exports
 */
export type { StreakData, TrackingRecord } from './types';
export type { FrequencyConfig } from './frequencyHelpers';
export { calculateBestStreakFromDates, differenceInDays } from './dateHelpers';
export { calculateStreakFromHistory } from './historyCalculation';
export { calculateFrequencyAwareStreak, isScheduledDay } from './frequencyHelpers';
export { updateStreak } from './updateStreak';
