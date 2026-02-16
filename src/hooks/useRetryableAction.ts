/**
 * Hook that wraps an async action with automatic error handling and retry functionality.
 *
 * Useful for operations that may fail due to network issues or temporary errors,
 * providing a consistent UX pattern for error recovery.
 *
 * @param action - The async function to wrap with retry capability
 * @returns Object containing execution methods and state
 *
 * @example
 * ```tsx
 * const saveData = useRetryableAction(async (data: UserData) => {
 *   await saveMutation({ data });
 * });
 *
 * // Execute the action
 * await saveData.execute(userData);
 *
 * // Show error UI if it failed
 * {saveData.error && (
 *   <ErrorBanner
 *     message={saveData.error.message}
 *     onRetry={saveData.retry}
 *     onDismiss={saveData.clearError}
 *   />
 * )}
 * ```
 */

import { useCallback, useRef, useState } from 'react';

interface RetryableActionResult {
  /** Execute the action with the provided arguments */
  execute: (...args: unknown[]) => Promise<void>;
  /** Most recent error, if any */
  error: Error | null;
  /** Whether action is currently in flight */
  isLoading: boolean;
  /** Re-run the last invocation with the same arguments */
  retry: () => Promise<void>;
  /** Clear the error state without retrying */
  clearError: () => void;
}

/**
 * Hook that wraps an async action with error state management and retry functionality.
 */
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
      } catch (error_) {
        setError(error_ instanceof Error ? error_ : new Error(String(error_)));
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
