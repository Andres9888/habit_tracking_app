/**
 * Tracked Mutation Hook
 */

import { useCallback, useRef } from 'react';
import {
  addMutationBreadcrumb,
  addMutationSuccessBreadcrumb,
  trackMutationError,
} from '../mutation/index';

/** Hook for tracking mutation errors */
export function useTrackedMutation<TArgs extends Record<string, unknown>>(
  mutationName: string,
  mutationFn: (args: TArgs) => Promise<unknown>
) {
  const startTimeRef = useRef<number>(0);

  const execute = useCallback(
    async (args: TArgs) => {
      startTimeRef.current = Date.now();
      addMutationBreadcrumb(mutationName, args);

      try {
        const result = await mutationFn(args);
        const durationMs = Date.now() - startTimeRef.current;
        addMutationSuccessBreadcrumb(mutationName, durationMs);
        return result;
      } catch (error) {
        const durationMs = Date.now() - startTimeRef.current;
        trackMutationError(error, { args, durationMs, mutationName });
        throw error;
      }
    },
    [mutationFn, mutationName]
  );

  return execute;
}
