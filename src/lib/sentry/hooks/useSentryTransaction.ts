/**
 * Sentry Transaction Hook
 */

import { useEffect, useRef } from 'react';
import { getSentryReporter } from '../reporter/index';
import type { TransactionName, SentryTransaction } from '../types';

/**
 * Hook to track a performance transaction.
 * Automatically finishes transaction on unmount.
 */
export function useSentryTransaction(
  name: TransactionName,
  active: boolean = true
): {
  transaction: SentryTransaction | null;
  startChild: SentryTransaction['startChild'] | null;
} {
  const transactionRef = useRef<SentryTransaction | null>(null);

  useEffect(() => {
    if (!active) return;

    const reporter = getSentryReporter();
    transactionRef.current = reporter.startTransaction(name);

    return () => {
      if (transactionRef.current) {
        transactionRef.current.setStatus('ok');
        transactionRef.current.finish();
        transactionRef.current = null;
      }
    };
  }, [name, active]);

  return {
    startChild: transactionRef.current?.startChild ?? null,
    transaction: transactionRef.current,
  };
}
