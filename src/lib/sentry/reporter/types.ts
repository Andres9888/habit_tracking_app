/**
 * Reporter Types
 */

import type { SpanOperation, SentrySpan, SentryTransaction } from '../types';

export interface SentrySpanInternal {
  end?: () => void;
  setAttribute?: (key: string, value: unknown) => void;
  setStatus?: (status: string) => void;
}

/** Transaction wrapper creation */
export function createTransactionWrapper(span: SentrySpanInternal): SentryTransaction {
  return {
    finish: () => span?.end?.(),
    setData: (key: string, value: unknown) => span?.setAttribute?.(key, value),
    setStatus: (status: 'ok' | 'cancelled' | 'unknown_error') => {
      span?.setStatus?.(status === 'ok' ? 'ok' : 'internal_error');
    },
    startChild: (op: SpanOperation, description: string): SentrySpan => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Sentry = require('@sentry/react-native');
      const childSpan = Sentry.startSpan({ name: description, op });
      return {
        finish: () => childSpan?.end?.(),
        setData: (key: string, value: unknown) =>
          childSpan?.setAttribute?.(key, value),
        setStatus: (status: 'ok' | 'cancelled' | 'unknown_error') => {
          childSpan?.setStatus?.(status === 'ok' ? 'ok' : 'internal_error');
        },
      };
    },
  };
}
