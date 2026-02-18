/**
 * useOfflineHabitMutations - Offline-aware habit mutations (REFACTORED)
 *
 * Uses the offlineMutationFactory to eliminate duplicate logic.
 * Reduced from 300 to ~120 lines.
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

import { useCallback, useMemo } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { useIsOnline } from '../contexts/NetworkStatusContext';
import { createOfflineMutation, type MutationResult } from './offlineMutationFactory';

// Reuse interface from original but consolidate
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

interface ArchiveHabitArgs {
  habitId: Id<'habits'>;
  archived: boolean;
}

interface PauseHabitArgs {
  habitId: Id<'habits'>;
  paused: boolean;
  pauseReason?: string;
}

interface RemoveHabitArgs {
  habitId: Id<'habits'>;
}

/**
 * Hook providing offline-aware habit mutations
 * Uses factory pattern to reduce duplication
 */
export function useOfflineHabitMutations() {
  const isOnline = useIsOnline();
  
  // Convex mutations
  const createHabitMutation = useMutation(api.habits.create);
  const updateHabitMutation = useMutation(api.habits.update);
  const archiveHabitMutation = useMutation(api.habits.archive);
  const pauseHabitMutation = useMutation(api.habits.pause);
  const removeHabitMutation = useMutation(api.habits.remove);

  // Helper to generate temp IDs for optimistic updates
  const generateTempId = useCallback(() => {
    return `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }, []);

  // Create offline-aware mutation functions using factory
  // This eliminates ~200 lines of duplicate error handling code
  const createHabit = useMemo(
    () =>
      createOfflineMutation(
        createHabitMutation,
        'createHabit',
        isOnline,
        () => ({ tempId: generateTempId() }) // For optimistic updates
      ),
    [isOnline, createHabitMutation, generateTempId]
  );

  const updateHabit = useMemo(
    () =>
      createOfflineMutation(updateHabitMutation, 'updateHabit', isOnline),
    [isOnline, updateHabitMutation]
  );

  const archiveHabit = useMemo(
    () =>
      createOfflineMutation(archiveHabitMutation, 'archiveHabit', isOnline),
    [isOnline, archiveHabitMutation]
  );

  const pauseHabit = useMemo(
    () =>
      createOfflineMutation(pauseHabitMutation, 'pauseHabit', isOnline),
    [isOnline, pauseHabitMutation]
  );

  const removeHabit = useMemo(
    () =>
      createOfflineMutation(removeHabitMutation, 'removeHabit', isOnline),
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

export type { MutationResult };
