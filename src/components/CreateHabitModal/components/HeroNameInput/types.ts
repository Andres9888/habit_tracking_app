/**
 * Type definitions for HeroNameInput component
 */

export interface HeroNameInputProps {
  autoFocus: boolean;
  onChange: (text: string) => void;
  value: string;
}

export interface ValidationResult {
  message: string;
  type: 'success' | 'tip' | 'warning';
}

export { MAX_HABIT_NAME_LENGTH as MAX_LENGTH } from '@/constants';
