/**
 * useUserActionTracking - Hook for tracking user actions and flow
 */

import { useCallback } from 'react';
import { getPerformanceMonitor } from '../PerformanceMonitor';

/**
 * Get user action tracking utilities
 *
 * @example
 * ```tsx
 * function HabitCard() {
 *   const { trackAction } = useUserActionTracking();
 *
 *   const handleComplete = () => {
 *     trackAction('habit.complete', {
 *       habitId: habit.id,
 *       habitName: habit.name,
 *       streak: habit.streak,
 *     });
 *     // ... complete habit logic
 *   };
 * }
 * ```
 */
export function useUserActionTracking(): {
  trackAction: (action: string, data?: Record<string, unknown>) => void;
  trackNavigation: (from: string, to: string) => void;
} {
  const trackAction = useCallback(
    (action: string, data?: Record<string, unknown>): void => {
      const monitor = getPerformanceMonitor();
      monitor.trackUserAction(action, data);
    },
    []
  );

  const trackNavigation = useCallback((from: string, to: string): void => {
    const monitor = getPerformanceMonitor();
    monitor.trackNavigation(from, to);
  }, []);

  return { trackAction, trackNavigation };
}
