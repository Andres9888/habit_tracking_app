/* eslint-disable max-lines */
/**
 * useCreateHabitHandlers - Handle habit creation and editing operations
 *
 * Extracted from useCreateHabitModal to separate mutation logic
 * from the main modal orchestration. Both paths are offline-aware: when the
 * device is offline (or a request fails mid-flight with a network error) the
 * mutation is queued and mirrored optimistically instead of erroring out.
 */
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { formatReminderTime24 } from '../../../utils/notifications';
import { markFirstHabitCreated } from '../../../hooks/useStreakReminders/useStreakReminderSettings';
import { useUserDefaultProgressEmojis } from '../../../hooks/useProgressEmojis';
import { cancelReminder, scheduleReminder } from './useHabitReminders';
import { validateHabitName } from '../../../utils/validation';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { ProgressEmojiSet } from '../../../utils/progressEmojis';
import { optimisticHabitCreationStore } from '../../../features/habits/hooks/optimisticHabitCreationStore';
import { enqueueHabitUpdate } from '../../../features/habits/hooks/offlineHabitMutations';
import { getOfflineQueueManager, isNetworkError } from '../../../lib/offline';
import type { CreateHabitPayload } from '../../../lib/offline/queue';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import {
  buildCreatePayload,
  generateTempHabitId,
  toCreateMutationArgs,
  toOptimisticCreateInput,
} from './createHabitHandlerHelpers';
import { buildEditUpdates } from './buildEditUpdates';

interface HabitData {
  dayPhase: string | null;
  frequency: string;
  fullHabitName: string;
  hasReminders: boolean;
  reminderSound?: string | null;
  reminderTime: Date;
  selectedColor: string;
  selectedDays: number[];
  selectedEmoji: string | null;
  strengthAlgorithm: 'forgiving' | 'balanced' | 'strict';
  progressEmojis: ProgressEmojiSet | undefined;
  streakGoal: number;
}

interface EditHabitData extends HabitData {
  habitToEdit: {
    _id: Id<'habits'>;
    notes?: string;
  };
}

function queueCreate(
  payload: CreateHabitPayload,
  optimisticInput: ReturnType<typeof toOptimisticCreateInput>
): void {
  const result = getOfflineQueueManager().enqueue('createHabit', payload);
  optimisticHabitCreationStore.addWithId(
    result.operationId ?? payload.tempId,
    optimisticInput
  );
}

export function useCreateHabitHandlers() {
  const createHabit = useMutation(api.habits.create);
  const updateHabit = useMutation(api.habits.update);
  const isOnline = useIsOnline();
  // Snapshot the user's current global default at create-time so future
  // changes to "Default growth icons" in Settings never rewrite habits
  // already on the list. Existing habits keep whatever they had.
  const userDefaultEmojis = useUserDefaultProgressEmojis();

  async function handleEdit(data: EditHabitData): Promise<void> {
    const validation = validateHabitName(data.fullHabitName);
    if (!validation.isValid) {
      throw new Error(validation.error ?? 'Invalid habit name');
    }
    const sanitizedName = validation.sanitized;
    const habitId = data.habitToEdit._id;

    let finalHasReminders = data.hasReminders;
    if (data.hasReminders) {
      const scheduled = await scheduleReminder({
        habitId,
        habitName: sanitizedName,
        reminderTime: data.reminderTime,
      });
      if (!scheduled) {
        finalHasReminders = false;
        await cancelReminder(habitId);
      }
    } else {
      await cancelReminder(habitId);
    }

    const updates = buildEditUpdates({
      dayPhase: data.dayPhase,
      finalHasReminders,
      formattedReminderTime: finalHasReminders
        ? formatReminderTime24(data.reminderTime)
        : undefined,
      frequency: data.frequency,
      notes: data.habitToEdit.notes ?? '',
      progressEmojis: data.progressEmojis,
      reminderSound: data.reminderSound,
      sanitizedName,
      selectedColor: data.selectedColor,
      selectedDays: data.selectedDays,
      selectedEmoji: data.selectedEmoji,
      streakGoal: data.streakGoal,
      strengthAlgorithm: data.strengthAlgorithm,
    });

    if (!isOnline) {
      enqueueHabitUpdate(habitId, updates);
      return;
    }

    try {
      await updateHabit({ habitId, ...updates });
    } catch (error) {
      if (isNetworkError(error)) {
        enqueueHabitUpdate(habitId, updates);
        return;
      }
      if (__DEV__) console.error('Failed to edit habit:', error);
      throw error;
    }
  }

  async function handleCreate(data: HabitData): Promise<void> {
    const validation = validateHabitName(data.fullHabitName);
    if (!validation.isValid) {
      throw new Error(validation.error ?? 'Invalid habit name');
    }
    const sanitizedName = validation.sanitized;
    const formattedReminderTime = data.hasReminders
      ? formatReminderTime24(data.reminderTime)
      : undefined;
    const payload = buildCreatePayload({
      dayPhase: data.dayPhase,
      formattedReminderTime,
      frequency: data.frequency,
      hasReminders: data.hasReminders,
      progressEmojis: data.progressEmojis ?? userDefaultEmojis,
      reminderSound: data.reminderSound,
      sanitizedName,
      selectedColor: data.selectedColor,
      selectedDays: data.selectedDays,
      selectedEmoji: data.selectedEmoji,
      streakGoal: data.streakGoal,
      strengthAlgorithm: data.strengthAlgorithm,
      tempId: generateTempHabitId(),
    });
    const optimisticInput = toOptimisticCreateInput(payload);

    // Offline: queue + render the pending habit; reminders activate after sync.
    if (!isOnline) {
      queueCreate(payload, optimisticInput);
      void markFirstHabitCreated();
      return;
    }

    const optimisticOperationId =
      optimisticHabitCreationStore.add(optimisticInput);
    let isCreateConfirmed = false;

    try {
      const habitId = await createHabit(toCreateMutationArgs(payload));
      optimisticHabitCreationStore.confirm(optimisticOperationId);
      isCreateConfirmed = true;

      // Mark first habit creation for deferred notification permission request
      void markFirstHabitCreated();

      if (data.hasReminders && habitId) {
        await scheduleReminder({
          habitId,
          habitName: sanitizedName,
          reminderTime: data.reminderTime,
        });
      }
    } catch (error) {
      if (isNetworkError(error)) {
        optimisticHabitCreationStore.fail(optimisticOperationId);
        queueCreate(payload, optimisticInput);
        void markFirstHabitCreated();
        return;
      }
      if (!isCreateConfirmed) {
        optimisticHabitCreationStore.fail(optimisticOperationId);
      }
      if (__DEV__) console.error('Failed to create habit:', error);
      throw error;
    }
  }

  return { handleCreate, handleEdit };
}
