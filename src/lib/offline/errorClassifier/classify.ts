/**
 * Error Classification Logic
 */

import type { ClassifiedError, ErrorCategory } from '../types';
import {
  NETWORK_ERROR_PATTERNS,
  TIMEOUT_ERROR_PATTERNS,
  RATE_LIMIT_PATTERNS,
  AUTH_ERROR_PATTERNS,
  VALIDATION_ERROR_PATTERNS,
  NOT_FOUND_PATTERNS,
  CONFLICT_PATTERNS,
  SUGGESTED_DELAYS,
  RETRYABLE_CATEGORIES,
} from './types';

/**
 * Extract HTTP status code from error if available
 */
function extractStatusCode(error: Error): number | undefined {
  const errorAny = error as unknown as Record<string, unknown>;
  if (typeof errorAny.status === 'number') return errorAny.status;
  if (typeof errorAny.statusCode === 'number') return errorAny.statusCode;
  if (typeof errorAny.code === 'number') return errorAny.code;
  const response = errorAny.response as Record<string, unknown> | undefined;
  if (response && typeof response.status === 'number') return response.status;
  const match = error.message.match(/\b([45]\d{2})\b/);
  if (match) return Number.parseInt(match[1], 10);
  return undefined;
}

function matchesPatterns(message: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(message));
}

function classifyByStatusCode(statusCode: number): ErrorCategory | null {
  if (statusCode === 401 || statusCode === 403) return 'auth';
  if (statusCode === 404) return 'notFound';
  if (statusCode === 409) return 'conflict';
  if (statusCode === 422 || statusCode === 400) return 'validation';
  if (statusCode === 429) return 'rateLimit';
  if (statusCode >= 500 && statusCode < 600) return 'server';
  if (statusCode === 408) return 'timeout';
  return null;
}

function classifyByMessage(message: string): ErrorCategory {
  if (matchesPatterns(message, NETWORK_ERROR_PATTERNS)) return 'network';
  if (matchesPatterns(message, TIMEOUT_ERROR_PATTERNS)) return 'timeout';
  if (matchesPatterns(message, RATE_LIMIT_PATTERNS)) return 'rateLimit';
  if (matchesPatterns(message, AUTH_ERROR_PATTERNS)) return 'auth';
  if (matchesPatterns(message, VALIDATION_ERROR_PATTERNS)) return 'validation';
  if (matchesPatterns(message, NOT_FOUND_PATTERNS)) return 'notFound';
  if (matchesPatterns(message, CONFLICT_PATTERNS)) return 'conflict';
  return 'unknown';
}

/**
 * Classify an error for retry decision making
 */
export function classifyError(error: unknown): ClassifiedError {
  if (!(error instanceof Error)) {
    const message = String(error);
    return {
      category: 'unknown',
      isRetryable: true,
      message,
      original: new Error(message),
    };
  }

  const statusCode = extractStatusCode(error);
  let category: ErrorCategory;

  if (statusCode) {
    const statusCategory = classifyByStatusCode(statusCode);
    category = statusCategory ?? classifyByMessage(error.message);
  } else {
    category = classifyByMessage(error.message);
  }

  return {
    category,
    isRetryable: RETRYABLE_CATEGORIES.has(category),
    message: error.message,
    original: error,
    statusCode,
    suggestedDelay: SUGGESTED_DELAYS[category],
  };
}
