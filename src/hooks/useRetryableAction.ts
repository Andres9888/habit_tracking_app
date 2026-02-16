/**
 * useRetryableAction — wraps an async action with error state + retry.
 *
 * Usage:
 *   const { execute, error, isLoading, retry, clearError } = useRetryableAction(
 *     async () => { await someMutation(...args); }
 *   );
 */

import { useCallback, useRef, useState } from 'react';

interface RetryableActionResult {
  /** Execute the action */
  execute: (...args: unknown[]) => Promise<void>;
  /** Most recent error, if any */
  error: Error | null;
  /** Whether action is in flight */
  isLoading: boolean;
  /** Re-run the last invocation */
  retry: () => Promise<void>;
  /** Clear the error without retrying */
  clearError: () => void;
}

export function useRetryableAction(
  action: (...args: unknown[]) => Promise<unknown>
): RetryableActionResult {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const lastArgsRef = useRef<unknown[]>([]);

  const execute = useCallback(
    async (...args: unknown[]) => {
      lastArgsRef.current = args;
      setError(null);
      setIsLoading(true);
      try {
        await action(...args);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    },
    [action]
  );

  const retry = useCallback(async () => {
    await execute(...lastArgsRef.current);
  }, [execute]);

  const clearError = useCallback(() => setError(null), []);

  return { clearError, error, execute, isLoading, retry };
}
