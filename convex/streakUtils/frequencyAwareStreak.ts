/**
 * Frequency-aware streak calculation
 *
 * Calculates streaks respecting different frequency types:
 * - daily: Must complete every day
 * - weekdays: Must complete Monday-Friday (weekends don't break streak)
 * - custom_days: Must complete on selected days only
 * - x_times_per_week: Must complete at least X times within rolling 7-day windows
 */

import { differenceInDays, getDayOfWeek } from './dateHelpers';
import type { StreakData, TrackingRecord, FrequencyType } from './types';

/**
 * Check if a given date should be tracked based on frequency settings
 */
function shouldTrackOnDate(
  date: string,
  frequency: FrequencyType,
  customDays?: number[]
): boolean {
  const dayOfWeek = getDayOfWeek(date); // 0 = Sunday, 6 = Saturday

  switch (frequency) {
    case 'daily':
      return true;

    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5; // Mon-Fri

    case 'custom_days':
      return customDays ? customDays.includes(dayOfWeek) : false;

    case 'x_times_per_week':
      return true; // Any day can count toward weekly target

    default:
      return true;
  }
}

/**
 * Count completions in the last N days
 */
function countCompletionsInDays(
  tracking: TrackingRecord[],
  endDate: string,
  days: number
): number {
  const endDateObj = new Date(endDate + 'T00:00:00');
  let count = 0;

  for (const record of tracking) {
    if (!record.completed) continue;
    const recordDate = new Date(record.date + 'T00:00:00');
    const diff = differenceInDays(endDateObj, recordDate);
    if (diff >= 0 && diff < days) {
      count++;
    }
  }

  return count;
}

/**
 * Calculate streak for x_times_per_week frequency
 * Uses rolling 7-day windows
 */
function calculateXTimesPerWeekStreak(
  tracking: TrackingRecord[],
  todayDate: string,
  targetCount: number
): { currentStreak: number; lastCompletedDate: string } {
  // Sort tracking by date descending
  const completedDates = tracking
    .filter(t => t.completed)
    .map(t => t.date)
    .sort((a, b) => b.localeCompare(a));

  if (completedDates.length === 0) {
    return { currentStreak: 0, lastCompletedDate: '' };
  }

  const lastCompletedDate = completedDates[0];
  const today = new Date(todayDate + 'T00:00:00');
  const lastCompleted = new Date(lastCompletedDate + 'T00:00:00');
  const daysSinceLastCompletion = differenceInDays(today, lastCompleted);

  // If last completion was more than 7 days ago, streak is broken
  if (daysSinceLastCompletion > 7) {
    return { currentStreak: 0, lastCompletedDate };
  }

  // Check if we've met the target in the current 7-day window
  const currentWindowCompletions = countCompletionsInDays(tracking, todayDate, 7);

  if (currentWindowCompletions < targetCount) {
    // Target not met yet - check if we still have time
    // If we're more than 7 days into the current window without meeting target, streak breaks
    const oldestDateInWindow = new Date(todayDate + 'T00:00:00');
    oldestDateInWindow.setDate(oldestDateInWindow.getDate() - 7);

    const hasCompletionsInWindow = completedDates.some(date => {
      const d = new Date(date + 'T00:00:00');
      return d >= oldestDateInWindow;
    });

    if (!hasCompletionsInWindow && daysSinceLastCompletion > 7) {
      return { currentStreak: 0, lastCompletedDate };
    }

    // Still have time to meet target - count consecutive weeks where target was met
    let streakWeeks = 0;
    let checkDate = new Date(todayDate + 'T00:00:00');

    // Start checking from previous week if current week not yet complete
    if (currentWindowCompletions < targetCount) {
      checkDate.setDate(checkDate.getDate() - 7);
    }

    while (true) {
      const windowEnd = checkDate.toISOString().split('T')[0];
      const completions = countCompletionsInDays(tracking, windowEnd, 7);

      if (completions >= targetCount) {
        streakWeeks++;
        checkDate.setDate(checkDate.getDate() - 7);
      } else {
        break;
      }
    }

    return { currentStreak: streakWeeks, lastCompletedDate };
  }

  // Target met for current week - count consecutive weeks
  let streakWeeks = 1;
  let checkDate = new Date(todayDate + 'T00:00:00');
  checkDate.setDate(checkDate.getDate() - 7);

  while (true) {
    const windowEnd = checkDate.toISOString().split('T')[0];
    const completions = countCompletionsInDays(tracking, windowEnd, 7);

    if (completions >= targetCount) {
      streakWeeks++;
      checkDate.setDate(checkDate.getDate() - 7);
    } else {
      break;
    }
  }

  return { currentStreak: streakWeeks, lastCompletedDate };
}

/**
 * Calculate frequency-aware streak from tracking history
 */
