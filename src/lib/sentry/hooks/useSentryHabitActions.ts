/**
 * Sentry Habit Actions Hook
 */

import { useCallback, useMemo } from 'react';
import { getSentryReporter } from '../reporter/index';

/**
 * Hook for tracking habit-related actions.
 */
export function useSentryHabitActions() {
  const reporter = useMemo(() => getSentryReporter(), []);

  const trackHabitToggle = useCallback(
    (habitId: string, completed: boolean) => {
      reporter.addBreadcrumb({
        category: 'habit',
        data: { completed, habitId },
        message: `Habit ${completed ? 'completed' : 'uncompleted'}`,
      });
    },
    [reporter]
  );

  const trackHabitCreate = useCallback(
    (habitName: string) => {
      reporter.addBreadcrumb({
        category: 'habit',
        data: { habitName },
        message: 'New habit created',
      });
    },
    [reporter]
  );

  const trackHabitArchive = useCallback(
    (habitId: string) => {
      reporter.addBreadcrumb({
        category: 'habit',
        data: { habitId },
        message: 'Habit archived',
      });
    },
    [reporter]
  );

  return {
    trackHabitArchive,
    trackHabitCreate,
    trackHabitToggle,
  };
}
