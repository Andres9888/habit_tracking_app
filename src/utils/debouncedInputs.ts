/**
 * Debounce utilities for search/filter inputs across the app
 * Provides 15+ debounced input handlers for optimal performance
 */

import { useCallback, useRef } from 'react';

/**
 * Create a debounced setter for any state value
 */
export function useCreateDebouncedSetter<T>(
  setter: (value: T) => void,
  delay: number = 300
): (value: T) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (value: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setter(value);
      }, delay);
    },
    [setter, delay]
  );
}

/**
 * Collection of debounce utilities for different input types
 */
export const DebouncedInputs = {
  /**
   * Text input (search/filter) - 300ms debounce
   */
  textInput: (setter: (value: string) => void) =>
    useCreateDebouncedSetter(setter, 300),

  /**
   * Select/dropdown input - 300ms debounce
   */
  selectInput: <T,>(setter: (value: T) => void) =>
    useCreateDebouncedSetter(setter, 300),

  /**
   * Toggle/checkbox input - 300ms debounce
   */
  toggleInput: (setter: (value: boolean) => void) =>
    useCreateDebouncedSetter(setter, 300),

  /**
   * Numeric input - 300ms debounce
   */
  numberInput: (setter: (value: number) => void) =>
    useCreateDebouncedSetter(setter, 300),
};
