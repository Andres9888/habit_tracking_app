import { useMemo } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useToggleHabitWithTimezone } from '../../../hooks/useToggleHabitWithTimezone';
import { createSyncExecutor } from './createSyncExecutor';

export function useSyncExecutor() {
  const toggleHabit = useToggleHabitWithTimezone();
  const createHabit = useMutation(api.habits.create);
  const updateHabit = useMutation(api.habits.update);
  const archiveHabit = useMutation(api.habits.archive);
  const pauseHabit = useMutation(api.habits.pause);
  const removeHabit = useMutation(api.habits.remove);

  return useMemo(
    () =>
      createSyncExecutor({
        archiveHabit,
        createHabit,
        pauseHabit,
        removeHabit,
        toggleHabit,
        updateHabit,
      }),
    [
      archiveHabit,
      createHabit,
      pauseHabit,
      removeHabit,
      toggleHabit,
      updateHabit,
    ]
  );
}
