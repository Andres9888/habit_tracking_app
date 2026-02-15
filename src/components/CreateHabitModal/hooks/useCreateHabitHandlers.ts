/**
 * useCreateHabitHandlers - Handle habit creation and editing operations
 *
 * Extracted from useCreateHabitModal to separate mutation logic
 * from the main modal orchestration.
 *
 * Updated by Opus: added network error detection with clear user messaging.
 */
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { formatReminderTime } from '../../../utils/notifications';
import { markFirstHabitCreated } from '../../../hooks/useStreakReminders/useStreakReminderSettings';
import { cancelReminder, scheduleReminder } from './useHabitReminders';
import { isNetworkError } from '../../../lib/offline';
import type { Id } from '../../../../convex/_generated/dataModel';

interface HabitData {
  dayPhase: string | null;
  fullHabitName: string;
  hasReminders: boolean;
  reminderSound?: string | null;
  reminderTime: Date;
  selectedColor: string;
  selectedEmoji: string | null;
}

interface EditHabitData extends HabitData {
  habitToEdit: {
    _id: Id<'habits'>;
    notes?: string;
  };
}

export function useCreateHabitHandlers() {
  const createHabit = useMutation(api.habits.create);
  const updateHabit = useMutation(api.habits.update);

  async function handleEdit({
    habitToEdit,
    hasReminders,
    fullHabitName,
    reminderTime,
    selectedEmoji,
    selectedColor,
    dayPhase,
    reminderSound,
  }: EditHabitData): Promise<void> {
    let finalHasReminders = hasReminders;

    try {
      if (hasReminders) {
        const scheduled = await scheduleReminder({
          habitId: habitToEdit._id,
          habitName: fullHabitName,
          reminderTime,
        });
        if (!scheduled) {
          finalHasReminders = false;
          await cancelReminder(habitToEdit._id);
        }
      } else {
        await cancelReminder(habitToEdit._id);
      }

      await updateHabit({
        habitId: habitToEdit._id,
        icon: selectedEmoji ?? undefined,
        iconColor: selectedColor,
        name: fullHabitName,
        notes: habitToEdit.notes ?? '',
        preferredTime: dayPhase ?? undefined,
        remindersEnabled: finalHasReminders,
        reminderSound: finalHasReminders ? (reminderSound ?? undefined) : undefined,
        reminderTime: finalHasReminders
          ? formatReminderTime(reminderTime)
          : undefined,
      });
    } catch (error) {
      if (__DEV__) console.error('Failed to edit habit:', error);
      if (isNetworkError(error)) {
        throw new Error(
          'Could not save changes. Check your connection and try again.'
        );
      }
      throw error;
    }
  }

  async function handleCreate({
    hasReminders,
    fullHabitName,
    reminderTime,
    selectedEmoji,
    selectedColor,
    dayPhase,
    reminderSound,
  }: HabitData): Promise<void> {
    try {
      const habitId = await createHabit({
        icon: selectedEmoji ?? undefined,
        iconColor: selectedColor,
        name: fullHabitName,
        notes: '',
        preferredTime: dayPhase ?? undefined,
        remindersEnabled: hasReminders,
        reminderSound: hasReminders ? (reminderSound ?? undefined) : undefined,
        reminderTime: hasReminders ? formatReminderTime(reminderTime) : undefined,
      });

      // Mark first habit creation for deferred notification permission request
      void markFirstHabitCreated();

      if (hasReminders && habitId) {
        await scheduleReminder({
          habitId,
          habitName: fullHabitName,
          reminderTime,
        });
      }
    } catch (error) {
      if (__DEV__) console.error('Failed to create habit:', error);
      if (isNetworkError(error)) {
        throw new Error(
          'Could not create habit. Check your connection and try again.'
        );
      }
      throw error;
    }
  }

  return { handleCreate, handleEdit };
}
