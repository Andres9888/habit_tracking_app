/**
 * useOfflineHabitMutations - Offline-aware habit mutations
 *
 * ⚠️ WARNING: 300 LINES - CONSIDER SPLITTING
 * This hook is quite large. Consider extracting into separate hooks:
 * - useCreateHabit
 * - useUpdateHabit
 * - useArchiveHabit
 * - usePauseHabit
 * - useRemoveHabit
 *
 * Wraps Convex habit mutations with offline queue support.
 * When offline, operations are queued for later sync.
 * When online, operations execute immediately with fallback to queue on error.
 *
 * @returns Object containing mutation methods and online status
 *
 * @example
 * ```tsx
 * const { createHabit, updateHabit, isOnline } = useOfflineHabitMutations();
 *
 * // Create a habit (works offline)
 * const result = await createHabit({
 *   name: 'Morning meditation',
 *   icon: '🧘',
 *   remindersEnabled: true,
 * });
 *
 * if (result.queued) {
 *   toast.info('Will sync when back online');
 * }
 *
 * // Update a habit
 * await updateHabit({
 *   habitId: habit._id,
 *   name: 'Evening meditation',
 * });
 * ```
 */

import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { useIsOnline } from '../contexts/NetworkStatusContext';
import { getOfflineQueueManager, isNetworkError } from '../lib/offline';

interface CreateHabitArgs {
  name: string;
  icon?: string;
  color?: string;
  iconColor?: string;
  notes?: string;
  preferredTime?: string;
  remindersEnabled?: boolean;
  reminderTime?: string;
  reminderSound?: string;
}

interface UpdateHabitArgs {
  habitId: Id<'habits'>;
  name?: string;
  icon?: string;
  color?: string;
  iconColor?: string;
  notes?: string;
  preferredTime?: string;
  remindersEnabled?: boolean;
  reminderTime?: string;
  reminderSound?: string;
}

interface MutationResult {
  /** Whether operation was queued for offline sync */
  queued: boolean;
  /** ID of offline queue operation (if queued) */
  offlineOperationId?: string;
  /** Server result (if executed immediately) */
  result?: any;
  /** Temporary ID for optimistic updates (create operations only) */
  tempId?: string;
}

/**
 * Hook providing offline-aware habit mutations
 */
