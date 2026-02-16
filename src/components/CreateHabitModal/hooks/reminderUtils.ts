/**
 * Reminder utility functions for CreateHabitModal
 *
 * @module CreateHabitModal/hooks/reminderUtils
 */

import { parseReminderTime } from '../utils';
import type { ReminderOption } from '../components/ReminderSelector';

/**
 * Derives the reminder option from habit's reminder time
 *
 * @description
 * When editing an existing habit, determines which quick preset
 * (morning/midday/evening/none) matches the saved reminder time.
 *
 * @param remindersEnabled - Whether reminders are enabled for this habit
 * @param reminderTime - Time string in HH:mm format (e.g., "09:00")
 * @returns Closest matching ReminderOption preset
 *
 * @mapping Time Ranges to Options
 * - 5:00 AM - 9:59 AM → 'morning'
 * - 10:00 AM - 3:59 PM → 'midday'
 * - 4:00 PM - 4:59 AM → 'evening'
 * - No reminder → 'none'
 *
 * @example
 * getReminderOptionFromTime(true, "09:00") // → "morning"
 * getReminderOptionFromTime(true, "13:00") // → "midday"
 * getReminderOptionFromTime(true, "18:00") // → "evening"
 * getReminderOptionFromTime(false, "09:00") // → "none"
 *
 * @see {@link ReminderOption} - Available preset types
 */
export const getReminderOptionFromTime = (
  remindersEnabled: boolean | undefined,
  reminderTime: string | undefined
): ReminderOption => {
  if (!remindersEnabled || !reminderTime) {
    return 'none';
  }

  const parsed = parseReminderTime(reminderTime);
  const hours = parsed.getHours();

  if (hours >= 5 && hours < 10) return 'morning';
  if (hours >= 10 && hours < 16) return 'midday';
  if (hours >= 16 || hours < 5) return 'evening';

  return 'none';
};
