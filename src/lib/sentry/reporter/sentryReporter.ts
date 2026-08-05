/**
 * Sentry Reporter Implementation
 */

import * as Sentry from '@sentry/react-native';
import type {
  SentryBreadcrumb,
  SentryReporter,
  SentryUser,
  TransactionName,
} from '../types';
import type { PerformanceIssue } from '../../../contexts/PerformanceContext/types';
import { isSentryInitialized } from '../init/index';
import { createTransactionWrapper, type SentrySpanInternal } from './types';

/** Create the Sentry reporter instance */
export function createSentryReporter(): SentryReporter {
  return {
    addBreadcrumb(breadcrumb: SentryBreadcrumb): void {
      if (!isSentryInitialized()) return;
      Sentry.addBreadcrumb({
        category: breadcrumb.category,
        data: breadcrumb.data,
        level: breadcrumb.level ?? 'info',
        message: breadcrumb.message,
        timestamp: Date.now() / 1000,
      });
    },

    captureError(error: Error, context?: Record<string, unknown>): string {
      if (!isSentryInitialized()) return '';
      return Sentry.captureException(error, { extra: context });
    },

    captureMessage(
      message: string,
      level: 'info' | 'warning' | 'error' = 'info'
    ): string {
      if (!isSentryInitialized()) return '';
      return Sentry.captureMessage(message, level);
    },

    capturePerformanceIssue(issue: PerformanceIssue): void {
      if (!isSentryInitialized()) return;
      const level = issue.severity === 'critical' ? 'error' : 'warning';
      Sentry.addBreadcrumb({
        category: 'performance',
        data: issue.data,
        level,
        message: `Performance issue: ${issue.type}`,
        timestamp: issue.timestamp / 1000,
      });
      Sentry.captureMessage(`[Performance] ${issue.message}`, {
        extra: issue.data,
        level,
        tags: { performance_type: issue.type, severity: issue.severity },
      });
    },

    finishTransaction(transaction): void {
      transaction.finish();
    },

    setUser(user: SentryUser | null): void {
      if (!isSentryInitialized()) return;
      if (user) {
        // SEC: Only the opaque Clerk user id is sent to Sentry. No email
        // or username (SR-2026-04-17-02 — PII minimization).
        Sentry.setUser({ id: user.id });
        Sentry.setTag('user_premium', user.isPremium ? 'true' : 'false');
      } else {
        Sentry.setUser(null);
        Sentry.setTag('user_premium', null);
      }
    },

    startTransaction(name: TransactionName) {
      if (!isSentryInitialized()) return null;
      const transaction = Sentry.startSpan({ name, op: 'app' }, (span) => span);
      return createTransactionWrapper(transaction as unknown as SentrySpanInternal);
    },
  };
}
