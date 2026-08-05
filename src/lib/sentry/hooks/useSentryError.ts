/**
 * Sentry Error Hook
 */

import { useCallback, useMemo } from 'react';
import { getSentryReporter } from '../reporter/index';

/**
 * Hook to capture errors with Sentry.
 * Returns a function to manually capture errors.
 */
export function useSentryError() {
  const reporter = useMemo(() => getSentryReporter(), []);

  const captureError = useCallback(
    (error: Error, context?: Record<string, unknown>) => {
      return reporter.captureError(error, context);
    },
    [reporter]
  );

  const captureMessage = useCallback(
    (message: string, level?: 'info' | 'warning' | 'error') => {
      return reporter.captureMessage(message, level);
    },
    [reporter]
  );

  return {
    captureError,
    captureMessage,
  };
}