export function calculateFrequencyAwareStreak(
  tracking: TrackingRecord[],
  todayDate: string,
  frequency: FrequencyType = 'daily',
  frequencyCount?: number,
  customDays?: number[]
): StreakData {
  // Filter to only completed dates
  const completedDates = tracking
    .filter(t => t.completed)
    .map(t => t.date)
    .sort((a, b) => b.localeCompare(a));

  if (completedDates.length === 0) {
    return {
      bestStreak: 0,
      currentStreak: 0,
      lastCompletedDate: '',
    };
  }

  const lastCompletedDate = completedDates[0];

  // Handle x_times_per_week separately
  if (frequency === 'x_times_per_week') {
    const targetCount = frequencyCount ?? 3;
    const result = calculateXTimesPerWeekStreak(tracking, todayDate, targetCount);

    // Calculate best streak for x_times_per_week
    let bestStreak = result.currentStreak;
    let checkDate = new Date(todayDate + 'T00:00:00');

    // Check historical weeks
    for (let i = 0; i < 52; i++) {
      // Check up to 52 weeks back
      const windowEnd = checkDate.toISOString().split('T')[0];
      const completions = countCompletionsInDays(tracking, windowEnd, 7);

      if (completions >= targetCount) {
        let streakWeeks = 1;
        let tempDate = new Date(checkDate);
        tempDate.setDate(tempDate.getDate() - 7);

        while (true) {
          const tempWindowEnd = tempDate.toISOString().split('T')[0];
          const tempCompletions = countCompletionsInDays(tracking, tempWindowEnd, 7);

          if (tempCompletions >= targetCount) {
            streakWeeks++;
            tempDate.setDate(tempDate.getDate() - 7);
          } else {
            break;
          }
        }

        bestStreak = Math.max(bestStreak, streakWeeks);
      }

      checkDate.setDate(checkDate.getDate() - 7);
    }

    return {
      bestStreak,
      currentStreak: result.currentStreak,
      lastCompletedDate: result.lastCompletedDate,
    };
  }

  // For daily, weekdays, and custom_days - use day-by-day streak counting
  const today = new Date(todayDate + 'T00:00:00');
  const lastCompleted = new Date(lastCompletedDate + 'T00:00:00');

  // Check if streak is broken based on frequency
  if (frequency === 'daily') {
    // Daily: must complete today or yesterday
    const daysSinceLastCompletion = differenceInDays(today, lastCompleted);
    if (daysSinceLastCompletion > 1) {
      const bestStreak = calculateBestStreakForFrequency(
        completedDates,
        frequency,
        customDays
      );
      return { bestStreak, currentStreak: 0, lastCompletedDate };
    }
  } else if (frequency === 'weekdays' || frequency === 'custom_days') {
    // For non-daily frequencies, check if we missed any required days
    const daysSinceLastCompletion = differenceInDays(today, lastCompleted);

    // Find the most recent day that should have been tracked
    let checkDay = new Date(today);
    let daysToCheck = Math.min(daysSinceLastCompletion + 1, 7); // Check up to a week back

    for (let i = 0; i < daysToCheck; i++) {
      const checkDateStr = checkDay.toISOString().split('T')[0];
      if (shouldTrackOnDate(checkDateStr, frequency, customDays)) {
        // This is a day we should have completed
        const wasCompleted = completedDates.includes(checkDateStr);
        if (!wasCompleted) {
          // Missed a required day - streak broken
          const bestStreak = calculateBestStreakForFrequency(
            completedDates,
            frequency,
            customDays
          );
          return { bestStreak, currentStreak: 0, lastCompletedDate };
        }
      }
      checkDay.setDate(checkDay.getDate() - 1);
    }
  }

  // Count consecutive days backwards
  let currentStreak = 1;
  const completedSet = new Set(completedDates);

  // For non-daily frequencies, count consecutive required days
  if (frequency !== 'daily') {
    let checkDate = new Date(lastCompleted);
    checkDate.setDate(checkDate.getDate() - 1);

    // Go back and count consecutive required days that were completed
    for (let i = 0; i < 365; i++) {
      // Check up to a year back
      const checkDateStr = checkDate.toISOString().split('T')[0];

      if (shouldTrackOnDate(checkDateStr, frequency, customDays)) {
        if (completedSet.has(checkDateStr)) {
          currentStreak++;
        } else {
          break;
        }
      }

      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else {
    // Daily frequency - simple consecutive day count
    let checkDateStr = lastCompletedDate;
    for (let i = 1; i < completedDates.length; i++) {
      const prevDate = completedDates[i];
      const checkDateObj = new Date(checkDateStr + 'T00:00:00');
      const prevDateObj = new Date(prevDate + 'T00:00:00');
      const diff = differenceInDays(checkDateObj, prevDateObj);

      if (diff === 1) {
        currentStreak++;
        checkDateStr = prevDate;
      } else if (diff === 0) {
        continue;
      } else {
        break;
      }
    }
  }

  const bestStreak = calculateBestStreakForFrequency(
    completedDates,
    frequency,
    customDays
  );

  return {
    bestStreak: Math.max(bestStreak, currentStreak),
    currentStreak,
    lastCompletedDate,
  };
}

/**
 * Calculate best streak from dates respecting frequency
 */
function calculateBestStreakForFrequency(
  completedDates: string[],
  frequency: FrequencyType,
  customDays?: number[]
): number {
  if (completedDates.length === 0) return 0;

  let bestStreak = 1;
  let currentStreak = 1;
  const completedSet = new Set(completedDates);

  for (let i = 1; i < completedDates.length; i++) {
    const currentDate = new Date(completedDates[i - 1] + 'T00:00:00');
    const prevDate = new Date(completedDates[i] + 'T00:00:00');

    // For daily frequency, check consecutive days
    if (frequency === 'daily') {
      const diff = differenceInDays(currentDate, prevDate);
      if (diff === 1) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else if (diff > 1) {
        currentStreak = 1;
      }
    } else {
      // For other frequencies, check if all required days between dates are completed
      let tempDate = new Date(currentDate);
      tempDate.setDate(tempDate.getDate() - 1);
      let allRequiredDaysCompleted = true;

      while (tempDate > prevDate) {
        const tempDateStr = tempDate.toISOString().split('T')[0];
        if (shouldTrackOnDate(tempDateStr, frequency, customDays)) {
          if (!completedSet.has(tempDateStr)) {
            allRequiredDaysCompleted = false;
            break;
          }
        }
        tempDate.setDate(tempDate.getDate() - 1);
      }

      if (allRequiredDaysCompleted) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
  }

  return bestStreak;
}
