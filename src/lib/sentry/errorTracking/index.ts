/**
 * Error Tracking Module
 * Comprehensive error tracking with classification and Sentry integration.
 */

// Core tracker
export {
  trackError,
  configureErrorTracker,
  getSeverity,
  resetRateLimit,
} from './tracker/index';

// Mutation tracking
export {
  trackMutationError,
  addMutationBreadcrumb,
  addMutationSuccessBreadcrumb,
  createTrackedMutation,
} from './mutation/index';

// Query tracking
export {
  trackQueryError,
  addQueryBreadcrumb,
  trackSubscriptionError,
} from './queryTracker';

// React hooks
export {
  useErrorTracking,
  useTrackedMutation,
  useQueryErrorTracking,
  useComponentErrorHandler,
  useAsyncErrorTracking,
} from './hooks/index';

// Types
export type {
  ErrorContext,
  ErrorSeverity,
  ErrorTrackerConfig,
  MutationErrorContext,
  QueryErrorContext,
  TrackedError,
} from './types';

export {
  CATEGORY_SEVERITY_MAP,
  DEFAULT_ERROR_TRACKER_CONFIG,
  SILENT_ERROR_CATEGORIES,
} from './types';
