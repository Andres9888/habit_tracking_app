/**
 * HabitsEmptyStateMinimal - Time-Based Chip Suggestions
 *
 * Dynamic habit suggestions based on time of day.
 * Morning routines differ from evening wind-down activities.
 */

import { TIME_PERIODS } from './animations';
import { SuggestionChip, TimePeriod } from './types';

/**
 * Time-based chip suggestions organized by period
 * Each period has 5 contextually relevant habit suggestions
 */
export const CHIP_SUGGESTIONS_BY_TIME: Record<TimePeriod, SuggestionChip[]> = {
  afternoon: [
    { emoji: '🚶', fullName: 'Take a walk', label: 'Walk' },
    { emoji: '💧', fullName: 'Drink water', label: 'Hydrate' },
    { emoji: '🧘', fullName: 'Stretch', label: 'Stretch' },
    { emoji: '🍎', fullName: 'Healthy snack', label: 'Snack' },
    { emoji: '📵', fullName: 'Take a screen break', label: 'Break' },
  ],
  evening: [
    { emoji: '📚', fullName: 'Read', label: 'Read' },
    { emoji: '🧘', fullName: 'Wind down routine', label: 'Wind down' },
    { emoji: '📝', fullName: 'Reflect on the day', label: 'Reflect' },
    { emoji: '🚫', fullName: 'No screens before bed', label: 'No screens' },
    { emoji: '🍵', fullName: 'Drink herbal tea', label: 'Tea' },
  ],
  morning: [
    { emoji: '💧', fullName: 'Drink water', label: 'Water' },
    { emoji: '🧘', fullName: 'Meditate', label: 'Meditate' },
    { emoji: '📝', fullName: 'Write in journal', label: 'Journal' },
    { emoji: '🏃', fullName: 'Exercise', label: 'Exercise' },
    { emoji: '🥗', fullName: 'Eat healthy breakfast', label: 'Breakfast' },
  ],
  night: [
    { emoji: '😴', fullName: 'Prepare for sleep', label: 'Sleep prep' },
    { emoji: '📱', fullName: 'Put phone away', label: 'Phone away' },
    { emoji: '🧘', fullName: 'Breathing exercises', label: 'Breathe' },
    { emoji: '📖', fullName: 'Light reading', label: 'Read' },
    { emoji: '🌙', fullName: 'Practice gratitude', label: 'Gratitude' },
  ],
};

/**
 * Time period display labels for contextual messaging
 */
export const TIME_PERIOD_LABELS: Record<TimePeriod, string> = {
  afternoon: 'Suggested for afternoon',
  evening: 'Suggested for evening',
  morning: 'Suggested for morning',
  night: 'Suggested for night',
};

/**
 * Time period greeting messages (optional use in headline)
 */
export const TIME_PERIOD_GREETINGS: Record<TimePeriod, string> = {
  afternoon: 'Good afternoon',
  evening: 'Good evening',
  morning: 'Good morning',
  night: 'Good night',
};

/**
 * Subtle border tint colors for each time period
 * Used to visually distinguish chips by time context
 */
export const TIME_PERIOD_TINTS: Record<TimePeriod, string> = {
  // amber-300 - sunrise warmth
  afternoon: '#10B981',
  // emerald-500 - midday energy
  evening: '#8B5CF6',
  morning: '#FCD34D', // violet-500 - sunset calm
  night: '#6366F1', // indigo-500 - night sky
};

/**
 * Determines the current time period based on the hour
 *
 * @param date - Optional date to check (defaults to current time)
 * @returns The current time period
 *
 * Time ranges:
 * - morning: 6:00 - 11:59
 * - afternoon: 12:00 - 16:59
 * - evening: 17:00 - 20:59
 * - night: 21:00 - 5:59
 */
export function getTimeOfDay(date: Date = new Date()): TimePeriod {
  const hour = date.getHours();

  // Night wraps around midnight (21:00 - 5:59)
  if (hour >= TIME_PERIODS.night.start || hour < TIME_PERIODS.night.end) {
    return 'night';
  }

  // Morning (6:00 - 11:59)
  if (hour >= TIME_PERIODS.morning.start && hour < TIME_PERIODS.morning.end) {
    return 'morning';
  }

  // Afternoon (12:00 - 16:59)
  if (
    hour >= TIME_PERIODS.afternoon.start &&
    hour < TIME_PERIODS.afternoon.end
  ) {
    return 'afternoon';
  }

  // Evening (17:00 - 20:59)
  return 'evening';
}

/**
 * Gets chip suggestions for a specific time period
 *
 * @param timePeriod - Optional time period (defaults to current time)
 * @returns Array of chip suggestions for the time period
 */
export function getChipSuggestionsForTime(
  timePeriod?: TimePeriod
): SuggestionChip[] {
  const period = timePeriod ?? getTimeOfDay();
  return CHIP_SUGGESTIONS_BY_TIME[period];
}

/**
 * Gets the contextual label for chip suggestions
 *
 * @param timePeriod - Optional time period (defaults to current time)
 * @returns Label string like "Suggested for morning"
 */
export function getChipSuggestionsLabel(timePeriod?: TimePeriod): string {
  const period = timePeriod ?? getTimeOfDay();
  return TIME_PERIOD_LABELS[period];
}

/**
 * Gets the border tint color for time-period-styled chips
 *
 * @param timePeriod - Optional time period (defaults to current time)
 * @returns Hex color string for border tint
 */
export function getTimePeriodTint(timePeriod?: TimePeriod): string {
  const period = timePeriod ?? getTimeOfDay();
  return TIME_PERIOD_TINTS[period];
}
