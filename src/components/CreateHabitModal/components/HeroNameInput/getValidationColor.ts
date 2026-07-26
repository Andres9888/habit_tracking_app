import type { SemanticColors } from '@/theme/darkColors';
import type { ValidationResult } from './types';

export function getValidationColor(
  validationType: ValidationResult['type'] | undefined,
  colors: SemanticColors
): string {
  if (validationType === 'success') return colors.primary[600];
  if (validationType === 'warning') return '#D97706';
  return colors.text.secondary;
}
