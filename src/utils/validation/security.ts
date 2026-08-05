/**
 * Security Pattern Detection
 */

/**
 * Patterns that indicate potential XSS or injection attacks.
 * These are blocked entirely rather than sanitized.
 */
const DANGEROUS_PATTERNS = [
  /<script\b[^>]*>/i,
  /<\/script>/i,
  /on\w+\s*=/i,
  /javascript:/i,
  /vbscript:/i,
  /data:text\/html/i,
  /expression\s*\(/i,
  /behavior\s*:/i,
  /-moz-binding/i,
  /<iframe\b/i,
  /<object\b/i,
  /<embed\b/i,
  /<form\b/i,
];

/**
 * Check if input contains dangerous patterns
 */
export function containsDangerousPatterns(input: string): boolean {
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(input));
}
