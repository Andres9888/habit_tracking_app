/**
 * Error Classification Types
 */

import type { ErrorCategory } from '../types';

/** Network-related error patterns */
export const NETWORK_ERROR_PATTERNS = [
  /network/i,
  /fetch failed/i,
  /connection refused/i,
  /ECONNREFUSED/i,
  /ENOTFOUND/i,
  /ETIMEDOUT/i,
  /socket hang up/i,
  /no internet/i,
  /offline/i,
  /DNS lookup/i,
];

/** Timeout-related error patterns */
export const TIMEOUT_ERROR_PATTERNS = [
  /timeout/i,
  /timed out/i,
  /ETIMEOUT/i,
  /request timeout/i,
  /operation timed out/i,
];

/** Rate limit patterns */
export const RATE_LIMIT_PATTERNS = [
  /rate limit/i,
  /too many requests/i,
  /throttl/i,
  /quota exceeded/i,
];

/** Auth error patterns */
export const AUTH_ERROR_PATTERNS = [
  /unauthorized/i,
  /unauthenticated/i,
  /invalid token/i,
  /expired token/i,
  /authentication/i,
  /forbidden/i,
  /access denied/i,
];

/** Validation error patterns */
export const VALIDATION_ERROR_PATTERNS = [
  /validation/i,
  /invalid/i,
  /required field/i,
  /malformed/i,
  /bad request/i,
  /constraint/i,
];

/** Not found patterns */
export const NOT_FOUND_PATTERNS = [
  /not found/i,
  /does not exist/i,
  /no such/i,
  /404/,
];

/** Conflict patterns */
export const CONFLICT_PATTERNS = [
  /conflict/i,
  /already exists/i,
  /duplicate/i,
  /version mismatch/i,
];

/** Suggested delays by error category */
export const SUGGESTED_DELAYS: Partial<Record<ErrorCategory, number>> = {
  rateLimit: 30_000,
  server: 5000,
  timeout: 3000,
};

/** Retryable categories */
export const RETRYABLE_CATEGORIES: Set<ErrorCategory> = new Set([
  'network',
  'timeout',
  'server',
  'rateLimit',
  'unknown',
]);
