/**
 * React Hook for Form Field Validation
 *
 * Provides real-time validation feedback with debouncing to avoid
 * showing errors while the user is actively typing.
 */

/* eslint-disable max-lines-per-function */
import { useState, useCallback, useEffect, useRef } from 'react';
import type { ValidationResult } from './index';

interface UseFieldValidationOptions {
  /**
   * Validation function to run on the field value
   */
  validate: (value: string | undefined) => ValidationResult;

  /**
   * Initial value of the field
   */
  initialValue?: string;

  /**
   * Delay in ms before showing validation errors (default: 500ms)
   * Prevents showing errors while user is actively typing
   */
  debounceMs?: number;

  /**
   * Whether to validate on mount (default: false)
   */
  validateOnMount?: boolean;

  /**
   * Whether to show errors only after first blur (default: true)
   */
  showErrorsAfterBlur?: boolean;
}

interface UseFieldValidationReturn {
  /**
   * Current field value
   */
  value: string;

  /**
   * Set the field value (call this from input's onChangeText)
   */
  setValue: (value: string) => void;

  /**
   * Validation error message (undefined if valid or not yet validated)
   */
  error: string | undefined;

  /**
   * Whether the field is valid
   */
  isValid: boolean;

  /**
   * Whether validation has been performed at least once
   */
  hasBeenValidated: boolean;

  /**
   * Call this when the field is blurred (optional, for showErrorsAfterBlur)
   */
  onBlur: () => void;

  /**
   * Manually trigger validation
   */
  validateNow: () => ValidationResult;

  /**
   * Clear the current value and error
   */
  reset: () => void;
}

/**
 * Hook for managing field validation with real-time feedback
 */
export function useFieldValidation(
  options: UseFieldValidationOptions
): UseFieldValidationReturn {
  const {
    validate,
    initialValue = '',
    debounceMs = 500,
    validateOnMount = false,
    showErrorsAfterBlur = true,
  } = options;

  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | undefined>();
  const [isValid, setIsValid] = useState(true);
  const [hasBeenValidated, setHasBeenValidated] = useState(false);
  const [hasBlurred, setHasBlurred] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Validate a value and update state
  const performValidation = useCallback(
    (valueToValidate: string) => {
      const result = validate(valueToValidate);
      setIsValid(result.isValid);
      setHasBeenValidated(true);

      // Only show errors if:
      // 1. showErrorsAfterBlur is false, OR
      // 2. The field has been blurred at least once
      if (!showErrorsAfterBlur || hasBlurred) {
        setError(result.error);
      }

      return result;
    },
    [validate, showErrorsAfterBlur, hasBlurred]
  );

  // Manual validation trigger
  const validateNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    return performValidation(value);
  }, [value, performValidation]);

  // Handle blur event
  const onBlur = useCallback(() => {
    setHasBlurred(true);
    validateNow();
  }, [validateNow]);

  // Reset field
  const reset = useCallback(() => {
    setValue(initialValue);
    setError(undefined);
    setIsValid(true);
    setHasBeenValidated(false);
    setHasBlurred(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [initialValue]);

  // Validate on mount if requested
  useEffect(() => {
    if (validateOnMount) {
      performValidation(value);
    }
  }, []); // Only run on mount

  // Debounced validation on value change
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      performValidation(value);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, debounceMs, performValidation]);

  return {
    error,
    hasBeenValidated,
    isValid,
    onBlur,
    reset,
    setValue,
    validateNow,
    value,
  };
}