export function useOfflineHabitMutations() {
  const isOnline = useIsOnline();
  const createHabitMutation = useMutation(api.habits.create);
  const updateHabitMutation = useMutation(api.habits.update);
  const archiveHabitMutation = useMutation(api.habits.archive);
  const pauseHabitMutation = useMutation(api.habits.pause);
  const removeHabitMutation = useMutation(api.habits.remove);

  /**
   * Create a new habit with offline support
   */
  const createHabit = useCallback(
    async (args: CreateHabitArgs): Promise<MutationResult> => {
      const queueManager = getOfflineQueueManager();
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      // If offline, queue immediately
      if (!isOnline) {
        const queueResult = queueManager.enqueue('createHabit', {
          ...args,
          tempId,
        });
        return {
          queued: queueResult.success,
          offlineOperationId: queueResult.operationId,
          tempId,
        };
      }

      // Try online execution
      try {
        const result = await createHabitMutation(args);
        return { queued: false, result };
      } catch (error) {
        // Network error during execution → queue it
        if (isNetworkError(error)) {
          const queueResult = queueManager.enqueue('createHabit', {
            ...args,
            tempId,
          });
          return {
            queued: queueResult.success,
            offlineOperationId: queueResult.operationId,
            tempId,
          };
        }
        // Non-network error → propagate
        throw error;
      }
    },
    [isOnline, createHabitMutation]
  );

  /**
   * Update an existing habit with offline support
   */
  const updateHabit = useCallback(
    async (args: UpdateHabitArgs): Promise<MutationResult> => {
      const queueManager = getOfflineQueueManager();

      // If offline, queue immediately
      if (!isOnline) {
        const queueResult = queueManager.enqueue('updateHabit', {
          habitId: args.habitId,
          updates: {
            name: args.name,
            icon: args.icon,
            color: args.color,
            iconColor: args.iconColor,
            notes: args.notes,
            preferredTime: args.preferredTime,
            remindersEnabled: args.remindersEnabled,
            reminderTime: args.reminderTime,
            reminderSound: args.reminderSound,
          },
        });
        return {
          queued: queueResult.success,
          offlineOperationId: queueResult.operationId,
        };
      }

      // Try online execution
      try {
        const result = await updateHabitMutation(args);
        return { queued: false, result };
      } catch (error) {
        // Network error during execution → queue it
        if (isNetworkError(error)) {
          const queueResult = queueManager.enqueue('updateHabit', {
            habitId: args.habitId,
            updates: {
              name: args.name,
              icon: args.icon,
              color: args.color,
              iconColor: args.iconColor,
              notes: args.notes,
              preferredTime: args.preferredTime,
              remindersEnabled: args.remindersEnabled,
              reminderTime: args.reminderTime,
              reminderSound: args.reminderSound,
            },
          });
          return {
            queued: queueResult.success,
            offlineOperationId: queueResult.operationId,
          };
        }
        // Non-network error → propagate
        throw error;
      }
    },
    [isOnline, updateHabitMutation]
  );

  /**
   * Archive a habit with offline support
   */
  const archiveHabit = useCallback(
    async (habitId: Id<'habits'>): Promise<MutationResult> => {
      const queueManager = getOfflineQueueManager();

      // If offline, queue immediately
      if (!isOnline) {
        const queueResult = queueManager.enqueue('archiveHabit', { habitId });
        return {
          queued: queueResult.success,
          offlineOperationId: queueResult.operationId,
        };
      }

      // Try online execution
      try {
        const result = await archiveHabitMutation({ habitId });
        return { queued: false, result };
      } catch (error) {
        if (isNetworkError(error)) {
          const queueResult = queueManager.enqueue('archiveHabit', { habitId });
          return {
            queued: queueResult.success,
            offlineOperationId: queueResult.operationId,
          };
        }
        throw error;
      }
    },
    [isOnline, archiveHabitMutation]
  );

  /**
   * Pause a habit with offline support
   */
  const pauseHabit = useCallback(
    async (habitId: Id<'habits'>): Promise<MutationResult> => {
      const queueManager = getOfflineQueueManager();

      if (!isOnline) {
        const queueResult = queueManager.enqueue('pauseHabit', { habitId });
        return {
          queued: queueResult.success,
          offlineOperationId: queueResult.operationId,
        };
      }

      try {
        const result = await pauseHabitMutation({ habitId });
        return { queued: false, result };
      } catch (error) {
        if (isNetworkError(error)) {
          const queueResult = queueManager.enqueue('pauseHabit', { habitId });
          return {
            queued: queueResult.success,
            offlineOperationId: queueResult.operationId,
          };
        }
        throw error;
      }
    },
    [isOnline, pauseHabitMutation]
  );

  /**
   * Remove a habit with offline support
   */
  const removeHabit = useCallback(
    async (habitId: Id<'habits'>): Promise<MutationResult> => {
      const queueManager = getOfflineQueueManager();

      if (!isOnline) {
        const queueResult = queueManager.enqueue('removeHabit', { habitId });
        return {
          queued: queueResult.success,
          offlineOperationId: queueResult.operationId,
        };
      }

      try {
        const result = await removeHabitMutation({ habitId });
        return { queued: false, result };
      } catch (error) {
        if (isNetworkError(error)) {
          const queueResult = queueManager.enqueue('removeHabit', { habitId });
          return {
            queued: queueResult.success,
            offlineOperationId: queueResult.operationId,
          };
        }
        throw error;
      }
    },
    [isOnline, removeHabitMutation]
  );

  return {
    createHabit,
    updateHabit,
    archiveHabit,
    pauseHabit,
    removeHabit,
    isOnline,
  };
}
