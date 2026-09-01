/**
 * Habit Mutations Hook with Offline Support
 *
 * Provides Convex mutations for habit operations with offline detection.
 * When offline, mutations are queued via the offline queue manager.
 *
 * @see docs/offline-habit-sync.md T011
 */

import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import { useToggleHabitWithTimezone } from '../../../hooks/useToggleHabitWithTimezone';
import { getUserTimezone } from '../../../utils/timezone';
import {
  useOfflineArchiveHabit,
  useOfflinePauseHabit,
  useOfflineRemoveHabit,
} from '../../../lib/optimistic';

export interface UseHabitMutationsResult {
  toggleHabit: ReturnType<typeof useMutation<typeof api.habits.toggleHabit>>;
  archiveHabit: ReturnType<typeof useOfflineArchiveHabit>;
  pauseHabit: ReturnType<typeof useOfflinePauseHabit>;
  resumeHabit: ReturnType<typeof useMutation<typeof api.habits.resume>>;
  removeHabit: ReturnType<typeof useOfflineRemoveHabit>;
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
  const archiveHabit = useOfflineArchiveHabit();
  const pauseHabit = useOfflinePauseHabit();
  const rawResumeHabit = useMutation(api.habits.resume);
  const resumeHabit = useCallback(
    (args: { habitId: Id<'habits'> }) =>
      rawResumeHabit({ ...args, timezone: getUserTimezone() }),
    [rawResumeHabit]
  ) as typeof rawResumeHabit;
  const removeHabit = useOfflineRemoveHabit();
  const reorderHabits = useMutation(api.habits.reorderHabits);
  const updateSettings = useMutation(api.settings.update);

  return {
    archiveHabit,
    isOnline,
    pauseHabit,
    resumeHabit,
    removeHabit,
    reorderHabits,
    toggleHabit,
    updateSettings,
  };
}
