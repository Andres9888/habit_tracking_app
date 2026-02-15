/**
 * useRetryableMutation Hook
 *
 * Wraps any async operation with automatic retry logic, exponential backoff,
 * and network-aware error handling. Shows user-friendly error messages
 * with "Tap to retry" support.
 *
 * Created by Opus.
 */

import { useCallback, useRef, useState } from 'react';
import { useIsOnline } from '../contexts/NetworkStatusContext';
import { isNetworkError } from '../lib/offline';

export interface RetryableMutationOptions {
  /** Maximum number of automatic retries before surfacing error. Default: 3 */
  maxRetries?: number;
  /** Base delay in ms for exponential backoff. Default: 1000 */
  baseDelayMs?: number;
  /** Maximum delay cap in ms. Default: 10000 */
  maxDelayMs?: number;
  /** Custom error message shown to user on failure */
  errorMessage?: string;
  /** Called when all retries exhausted */
  onFinalError?: (error: Error) => void;
}

export interface RetryableMutationState {
  /** Whether the mutation is currently in-flight (including retries) */
  isLoading: boolean;
  /** The last error encountered, null if none or cleared */
  error: Error | null;
  /** Number of retry attempts so far */
  retryCount: number;
  /** Whether the error is a network/connection issue */
  isNetworkIssue: boolean;
  /** User-friendly error message */
  userMessage: string | null;
}

export interface RetryableMutationReturn<TArgs, TResult> {
  /** Execute the mutation with retry logic */
  execute: (args: TArgs) => Promise<TResult | undefined>;
  /** Manually retry the last failed call */
  retry: () => Promise<TResult | undefined>;
  /** Clear the error state */
  clearError: () => void;
  /** Current state */
  state: RetryableMutationState;
}

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY_MS = 1000;
const DEFAULT_MAX_DELAY_MS = 10000;

function getBackoffDelay(
  attempt: number,
  baseMs: number,
  maxMs: number
): number {
  // Exponential backoff with jitter
  const exponential = baseMs * Math.pow(2, attempt);
  const jitter = Math.random() * baseMs * 0.5;
  return Math.min(exponential + jitter, maxMs);
}

function getUserMessage(error: Error, isNetwork: boolean): string {
  if (isNetwork) {
    return 'Check your connection and tap to retry.';
  }
  return 'Something went wrong. Tap to retry.';
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Hook that wraps a mutation function with automatic retry and backoff.
 *
 * @example
 * ```tsx
 * const { execute, retry, state } = useRetryableMutation(
 *   async (args: { name: string }) => {
 *     await createHabit(args);
 *   },
 *   { maxRetries: 3, errorMessage: 'Could not create habit' }
 * );
 *
 * // In handler:
 * await execute({ name: 'Exercise' });
 *
 * // In UI:
 * {state.error && (
 *   <NetworkErrorBanner message={state.userMessage} onRetry={retry} />
 * )}
 * ```
 */
export function useRetryableMutation<TArgs = void, TResult = void>(
  mutationFn: (args: TArgs) => Promise<TResult>,
  options: RetryableMutationOptions = {}
): RetryableMutationReturn<TArgs, TResult> {
  const {
    maxRetries = DEFAULT_MAX_RETRIES,
    baseDelayMs = DEFAULT_BASE_DELAY_MS,
    maxDelayMs = DEFAULT_MAX_DELAY_MS,
    errorMessage,
    onFinalError,
  } = options;

  const isOnline = useIsOnline();
  const lastArgsRef = useRef<TArgs | null>(null);

  const [state, setState] = useState<RetryableMutationState>({
    error: null,
    isLoading: false,
    isNetworkIssue: false,
    retryCount: 0,
    userMessage: null,
  });

  const executeWithRetry = useCallback(
    async (args: TArgs): Promise<TResult | undefined> => {
      lastArgsRef.current = args;

      // If offline, fail fast with clear message
      if (!isOnline) {
        const networkError = new Error('No internet connection');
        setState({
          error: networkError,
          isLoading: false,
          isNetworkIssue: true,
          retryCount: 0,
          userMessage:
            errorMessage ?? 'You're offline. Check your connection and try again.',
        });
        return undefined;
      }

      setState((prev) => ({
        ...prev,
        error: null,
        isLoading: true,
        retryCount: 0,
        userMessage: null,
      }));

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const result = await mutationFn(args);
          setState({
            error: null,
            isLoading: false,
            isNetworkIssue: false,
            retryCount: 0,
            userMessage: null,
          });
          return result;
        } catch (err) {
          const error =
            err instanceof Error ? err : new Error(String(err));
          const isNetwork = isNetworkError(err);

          if (attempt < maxRetries && isNetwork) {
            // Retry with backoff for network errors only
            setState((prev) => ({
              ...prev,
              isNetworkIssue: true,
              retryCount: attempt + 1,
            }));
            await delay(getBackoffDelay(attempt, baseDelayMs, maxDelayMs));
            continue;
          }

          // All retries exhausted or non-network error
          const message =
            errorMessage ?? getUserMessage(error, isNetwork);
          setState({
            error,
            isLoading: false,
            isNetworkIssue: isNetwork,
            retryCount: attempt,
            userMessage: message,
          });
          onFinalError?.(error);
          return undefined;
        }
      }
      return undefined;
    },
    [mutationFn, isOnline, maxRetries, baseDelayMs, maxDelayMs, errorMessage, onFinalError]
  );

  const retry = useCallback(async (): Promise<TResult | undefined> => {
    if (lastArgsRef.current === null) return undefined;
    return executeWithRetry(lastArgsRef.current);
  }, [executeWithRetry]);

  const clearError = useCallback(() => {
    setState({
      error: null,
      isLoading: false,
      isNetworkIssue: false,
      retryCount: 0,
      userMessage: null,
    });
  }, []);

  return { clearError, execute: executeWithRetry, retry, state };
}
