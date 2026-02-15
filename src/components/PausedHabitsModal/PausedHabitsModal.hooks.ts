/**
 * PausedHabitsModal Hooks
 * Logic for managing paused habits
 */

import { Platform } from 'react-native';

import { useMutation, useQuery } from 'convex/react';

import type { Id } from '../../../convex/_generated/dataModel';
import { api } from '../../../convex/_generated/api';

export function usePausedHabitsModalLogic() {
  const pausedHabits = useQuery(api.habits.listPaused) ?? [];
  const resumeHabit = useMutation(api.habits.resume);

  const handleResume = async (habitId: Id<'habits'>, habitName: string) => {
    if (Platform.OS === 'web') {
      const confirmed = confirm(
        `Resume "${habitName}"? It will return to your daily habit list.`
      );
      if (!confirmed) return;
    }

    try {
      await resumeHabit({ habitId });
    } catch (error) {
      if (__DEV__) console.error('Error resuming habit:', error);
      if (Platform.OS === 'web') {
        alert('Failed to resume habit. Please try again.');
      }
    }
  };

  return {
    handleResume,
    pausedHabits,
  };
}
