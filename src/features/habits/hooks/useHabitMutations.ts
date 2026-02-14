/**
 * Habit Mutations Hook with Offline Support
 *
 * Provides Convex mutations for habit operations with offline detection.
 * When offline, mutations are queued via the offline queue manager.
 *
 * @see docs/offline-habit-sync.md T011
 */

import { useCallback, useMemo } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import { useToggleHabitWithTimezone } from '../../../hooks/useToggleHabitWithTimezone';

export interface UseHabitMutationsResult {
  toggleHabit: ReturnType<typeof useMutation<typeof api.habits.toggleHabit>>;
  archiveHabit: ReturnType<typeof useMutation<typeof api.habits.archive>>;
  pauseHabit: ReturnType<typeof useMutation<typeof api.habits.pause>>;
  removeHabit: ReturnType<typeof useMutation<typeof api.habits.remove>>;
  reorderHabits: ReturnType<
    typeof useMutation<typeof api.habits.reorderHabits>
  >;
  updateSettings: ReturnType<typeof useMutation<typeof api.settings.update>>;
  /** Current online status from NetworkStatusContext */
  isOnline: boolean;
}

/**
 * Hook providing habit mutations with offline detection
 *
 * Returns raw Convex mutations plus isOnline status.
 * Consumers should pass isOnline to useOptimisticToggleMutation
 * for proper offline queue integration.
 *
 * @example
 * ```typescript
 * const { toggleHabit, isOnline } = useHabitMutations();
 *
 * const optimisticToggle = useOptimisticToggleMutation(
 *   toggleHabit,
 *   isCompleted,
 *   { isOnline }
 * );
 * ```
 */
export function useHabitMutations(): UseHabitMutationsResult {
  const isOnline = useIsOnline();
  const toggleHabit = useToggleHabitWithTimezone();
  const archiveHabit = useMutation(api.habits.archive);
  const pauseHabit = useMutation(api.habits.pause);
  const removeHabit = useMutation(api.habits.remove);
  const reorderHabits = useMutation(api.habits.reorderHabits);
  const updateSettings = useMutation(api.settings.update);

  // Auto-inject user timezone so server-side streak calculations
  // use local time instead of UTC
  const timezone = useMemo(() => getUserTimezone(), []);
  const toggleHabit = useCallback(
    (args: { date: string; habitId: any }) =>
      rawToggleHabit({ ...args, timezone }),
    [rawToggleHabit, timezone]
  ) as typeof rawToggleHabit;

  return {
    archiveHabit,
    isOnline,
    pauseHabit,
    removeHabit,
    reorderHabits,
    toggleHabit,
    updateSettings,
  };
}
