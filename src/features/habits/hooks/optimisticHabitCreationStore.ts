import { useSyncExternalStore } from 'react';
import {
  OPTIMISTIC_HABIT_ID_PREFIX,
  type StoreListener,
} from './optimisticHabitCreationStore.types';
import { optimisticHabitCreationStore as pendingCreatedHabitsStore } from './optimisticHabitCreationStoreCore';

export { optimisticHabitCreationStore } from './optimisticHabitCreationStoreCore';
export { OPTIMISTIC_HABIT_ID_PREFIX } from './optimisticHabitCreationStore.types';

export function isOptimisticHabitId(habitId: string) {
  return habitId.startsWith(OPTIMISTIC_HABIT_ID_PREFIX);
}

const subscribeToPendingCreatedHabits = (listener: StoreListener) =>
  pendingCreatedHabitsStore.subscribe(listener);

const getPendingCreatedHabitsSnapshot = () =>
  pendingCreatedHabitsStore.getSnapshot();

export function usePendingCreatedHabits() {
  return useSyncExternalStore(
    subscribeToPendingCreatedHabits,
    getPendingCreatedHabitsSnapshot,
    getPendingCreatedHabitsSnapshot
  );
}
