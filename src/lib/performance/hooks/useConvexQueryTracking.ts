/**
 * useConvexQueryTracking - Hook for tracking Convex query performance
 */

import { useEffect, useRef, useCallback } from 'react';
import { getPerformanceMonitor } from '../PerformanceMonitor';

/**
 * Track a Convex query's performance
 *
 * @param queryName - Name of the Convex query
 * @param isLoading - Whether the query is currently loading
 * @param error - Any error that occurred
 * @param resultSize - Optional size of the result (e.g., array length)
 *
 * @example
 * ```tsx
 * function HabitList() {
 *   const habits = useQuery(api.habits.list);
 *   useConvexQueryTracking(
 *     'habits.list',
 *     habits === undefined,
 *     undefined,
 *     habits?.length
 *   );
 * }
 * ```
 */
export function useConvexQueryTracking(
  queryName: string,
  isLoading: boolean,
  error?: Error,
  resultSize?: number
): void {
  const queryIdRef = useRef<string | null>(null);
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const monitor = getPerformanceMonitor();

    // Start tracking when loading begins
    if (isLoading && !hasStartedRef.current) {
      queryIdRef.current = monitor.startConvexQuery(queryName);
      hasStartedRef.current = true;
      hasCompletedRef.current = false;
    }

    // Complete tracking when loading finishes
    if (!isLoading && hasStartedRef.current && !hasCompletedRef.current) {
      if (queryIdRef.current) {
        monitor.endConvexQuery(queryIdRef.current, { error, resultSize });
        hasCompletedRef.current = true;
      }
    }
  }, [queryName, isLoading, error, resultSize]);

  // Cleanup on unmount if still loading
  useEffect(() => {
    return () => {
      const monitor = getPerformanceMonitor();
      if (queryIdRef.current && hasStartedRef.current && !hasCompletedRef.current) {
        monitor.endConvexQuery(queryIdRef.current, {
          error: new Error('Query unmounted before completion'),
        });
      }
    };
  }, []);
}

/**
 * Manual Convex query tracking (for imperative queries/mutations)
 *
 * @example
 * ```tsx
 * function CreateHabit() {
 *   const createHabit = useMutation(api.habits.create);
 *   const trackQuery = useConvexQueryTrackingManual();
 *
 *   const handleCreate = async () => {
 *     const queryId = trackQuery.start('habits.create');
 *     try {
 *       const result = await createHabit({ name: 'Exercise' });
 *       trackQuery.end(queryId, { resultSize: 1 });
 *     } catch (error) {
 *       trackQuery.end(queryId, { error: error as Error });
 *     }
 *   };
 * }
 * ```
 */
export function useConvexQueryTrackingManual(): {
  end: (queryId: string, options?: { error?: Error; resultSize?: number }) => void;
  start: (queryName: string) => string;
} {
  const start = useCallback((queryName: string): string => {
    const monitor = getPerformanceMonitor();
    return monitor.startConvexQuery(queryName);
  }, []);

  const end = useCallback(
    (queryId: string, options?: { error?: Error; resultSize?: number }): void => {
      const monitor = getPerformanceMonitor();
      monitor.endConvexQuery(queryId, options);
    },
    []
  );

  return { end, start };
}
