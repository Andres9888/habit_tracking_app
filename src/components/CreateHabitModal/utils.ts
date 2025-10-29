import { getDefaultReminderTime } from '../../utils/notifications';
import { DEFAULT_EMOJI, HABIT_NAME_REGEX } from './constants';

export interface ParsedHabitName {
  emoji: string | null;
  name: string;
}

export const parseHabitName = (fullName: string): ParsedHabitName => {
  const match = fullName.match(HABIT_NAME_REGEX);
  if (match) return { emoji: match[1], name: match[2] };
  return { emoji: DEFAULT_EMOJI, name: fullName };
};

export const parseReminderTime = (timeString?: string): Date => {
  if (!timeString) return getDefaultReminderTime();
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const buildHabitName = (emoji: string | null, name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return '';
  return emoji ? `${emoji} ${trimmed}` : trimmed;
};
