/* eslint-disable max-lines */
/**
 * useCreateHabitHandlers - Handle habit creation and editing operations
 *
 * Extracted from useCreateHabitModal to separate mutation logic
 * from the main modal orchestration.
 */
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { formatReminderTime24 } from '../../../utils/notifications';
import { markFirstHabitCreated } from '../../../hooks/useStreakReminders/useStreakReminderSettings';
import { cancelReminder, scheduleReminder } from './useHabitReminders';
import { validateHabitName } from '../../../utils/validation';
import type { Id } from '../../../../convex/_generated/dataModel';
import { optimisticHabitCreationStore } from '../../../features/habits/hooks/optimisticHabitCreationStore';

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
    frequency,
    reminderTime,
    selectedEmoji,
    selectedColor,
    selectedDays,
    dayPhase,
    reminderSound,
  }: EditHabitData): Promise<void> {
    // Validate habit name
    const validation = validateHabitName(fullHabitName);
    if (!validation.isValid) {
      throw new Error(validation.error ?? 'Invalid habit name');
    }
    const sanitizedName = validation.sanitized;

    let finalHasReminders = hasReminders;

    try {
      if (hasReminders) {
        const scheduled = await scheduleReminder({
          habitId: habitToEdit._id,
          habitName: sanitizedName,
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
        color: selectedColor,
        iconColor: selectedColor,
        frequency: frequency || undefined,
        daysOfWeek: selectedDays.length < 7 ? selectedDays : undefined,
        name: sanitizedName,
        notes: habitToEdit.notes ?? '',
        preferredTime: dayPhase ?? undefined,
        remindersEnabled: finalHasReminders,
        reminderSound: finalHasReminders
          ? (reminderSound ?? undefined)
          : undefined,
        reminderTime: finalHasReminders
          ? formatReminderTime24(reminderTime)
          : undefined,
      });
    } catch (error) {
      if (__DEV__) console.error('Failed to edit habit:', error);
      throw error;
    }
  }

  async function handleCreate({
    hasReminders,
    frequency,
    fullHabitName,
    reminderTime,
    selectedEmoji,
    selectedColor,
    selectedDays,
    dayPhase,
    reminderSound,
    strengthAlgorithm,
  }: HabitData): Promise<void> {
    // Validate habit name
    const validation = validateHabitName(fullHabitName);
    if (!validation.isValid) {
      throw new Error(validation.error ?? 'Invalid habit name');
    }
    const sanitizedName = validation.sanitized;
    const formattedReminderTime = hasReminders
      ? formatReminderTime24(reminderTime)
      : undefined;
    const optimisticOperationId = optimisticHabitCreationStore.add({
      color: selectedColor,
      daysOfWeek: selectedDays.length < 7 ? selectedDays : undefined,
      frequency: frequency || undefined,
      icon: selectedEmoji ?? undefined,
      iconColor: selectedColor,
      name: sanitizedName,
      preferredTime: dayPhase ?? undefined,
      reminderSound: hasReminders ? (reminderSound ?? undefined) : undefined,
      reminderTime: formattedReminderTime,
      remindersEnabled: hasReminders,
    });
    let isCreateConfirmed = false;

    try {
      const habitId = await createHabit({
        icon: selectedEmoji ?? undefined,
        iconColor: selectedColor,
        frequency: frequency || undefined,
        daysOfWeek: selectedDays.length < 7 ? selectedDays : undefined,
        name: sanitizedName,
        notes: '',
        preferredTime: dayPhase ?? undefined,
        remindersEnabled: hasReminders,
        reminderSound: hasReminders ? (reminderSound ?? undefined) : undefined,
        reminderTime: formattedReminderTime,
        strengthAlgorithm,
      });
      optimisticHabitCreationStore.confirm(optimisticOperationId);
      isCreateConfirmed = true;

      // Mark first habit creation for deferred notification permission request
      void markFirstHabitCreated();

      if (hasReminders && habitId) {
        await scheduleReminder({
          habitId,
          habitName: sanitizedName,
          reminderTime,
        });
      }
    } catch (error) {
      if (!isCreateConfirmed) {
        optimisticHabitCreationStore.fail(optimisticOperationId);
      }
      if (__DEV__) console.error('Failed to create habit:', error);
      throw error;
    }
  }

  return { handleCreate, handleEdit };
}
