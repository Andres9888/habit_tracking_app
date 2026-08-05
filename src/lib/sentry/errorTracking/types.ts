/**
 * Error Tracking Types
 * Types for comprehensive error tracking integration.
 */

import type { ErrorCategory, ClassifiedError } from '../../offline/types';

/** Error severity levels for Sentry */
export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info';

/** Error context for enriched reporting */
export interface ErrorContext {
  /** Custom tags for filtering in Sentry */
  tags?: Record<string, string>;
  /** Extra data attached to the error */
  extra?: Record<string, unknown>;
  /** Fingerprint for grouping similar errors */
  fingerprint?: string[];
  /** User-facing error message (sanitized) */
  userMessage?: string;
}

/** Mutation error context */
export interface MutationErrorContext extends ErrorContext {
  /** Name of the mutation that failed */
  mutationName: string;
  /** Arguments passed to the mutation (sanitized) */
  args?: Record<string, unknown>;
  /** Duration of the mutation attempt in ms */
  durationMs?: number;
}

/** Query error context */
export interface QueryErrorContext extends ErrorContext {
  /** Name of the query that failed */
  queryName: string;
  /** Query arguments (sanitized) */
  args?: Record<string, unknown>;
}

/** Map error categories to severity levels */
export const CATEGORY_SEVERITY_MAP: Record<ErrorCategory, ErrorSeverity> = {
  auth: 'warning',
  conflict: 'warning',
  network: 'info',
  notFound: 'warning',
  rateLimit: 'warning',
  server: 'error',
  timeout: 'warning',
  unknown: 'error',
  validation: 'warning',
};

/** Errors that should not be reported to Sentry (expected errors) */
export const SILENT_ERROR_CATEGORIES: Set<ErrorCategory> = new Set([
  'network', // Common offline scenarios
]);

/** Tracked error result */
export interface TrackedError {
  /** Sentry event ID if reported */
  eventId: string | null;
  /** Classified error details */
  classified: ClassifiedError;
  /** Whether error was reported to Sentry */
  reported: boolean;
  /** Reason if not reported */
  skipReason?: 'silent_category' | 'sentry_disabled' | 'sampling';
}

/** Error tracker configuration */
export interface ErrorTrackerConfig {
  /** Sample rate for non-critical errors (0-1) */
  sampleRate?: number;
  /** Whether to report silent category errors */
  reportSilentCategories?: boolean;
  /** Maximum error reports per minute */
  rateLimitPerMinute?: number;
}

export const DEFAULT_ERROR_TRACKER_CONFIG: ErrorTrackerConfig = {
  rateLimitPerMinute: 30,
  reportSilentCategories: false,
  sampleRate: 1,
};
