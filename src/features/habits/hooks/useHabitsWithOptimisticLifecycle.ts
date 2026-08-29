import { useEffect, useMemo } from 'react';
import { useOptimisticStore } from '../../../lib/optimistic';
import type { Habit } from '../types';
import { optimisticHabitCreationStore } from './optimisticHabitCreationStore';
import { reconcileCreatedHabitReminders } from './reconcileCreatedHabitReminders';

export function useHabitsWithOptimisticLifecycle(
  serverHabits: Habit[],
  pendingCreatedHabits: Habit[]
) {
  const optimistic = useOptimisticStore();

  useEffect(() => {
    const matches = optimisticHabitCreationStore.reconcile(serverHabits);
    void reconcileCreatedHabitReminders(matches);
  }, [serverHabits]);

  return useMemo(() => {
    const visibleServerHabits = serverHabits
      .filter((habit) => optimistic.pendingArchives.get(habit._id) !== true)
      .map((habit) => {
        const paused = optimistic.pendingPauses.get(habit._id);
        return paused === undefined ? habit : { ...habit, paused };
      });
    if (pendingCreatedHabits.length === 0) return visibleServerHabits;

    let maxOrder = 0;
    for (const habit of visibleServerHabits) {
      maxOrder = Math.max(maxOrder, habit.order ?? maxOrder);
    }
    return [
      ...visibleServerHabits,
      ...pendingCreatedHabits.map((habit, index) => ({
        ...habit,
        order: habit.order ?? maxOrder + index + 1,
      })),
    ];
  }, [optimistic, pendingCreatedHabits, serverHabits]);
}
