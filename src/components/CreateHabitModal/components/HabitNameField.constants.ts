/**
 * HabitNameField Constants
 */

export const MAX_LENGTH = 50;
export const MAX_CHARS = 40; // V11: Soft limit for character counter
export const WARNING_THRESHOLD = 30;
export const SHOW_THRESHOLD = 20;

export interface HabitNameFieldProps {
  value: string;
  onChange: (text: string) => void;
  autoFocus: boolean;
  error?: string;
  onBlur?: () => void;
}
