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

export const MAX_LENGTH = 50;
