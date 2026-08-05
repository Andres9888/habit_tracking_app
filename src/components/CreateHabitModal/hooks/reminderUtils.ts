import { parseReminderTime } from '../utils';
import type { ReminderOption } from '../components/ReminderSelector';

/**
 * Derives the reminder option from habit's reminder time
 * Maps existing reminder times to V8 unified options
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
