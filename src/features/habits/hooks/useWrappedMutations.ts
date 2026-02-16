import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';

type AnyMutationFn = (...args: any[]) => Promise<any>;

export function useWrappedMutations(
  toggleHabit: AnyMutationFn,
  pauseHabit: AnyMutationFn,
  removeHabit: AnyMutationFn,
  updateSettings: AnyMutationFn,
  archiveHabit: AnyMutationFn
) {
  const wrappedToggleHabit = useCallback(
    async (args: { habitId: Id<'habits'>; date: string }) => {
      await toggleHabit(args);
    },
    [toggleHabit]
  );
  const wrappedPauseHabit = useCallback(
    async (args: { habitId: Id<'habits'> }) => {
      await pauseHabit(args);
    },
    [pauseHabit]
  );
  const wrappedRemoveHabit = useCallback(
    async (args: { habitId: Id<'habits'> }) => {
      await removeHabit(args);
    },
    [removeHabit]
  );
  const wrappedUpdateSettings = useCallback(
    async (s: Parameters<typeof updateSettings>[0]) => {
      await updateSettings(s);
    },
    [updateSettings]
  );
  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      await archiveHabit({ habitId });
    },
    [archiveHabit]
  );

  return {
    handleArchive,
    wrappedPauseHabit,
    wrappedRemoveHabit,
    wrappedToggleHabit,
    wrappedUpdateSettings,
  };
}
