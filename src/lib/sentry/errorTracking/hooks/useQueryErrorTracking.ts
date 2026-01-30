/**
 * Query Error Tracking Hook
 */

import { useCallback } from 'react';
import { trackQueryError, addQueryBreadcrumb } from '../queryTracker';

/** Hook for tracking query errors */
export function useQueryErrorTracking(queryName: string) {
  const trackQueryErr = useCallback(
    (error: unknown, args?: Record<string, unknown>) => {
      return trackQueryError(error, { args, queryName });
    },
    [queryName]
  );

  const addBreadcrumb = useCallback(
    (args?: Record<string, unknown>) => {
      addQueryBreadcrumb(queryName, args);
    },
    [queryName]
  );

  return { addBreadcrumb, trackError: trackQueryErr };
}
