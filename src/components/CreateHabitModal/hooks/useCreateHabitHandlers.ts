/**
 * useCreateHabitHandlers - Handle habit creation and editing operations
 *
 * Extracted from useCreateHabitModal to separate mutation logic
 * from the main modal orchestration.
 */
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { formatReminderTime } from '../../../utils/notifications';
import { markFirstHabitCreated } from '../../../hooks/useStreakReminders/useStreakReminderSettings';
import { cancelReminder, scheduleReminder } from './useHabitReminders';
import type { Id } from '../../../../convex/_generated/dataModel';

interface HabitData {
  dayPhase: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
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
    difficulty?: 'easy' | 'medium' | 'hard';
    notes?: string;
  };
}

export function useCreateHabitHandlers() {
  const createHabit = useMutation(api.habits.create);
  const updateHabit = useMutation(api.habits.update);

  async function handleEdit({
    difficulty,
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
      difficulty,
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
  }

  async function handleCreate({
    difficulty,
    hasReminders,
    fullHabitName,
    reminderTime,
    selectedEmoji,
    selectedColor,
    dayPhase,
    reminderSound,
  }: HabitData): Promise<void> {
    const habitId = await createHabit({
      difficulty,
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
  }

  return { handleCreate, handleEdit };
}
