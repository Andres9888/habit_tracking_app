import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export function useHabitMutations() {
  const toggleHabit = useMutation(api.habits.toggleHabit);
  const archiveHabit = useMutation(api.habits.archive);
  const pauseHabit = useMutation(api.habits.pause);
  const removeHabit = useMutation(api.habits.remove);
  const reorderHabits = useMutation(api.habits.reorderHabits);
  const updateSettings = useMutation(api.settings.update);

  return {
    toggleHabit,
    archiveHabit,
    pauseHabit,
    removeHabit,
    reorderHabits,
    updateSettings,
  };
}
