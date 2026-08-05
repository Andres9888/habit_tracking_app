/**
 * Async Error Tracking Hook
 */

import { useCallback, useRef } from 'react';
import { trackError } from '../tracker/index';

/** Hook for async operation error tracking */
export function useAsyncErrorTracking(operationName: string) {
  const startTimeRef = useRef<number>(0);

  const wrap = useCallback(
    async <T>(asyncFn: () => Promise<T>): Promise<T> => {
      startTimeRef.current = Date.now();

      try {
        return await asyncFn();
      } catch (error) {
        const durationMs = Date.now() - startTimeRef.current;
        trackError(error, {
          extra: { duration_ms: durationMs, operation: operationName },
          fingerprint: ['async_operation', operationName],
          tags: { error_source: 'async_operation', operation: operationName },
        });
        throw error;
      }
    },
    [operationName]
  );

  return { wrap };
}
