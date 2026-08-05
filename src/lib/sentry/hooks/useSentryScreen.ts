/**
 * Sentry Screen Hook
 */

import { useEffect, useRef } from 'react';
import { getSentryReporter } from '../reporter/index';
import type { SentryTransaction } from '../types';

/**
 * Hook for tracking screen/navigation changes.
 * Use this in your screen components.
 */
export function useSentryScreen(screenName: string): void {
  const transactionRef = useRef<SentryTransaction | null>(null);

  useEffect(() => {
    const reporter = getSentryReporter();

    reporter.addBreadcrumb({
      category: 'navigation',
      data: { screen: screenName },
      message: `Navigated to ${screenName}`,
    });

    // Track screen view as transaction
    transactionRef.current = reporter.startTransaction(
      'navigation.screen_change'
    );
    if (transactionRef.current) {
      transactionRef.current.setData('screen_name', screenName);
    }

    return () => {
      if (transactionRef.current) {
        transactionRef.current.setStatus('ok');
        transactionRef.current.finish();
        transactionRef.current = null;
      }
    };
  }, [screenName]);
}
