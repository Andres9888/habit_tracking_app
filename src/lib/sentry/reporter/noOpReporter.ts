/**
 * No-Op Reporter
 * Used when Sentry is not initialized.
 */

import type { SentryReporter, SentryTransaction } from '../types';

const noOpTransaction: SentryTransaction = {
  finish: () => {},
  setData: () => {},
  setStatus: () => {},
  startChild: () => ({
    finish: () => {},
    setData: () => {},
    setStatus: () => {},
  }),
};

/** Create a no-op reporter for when Sentry is disabled */
export function createNoOpReporter(): SentryReporter {
  return {
    addBreadcrumb: () => {},
    captureError: () => '',
    captureMessage: () => '',
    capturePerformanceIssue: () => {},
    finishTransaction: () => {},
    setUser: () => {},
    startTransaction: () => noOpTransaction,
  };
}
