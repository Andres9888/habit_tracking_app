/**
 * Error Classifier Module
 */

export { classifyError } from './classify';
export { isNetworkError, shouldRetry, getDisplayMessage } from './helpers';
export {
  NETWORK_ERROR_PATTERNS,
  TIMEOUT_ERROR_PATTERNS,
  RATE_LIMIT_PATTERNS,
  AUTH_ERROR_PATTERNS,
  VALIDATION_ERROR_PATTERNS,
  NOT_FOUND_PATTERNS,
  CONFLICT_PATTERNS,
  RETRYABLE_CATEGORIES,
} from './types';
