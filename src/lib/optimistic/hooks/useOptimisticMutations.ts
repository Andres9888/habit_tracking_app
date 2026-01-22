/**
 * Optimistic mutation wrapper hooks
 */

import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import { optimisticStore } from '../store';
import type { ToggleOperationPayload, ArchiveOperationPayload } from '../types';

/**
 * Creates an optimistic toggle mutation wrapper
 */
export function useOptimisticToggleMutation(
  serverMutation: (args: {
    habitId: Id<'habits'>;
    date: string;
  }) => Promise<void>,
  getCurrentStatus: (habitId: Id<'habits'>, date: string) => boolean
) {
  return useCallback(
    async (args: { habitId: Id<'habits'>; date: string }) => {
      const currentlyCompleted = getCurrentStatus(args.habitId, args.date);
      const toCompleted = !currentlyCompleted;

      const payload: ToggleOperationPayload = {
        date: args.date,
        habitId: args.habitId,
        toCompleted,
      };

      const operationId = optimisticStore.addToggle(payload);

      try {
        await serverMutation(args);
        optimisticStore.confirm(operationId);
      } catch (error) {
        optimisticStore.fail(operationId, error as Error);
        throw error;
      }
    },
    [serverMutation, getCurrentStatus]
  );
}

/**
 * Creates an optimistic archive mutation wrapper
 */
export function useOptimisticArchiveMutation(
  archiveMutation: (args: { habitId: Id<'habits'> }) => Promise<void>,
  getHabitName: (habitId: Id<'habits'>) => string
) {
  return useCallback(
    async (habitId: Id<'habits'>) => {
      const habitName = getHabitName(habitId);

      const payload: ArchiveOperationPayload = {
        habitId,
        habitName,
        toArchived: true,
      };

      const operationId = optimisticStore.addArchive(payload);

      try {
        await archiveMutation({ habitId });
        optimisticStore.confirm(operationId);
      } catch (error) {
        optimisticStore.fail(operationId, error as Error);
        throw error;
      }
    },
    [archiveMutation, getHabitName]
  );
}

/**
 * Creates an optimistic unarchive mutation wrapper
 */
export function useOptimisticUnarchiveMutation(
  unarchiveMutation: (args: { habitId: Id<'habits'> }) => Promise<void>,
  getHabitName: (habitId: Id<'habits'>) => string
) {
  return useCallback(
    async (habitId: Id<'habits'>) => {
      const habitName = getHabitName(habitId);

      const payload: ArchiveOperationPayload = {
        habitId,
        habitName,
        toArchived: false,
      };

      const operationId = optimisticStore.addArchive(payload);

      try {
        await unarchiveMutation({ habitId });
        optimisticStore.confirm(operationId);
      } catch (error) {
        optimisticStore.fail(operationId, error as Error);
        throw error;
      }
    },
    [unarchiveMutation, getHabitName]
  );
}
