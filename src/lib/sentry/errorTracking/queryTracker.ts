/**
 * Query Error Tracker
 * Specialized tracking for Convex query errors.
 */

import { getSentryReporter } from '../reporter/index';
import { trackError } from './tracker';
import type { QueryErrorContext, TrackedError } from './types';

/** Sanitize query arguments */
function sanitizeQueryArgs(
  args: Record<string, unknown>
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(args)) {
    if (typeof value === 'string' && value.length > 100) {
      sanitized[key] = value.slice(0, 100) + '...';
    } else if (Array.isArray(value)) {
      sanitized[key] = `[Array(${value.length})]`;
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = '[object]';
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/** Add breadcrumb for query execution */
export function addQueryBreadcrumb(
  queryName: string,
  args?: Record<string, unknown>
) {
  const reporter = getSentryReporter();
  reporter.addBreadcrumb({
    category: 'network',
    data: {
      args: args ? sanitizeQueryArgs(args) : undefined,
      query: queryName,
    },
    level: 'info',
    message: `Query: ${queryName}`,
  });
}

/**
 * Track a query error with full context
 */
export function trackQueryError(
  error: unknown,
  context: QueryErrorContext
): TrackedError {
  const reporter = getSentryReporter();

  // Add failure breadcrumb
  reporter.addBreadcrumb({
    category: 'network',
    data: {
      query: context.queryName,
      status: 'error',
    },
    level: 'error',
    message: `Query failed: ${context.queryName}`,
  });

  // Track with enriched context
  return trackError(error, {
    extra: {
      ...context.extra,
      args: context.args ? sanitizeQueryArgs(context.args) : undefined,
      query_name: context.queryName,
    },
    fingerprint: context.fingerprint ?? ['{{ default }}', context.queryName],
    tags: {
      ...context.tags,
      error_source: 'query',
      query_name: context.queryName,
    },
  });
}

/** Track subscription reconnection errors */
export function trackSubscriptionError(queryName: string, error: unknown) {
  const reporter = getSentryReporter();

  reporter.addBreadcrumb({
    category: 'network',
    data: { query: queryName },
    level: 'warning',
    message: `Subscription disrupted: ${queryName}`,
  });

  return trackError(error, {
    extra: { query_name: queryName },
    fingerprint: ['subscription_error', queryName],
    tags: {
      error_source: 'subscription',
      query_name: queryName,
    },
  });
}
