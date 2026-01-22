/**
 * Sentry Integration Module
 * Central export for all Sentry-related functionality.
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
