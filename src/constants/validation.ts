/**
 * Validation Constants
 *
 * Centralized regex patterns and validation constants used across the app.
 * These patterns are extracted to constants to avoid duplication and ensure
 * consistency across multiple validation functions.
 */

/**
 * Regex pattern for validating YYYY-MM-DD date format
 *
 * Matches exactly: 4 digits, dash, 2 digits, dash, 2 digits
 * Does not validate that the date actually exists (e.g., Feb 30)
 *
 * @example
 * DATE_FORMAT_REGEX.test('2024-01-15') // true
 * DATE_FORMAT_REGEX.test('2024-1-15')  // false
 * DATE_FORMAT_REGEX.test('2024-13-01') // true (format is valid, but month is invalid)
 */
export const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
