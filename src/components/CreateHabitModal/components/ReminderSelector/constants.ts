/**
 * Constants for ReminderSelector component
 */

import type { ReminderOption, ReminderOptionInfo } from './types';

/**
 * V8 Reminder Options - 4 unified options
 * - None: No reminder (default)
 * - Morning: 7:00 AM
 * - Midday: 12:00 PM
 * - Evening: 8:00 PM
 */
export const REMINDER_OPTIONS: Record<ReminderOption, ReminderOptionInfo> = {
  evening: {
    emoji: '🌙',
    hour: 20,
    id: 'evening',
    label: 'Evening',
    minute: 0,
    time: '8:00 PM',
  },
  midday: {
    emoji: '☀️',
    hour: 12,
    id: 'midday',
    label: 'Midday',
    minute: 0,
    time: '12:00 PM',
  },
  morning: {
    emoji: '🌅',
    hour: 7,
    id: 'morning',
    label: 'Morning',
    minute: 0,
    time: '7:00 AM',
  },
  none: {
    emoji: '🔕',
    hour: null,
    id: 'none',
    label: 'None',
    minute: null,
    time: null,
  },
} as const;

export const REMINDER_OPTION_ORDER: ReminderOption[] = [
  'none',
  'morning',
  'midday',
  'evening',
];
