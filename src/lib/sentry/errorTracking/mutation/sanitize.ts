/**
 * Mutation Argument Sanitization
 */

const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'key',
  'credential',
  'auth',
];

/** Sanitize mutation arguments by removing sensitive data */
export function sanitizeArgs(
  args: Record<string, unknown>
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(args)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((s) => lowerKey.includes(s))) {
      sanitized[key] = '[REDACTED]';
    } else if (Array.isArray(value)) {
      sanitized[key] = `[Array(${value.length})]`;
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = '[object]';
    } else if (typeof value === 'string' && value.length > 100) {
      sanitized[key] = value.slice(0, 100) + '...';
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
