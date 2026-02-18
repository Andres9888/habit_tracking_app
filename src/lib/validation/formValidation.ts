/**
 * Form Validation Utilities
 */

import type {
  FormValidationResult,
  FormFieldError,
  FieldValidator,
} from './types';

/**
 * Validate all form fields at once
 */
export function validateFormFields(fields: {
  [key: string]: {
    value: string | undefined;
    validator: FieldValidator;
  };
}): FormValidationResult {
  const errors: FormFieldError[] = [];

  for (const [fieldName, { value, validator }] of Object.entries(fields)) {
    const result = validator(value);
    if (!result.isValid) {
      errors.push({
        field: fieldName,
        message: result.error || 'Invalid input',
        code: 'invalid_format',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
