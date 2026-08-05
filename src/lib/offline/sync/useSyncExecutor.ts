/**
 * useSyncExecutor
 *
 * Wires the Convex mutations the sync orchestrator replays queued operations
 * against. Extracted from useSyncOrchestrator to keep that file focused.
 */

import { useMemo } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useToggleHabitWithTimezone } from '../../../hooks/useToggleHabitWithTimezone';
import { createSyncExecutor } from './createSyncExecutor';

export function useSyncExecutor() {
  const toggleMutation = useToggleHabitWithTimezone();
  const createHabit = useMutation(api.habits.create);
  const updateHabit = useMutation(api.habits.update);
  const archiveHabit = useMutation(api.habits.archive);
  const unarchiveHabit = useMutation(api.habits.unarchive);
  const pauseHabit = useMutation(api.habits.pause);
  const resumeHabit = useMutation(api.habits.resume);
  const removeHabit = useMutation(api.habits.remove);
  const updateSettings = useMutation(api.settings.update);

  return useMemo(
    () =>
      createSyncExecutor({
        archiveHabit,
        createHabit,
        pauseHabit,
        removeHabit,
        resumeHabit,
        toggleHabit: toggleMutation,
        unarchiveHabit,
        updateHabit,
        updateSettings,
      }),
    [
      archiveHabit,
      createHabit,
      pauseHabit,
      removeHabit,
      resumeHabit,
      toggleMutation,
      unarchiveHabit,
      updateHabit,
      updateSettings,
    ]
  );
}
