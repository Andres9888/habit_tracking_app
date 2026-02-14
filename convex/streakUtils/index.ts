/**
 * Streak utilities module - shared exports
 */
export type { FrequencyType, StreakData, TrackingRecord } from './types';
export {
  calculateBestStreakFromDates,
  differenceInDays,
  getDayOfWeek,
} from './dateHelpers';
export { calculateStreakFromHistory } from './historyCalculation';
export { updateStreak } from './updateStreak';
export { calculateFrequencyAwareStreak } from './frequencyAwareStreak';
