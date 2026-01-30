import { createDateFromTimeString, getDefaultReminderTime } from '../../utils/notifications';
import { HABIT_NAME_REGEX } from './constants';

// Re-export from utils folder
export { extractTemplateDetails } from './utils/templateUtils';

export interface ParsedHabitName {
  emoji: string | null;
  name: string;
}

export const parseHabitName = (fullName: string): ParsedHabitName => {
  if (!fullName || !fullName.trim()) {
    return { emoji: null, name: '' };
  }

  const match = fullName.match(HABIT_NAME_REGEX);
  if (match) {
    return { emoji: match[1], name: match[2] };
  }

  return { emoji: null, name: fullName.trim() };
};

export const parseReminderTime = (timeString?: string): Date => {
  return createDateFromTimeString(timeString, getDefaultReminderTime());
};

export const buildHabitName = (emoji: string | null, name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return '';
  return emoji ? `${emoji} ${trimmed}` : trimmed;
};
