/* eslint-disable max-lines */
/**
 * useCreateHabitHandlers - Handle habit creation and editing operations
 *
 * @description
 * Provides mutation handlers for creating and editing habits.
 * Handles validation, reminder scheduling, and API calls.
 *
 * @role Mutation Handler
 * This hook orchestrates the final save action. It:
 * 1. Validates habit name (sanitization + security)
 * 2. Schedules/cancels reminders based on user settings
 * 3. Calls Convex mutations (create or update)
 * 4. Handles errors gracefully
 *
 * @flow Create Habit
 * 1. Validate habit name → sanitize input
 * 2. Call createHabit mutation → get habitId
 * 3. Mark first habit created (for onboarding)
 * 4. Schedule reminder if enabled
 *
 * @flow Edit Habit
 * 1. Validate habit name → sanitize input
 * 2. Update/cancel existing reminder
 * 3. Call updateHabit mutation
 *
 * @security
 * All habit names are validated and sanitized before saving:
 * - Max length enforced (100 chars)
 * - Control characters stripped
 * - Invalid characters rejected
 *
 * @see {@link validateHabitName} - Validation logic
 * @see {@link scheduleReminder} - Reminder scheduling
 * @see {@link useCreateHabitModal} - Calling hook
 *
 * @module CreateHabitModal/hooks
 */
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { formatReminderTime } from '../../../utils/notifications';
import { markFirstHabitCreated } from '../../../hooks/useStreakReminders/useStreakReminderSettings';
import { cancelReminder, scheduleReminder } from './useHabitReminders';
import { validateHabitName } from '../../../utils/validation';
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
        name: sanitizedName,
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
    // Validate habit name
    const validation = validateHabitName(fullHabitName);
    if (!validation.isValid) {
      throw new Error(validation.error ?? 'Invalid habit name');
    }
    const sanitizedName = validation.sanitized;

    try {
      const habitId = await createHabit({
        icon: selectedEmoji ?? undefined,
        iconColor: selectedColor,
        name: sanitizedName,
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
          habitName: sanitizedName,
          reminderTime,
        });
      }
    } catch (error) {
      if (__DEV__) console.error('Failed to create habit:', error);
      throw error;
    }
  }

  return { handleCreate, handleEdit };
}
