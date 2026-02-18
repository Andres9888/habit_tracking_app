/**
 * API Error Handling Utility (SEC-002: Error Handling & Information Disclosure Prevention)
 *
 * Re-exports all error handling utilities from modular files.
 * Provides standardized error handling for API calls with proper logging,
 * user-friendly messaging, and security considerations.
 *
 * SECURITY NOTES:
 * - Never expose internal error details to users
 * - Log full errors server-side, generic messages to client
 * - Distinguish between expected errors (validation) and unexpected (system)
 * - Prevent information disclosure through error messages
 */

// Types
export type { ApiError, ApiResult } from './apiError/types';

// Error parsing
export { parseApiError } from './apiError/errorParser';

// Handlers and utilities
export {
  logApiError,
  withApiErrorHandling,
  withMutationErrorHandling,
  isAuthError,
  isTransientError,
} from './apiError/handlers';
