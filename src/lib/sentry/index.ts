/**
 * Sentry Integration Module
 *
 * Central export for all Sentry-related functionality:
 * - Error tracking and monitoring
 * - Performance reporting
 * - User context and breadcrumbs
 * - React integration hooks
 *
 * @module sentry
 * @category Error Tracking / Monitoring
 */

// Initialization - call early in app lifecycle
export {
  initSentry,
  initSentryWithConfig,
  isSentryEnabled,
  isSentryInitialized,
} from './init/index';

// Configuration
export { buildSentryConfig } from './config';

// Error Boundary component
export { SentryErrorBoundary } from './ErrorBoundary/ErrorBoundary';

// Reporter API
export { getSentryReporter, sentryReporter } from './reporter/index';

// React Hooks
export {
  useSentryUser,
  useSentryTransaction,
  useSentryScreen,
  useSentryHabitActions,
  useSentryError,
  useSentryBreadcrumbs,
} from './hooks/index';

// Performance Integration
export {
  reportFrameIssue,
  reportSlowRenders,
  reportMemoryIssue,
  reportNetworkIssue,
  reportPerformanceSummary,
  createSentryIssueHandler,
} from './performanceIntegration/index';

// Error Tracking (comprehensive error capture with classification)
export {
  trackError,
  trackMutationError,
  trackQueryError,
  trackSubscriptionError,
  configureErrorTracker,
  createTrackedMutation,
  useErrorTracking,
  useTrackedMutation,
  useQueryErrorTracking,
  useComponentErrorHandler,
  useAsyncErrorTracking,
  CATEGORY_SEVERITY_MAP,
  SILENT_ERROR_CATEGORIES,
} from './errorTracking/index';

// Types
export type {
  SentryConfig,
  SentryUser,
  SentryBreadcrumb,
  SentryReporter,
  SentryTransaction,
  SentrySpan,
  TransactionName,
  SpanOperation,
  SpanData,
} from './types';

// Error Tracking Types
export type {
  ErrorContext,
  ErrorSeverity,
  ErrorTrackerConfig,
  MutationErrorContext,
  QueryErrorContext,
  TrackedError,
} from './errorTracking/types';
