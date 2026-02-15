/**
 * Client-side rate limiting utilities
 *
 * Provides throttle, debounce, and mutation guard hooks to prevent
 * rapid-fire mutations and abuse on the client side.
 *
 * Created by Opus.
 */

import { useCallback, useRef, useState } from 'react';

/**
 * Fires immediately on the first call and suppresses subsequent calls
 * within the cooldown window. Ideal for tap handlers where instant
 * feedback matters but rapid taps should be ignored.
 */
export function useThrottledCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  delayMs: number
): T {
  const lastCallRef = useRef(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current < delayMs) return;
      lastCallRef.current = now;
      return callback(...args);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, delayMs]
  ) as T;
}

/**
 * Classic debounce — delays execution until `delayMs` after the last call.
 * Good for text input auto-save, search, settings updates.
 */
export function useDebouncedCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  delayMs: number
): T {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delayMs);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, delayMs]
  ) as unknown as T;
}

/**
 * Mutation guard — prevents double-submit by tracking in-flight async operations.
 * Returns [wrappedFn, isProcessing].
 */
export function useMutationGuard<T extends (...args: never[]) => Promise<unknown>>(
  callback: T
): [T, boolean] {
  const inFlightRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const wrapped = useCallback(
    async (...args: Parameters<T>) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      setIsProcessing(true);
      try {
        return await callback(...args);
      } finally {
        inFlightRef.current = false;
        setIsProcessing(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback]
  ) as unknown as T;

  return [wrapped, isProcessing];
}
