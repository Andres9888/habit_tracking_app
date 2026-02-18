/**
 * Form Validation Types (SEC-003: Frontend Input Sanitization)
 */

export interface FormFieldError {
  field: string;
  message: string;
  code: 'required' | 'invalid_format' | 'too_long' | 'dangerous_content';
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormFieldError[];
}

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export type FieldValidator = (value: string | undefined) => ValidationResult;
