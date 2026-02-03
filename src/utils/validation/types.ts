/**
 * Validation Types
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}
