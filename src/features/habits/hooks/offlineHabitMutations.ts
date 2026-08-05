/**
 * Offline-aware habit mutation helpers (delete, pause).
 *
 * Shared by the list (useHabitDelete / useHabitsArchive) and the detail modal
 * (useHabitModalHandlers) so both survive offline via the queue + optimistic
 * store. Kept as plain async helpers to avoid hook-identity churn on memo'd
 * habit cards.
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type { CreateHabitPayload, UpdateHabitPayload } from '../../../lib/offline/queue';
import { getOfflineQueueManager } from '../../../lib/offline';
import { optimisticStore, runOfflineAwareMutation } from '../../../lib/optimistic';
import { cancelHabitReminder } from '../../../utils/notifications';
import {
  isOptimisticHabitId,
  optimisticHabitCreationStore,
} from './optimisticHabitCreationStore';
import { optimisticHabitUpdateStore } from './optimisticHabitUpdateStore';

/**
 * Queue a habit edit and mirror it optimistically so it renders before sync.
 * Coalesces onto a pending create/update via the queue manager.
 */
export function enqueueHabitUpdate(
  habitId: Id<'habits'>,
  updates: UpdateHabitPayload['updates']
): void {
  const result = getOfflineQueueManager().enqueue('updateHabit', {
    habitId,
    updates,
  });
  optimisticHabitUpdateStore.addWithId(
    result.operationId ?? `optimistic_update_${habitId}`,
    habitId,
    updates
  );
}

/**
 * Cancel a not-yet-synced create (and any edits coalesced onto it) entirely
 * locally — there is nothing on the server to delete.
 */
export function cancelQueuedCreate(tempId: string): void {
  const manager = getOfflineQueueManager();
  for (const op of manager.getState().operations) {
    const isCreate =
      op.type === 'createHabit' &&
      (op.payload as CreateHabitPayload).tempId === tempId;
    const isUpdate =
      op.type === 'updateHabit' &&
      (op.payload as UpdateHabitPayload).habitId === tempId;
    if (isCreate || isUpdate) {
      manager.remove(op.id);
      optimisticHabitCreationStore.fail(op.id);
      optimisticHabitUpdateStore.fail(op.id);
    }
  }
}

interface DeleteParams {
  habitId: Id<'habits'>;
  habitName: string;
  isOnline: boolean;
  removeMutation: (args: { habitId: Id<'habits'> }) => Promise<unknown>;
  onError: (error: Error) => void;
}

export async function deleteHabitOffline(params: DeleteParams): Promise<void> {
  const { habitId, habitName, isOnline, removeMutation, onError } = params;

  if (isOptimisticHabitId(habitId)) {
    cancelQueuedCreate(habitId);
    return;
  }

  await cancelHabitReminder(String(habitId));
  const archivePayload = { habitId, habitName, toArchived: true as const };
  await runOfflineAwareMutation({
    addOptimistic: () => optimisticStore.addArchive(archivePayload),
    addOptimisticWithId: (id) =>
      optimisticStore.addArchiveWithId(id, archivePayload),
    isOnline,
    onError,
    queuePayload: { habitId, habitName },
    queueType: 'removeHabit',
    serverMutation: () => removeMutation({ habitId }),
  });
}

interface PauseParams {
  habitId: Id<'habits'>;
  habitName: string;
  isOnline: boolean;
  pauseMutation: (args: { habitId: Id<'habits'> }) => Promise<unknown>;
  onError: (error: Error) => void;
}

export async function pauseHabitOffline(params: PauseParams): Promise<void> {
  const { habitId, habitName, isOnline, pauseMutation, onError } = params;
  const payload = { habitId, habitName, toPaused: true as const };
  await runOfflineAwareMutation({
    addOptimistic: () => optimisticStore.addPause(payload),
    addOptimisticWithId: (id) => optimisticStore.addPauseWithId(id, payload),
    isOnline,
    onError,
    queuePayload: payload,
    queueType: 'pauseHabit',
    serverMutation: () => pauseMutation({ habitId }),
  });
}
