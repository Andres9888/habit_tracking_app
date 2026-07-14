/**
 * Sentry Integration Types
 * Type definitions for Sentry monitoring configuration and data.
 */

import type { PerformanceIssue } from '../../contexts/PerformanceContext/types';

/** Sentry configuration options */
export interface SentryConfig {
  /** Debug mode - logs Sentry events to console */
  debug?: boolean;
  /** Sentry DSN (Data Source Name) */
  dsn: string;
  /** Enable performance monitoring */
  enablePerformance?: boolean;
  /** Environment identifier */
  environment: 'development' | 'preview' | 'production';
  /** Release version string */
  release?: string;
  /** Sample rate for error events (0.0 - 1.0) */
  sampleRate?: number;
  /** Sample rate for performance traces (0.0 - 1.0) */
  tracesSampleRate?: number;
  /** Enable Sentry Logs ingestion. Automatic console-log capture stays off. */
  enableLogs?: boolean;
  /** Sample rate for profiling (0.0 - 1.0) */
  profilesSampleRate?: number;
  /** Sample rate for performance session replay capture (0.0 - 1.0) */
  replaysSessionSampleRate?: number;
  /** Sample rate for replay capture when an error occurs (0.0 - 1.0) */
  replaysOnErrorSampleRate?: number;
}

/** User context for Sentry. Only `id` is forwarded to Sentry; other
 * fields are kept in the app-internal type for correlation and MUST NOT
 * be sent to Sentry (SR-2026-04-17-02). */
export interface SentryUser {
  id: string;
  isPremium?: boolean;
}

/** Breadcrumb for user actions */
export interface SentryBreadcrumb {
  category: 'navigation' | 'user' | 'network' | 'performance' | 'habit';
  data?: Record<string, unknown>;
  level?: 'info' | 'warning' | 'error';
  message: string;
}

/** Performance transaction names */
export type TransactionName =
  | 'app.cold_start'
  | 'app.warm_start'
  | 'habits.load'
  | 'habits.toggle'
  | 'habits.create'
  | 'habits.sync'
  | 'auth.login'
  | 'auth.logout'
  | 'navigation.screen_change';

/** Span operation types */
export type SpanOperation =
  | 'db.query'
  | 'http.client'
  | 'ui.render'
  | 'ui.interaction'
  | 'task.async'
  | 'function';

/** Performance span data */
export interface SpanData {
  description?: string;
  operation: SpanOperation;
  tags?: Record<string, string>;
}

/** Sentry reporter interface for sending data */
export interface SentryReporter {
  captureError: (error: Error, context?: Record<string, unknown>) => string;
  captureMessage: (
    message: string,
    level?: 'info' | 'warning' | 'error'
  ) => string;
  capturePerformanceIssue: (issue: PerformanceIssue) => void;
  addBreadcrumb: (breadcrumb: SentryBreadcrumb) => void;
  setUser: (user: SentryUser | null) => void;
  startTransaction: (
    name: TransactionName,
    data?: SpanData
  ) => SentryTransaction | null;
  finishTransaction: (transaction: SentryTransaction) => void;
}

/** Transaction handle for performance tracing */
export interface SentryTransaction {
  finish: () => void;
  setData: (key: string, value: unknown) => void;
  setStatus: (status: 'ok' | 'cancelled' | 'unknown_error') => void;
  startChild: (op: SpanOperation, description: string) => SentrySpan;
}

/** Span handle for nested operations */
export interface SentrySpan {
  finish: () => void;
  setData: (key: string, value: unknown) => void;
  setStatus: (status: 'ok' | 'cancelled' | 'unknown_error') => void;
}

/** Default configuration values */
export const DEFAULT_SENTRY_CONFIG: Partial<SentryConfig> = {
  debug: typeof __DEV__ !== 'undefined' && __DEV__,
  enablePerformance: true,
  enableLogs: false,
  profilesSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  replaysSessionSampleRate: 0,
  sampleRate: 1,
  tracesSampleRate: typeof __DEV__ !== 'undefined' && __DEV__ ? 1 : 0.2,
};
