import type {
  ArchiveHabitOperation,
  CreateHabitOperation,
  OfflineOperation,
  PauseHabitOperation,
  RemoveHabitOperation,
  ReorderHabitsOperation,
  ToggleCompletionOperation,
  UpdateHabitOperation,
} from '../queue';
import {
  archiveHabit,
  createHabit,
  pauseHabit,
  removeHabit,
  reorderHabits,
  toggleCompletion,
  updateHabit,
} from './createSyncExecutorHandlers';
import type { ConvexMutations } from './createSyncExecutor.types';

export type { ConvexMutations } from './createSyncExecutor.types';

/**
 * Creates a sync executor that routes operations to appropriate Convex mutations.
 */
export function createSyncExecutor(mutations: ConvexMutations) {
  return async (operation: OfflineOperation): Promise<void> => {
    switch (operation.type) {
      case 'toggleCompletion': {
        await toggleCompletion(
          operation as ToggleCompletionOperation,
          mutations
        );
        break;
      }
      case 'createHabit': {
        await createHabit(operation as CreateHabitOperation, mutations);
        break;
      }
      case 'updateHabit': {
        await updateHabit(operation as UpdateHabitOperation, mutations);
        break;
      }
      case 'archiveHabit': {
        await archiveHabit(operation as ArchiveHabitOperation, mutations);
        break;
      }
      case 'pauseHabit': {
        await pauseHabit(operation as PauseHabitOperation, mutations);
        break;
      }
      case 'removeHabit': {
        await removeHabit(operation as RemoveHabitOperation, mutations);
        break;
      }
      case 'reorderHabits': {
        await reorderHabits(operation as ReorderHabitsOperation, mutations);
        break;
      }
      default: {
        throw new Error('Unknown operation type');
      }
    }
  };
}
