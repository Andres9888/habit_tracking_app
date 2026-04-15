/**
 * TryCompletionStep hooks — habit data + toggle tracking.
 */

import { useCallback, useState } from 'react';
import { useQuery } from 'convex/react';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

export function useHabitForCompletion(habitId: Id<'habits'> | null) {
  const habits = useQuery(api.habits.list);
  const habit = habitId ? habits?.find((h) => h._id === habitId) : undefined;

  return {
    habitIcon: habit?.icon ?? '✨',
    habitName: habit?.name ?? 'Your habit',
    habitColor: habit?.iconColor ?? '#059669',
  };
}

export function useTryCompletionState(onNext: () => void) {
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleComplete = useCallback(() => {
    setHasCompleted(true);
    // Brief delay before showing continue button
    setTimeout(onNext, 1500);
  }, [onNext]);

  return { hasCompleted, handleComplete };
}
