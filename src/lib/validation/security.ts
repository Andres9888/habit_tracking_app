/**
 * Security Utilities (SEC-003: Frontend Input Sanitization)
 *
 * SECURITY NOTES:
 * - Client-side validation is for UX only, never trust client validation alone
 * - Backend validation in convex/lib/inputValidation.ts is authoritative
 * - Sanitize to prevent XSS in the UI
 * - Never allow script tags, event handlers, or dangerous protocols
 */

/**
 * Patterns that indicate XSS or injection attempts
 */
const DANGEROUS_PATTERNS = [
  /<script\b/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /<iframe\b/i,
  /<embed\b/i,
  /<object\b/i,
];

/**
 * Check if input contains dangerous patterns
 */
export function containsDangerousPatterns(input: string): boolean {
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Sanitize string for safe display (prevent XSS)
 */
export function sanitizeInput(input: string | undefined): string {
  if (!input) return '';

  return (
    input
      // Remove potentially dangerous characters while preserving normal text
      .replaceAll(/<script\b[^>]*>.*?<\/script>/gi, '')
      .replaceAll(/<iframe\b[^>]*>.*?<\/iframe>/gi, '')
      .replaceAll(/javascript:/gi, '')
      .replaceAll(/on\w+\s*=/gi, '')
      // Trim whitespace
      .trim()
  );
}

/**
 * Get display value for form field (sanitized)
 */
export function getDisplayValue(value: string | undefined): string {
  if (!value) return '';
  return sanitizeInput(value);
}
