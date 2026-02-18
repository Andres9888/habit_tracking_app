import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';

// Generic mutation function type for better type safety
type MutationFn<Args, Result = void> = (args: Args) => Promise<Result>;

export function useWrappedMutations(
  toggleHabit: MutationFn<{ habitId: Id<'habits'>; date: string }>,
  pauseHabit: MutationFn<{ habitId: Id<'habits'> }>,
  removeHabit: MutationFn<{ habitId: Id<'habits'> }>,
  updateSettings: MutationFn<unknown>, // Generic settings object
  archiveHabit: MutationFn<{ habitId: Id<'habits'> }>
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
      try {
        await updateSettings(s);
      } catch (error) {
        if (__DEV__) console.error('Failed to update settings:', error);
        throw new Error(
          'Unable to save your settings. Please try again or contact support if the problem persists.'
        );
      }
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
