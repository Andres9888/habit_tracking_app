/**
 * Utility functions for ReminderSelector
 */

import type { ReminderOption } from './types';
import { REMINDER_OPTIONS } from './constants';

/**
 * Creates a Date object for the reminder time based on the selected option
 * Returns null for 'none'
 */
export const getReminderTimeForOption = (
  option: ReminderOption
): Date | null => {
  const info = REMINDER_OPTIONS[option];
  if (info.hour === null || info.minute === null) {
    return null;
  }
  const date = new Date();
  date.setHours(info.hour, info.minute, 0, 0);
  return date;
};
