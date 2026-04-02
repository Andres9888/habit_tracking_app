/**
 * HabitNameField Constants
 *
 * Re-exports centralized habit name limits for backward compatibility.
 * Source of truth: @/constants/app.ts
 */

export {
  MAX_HABIT_NAME_LENGTH as MAX_LENGTH,
  HABIT_NAME_SOFT_DISPLAY as MAX_CHARS,
  HABIT_NAME_WARNING_AT as WARNING_THRESHOLD,
  HABIT_NAME_COUNTER_SHOW_AT as SHOW_THRESHOLD,
} from '@/constants';

export interface HabitNameFieldProps {
  value: string;
  onChange: (text: string) => void;
  autoFocus: boolean;
  error?: string;
  onBlur?: () => void;
}
