/**
 * @fileoverview useHabitEditScreen - Business logic hook for HabitEditScreen
 * 
 * **Purpose:**
 * Manages habit editing state, data loading, and save/delete operations
 * 
 * **Responsibilities:**
 * - Fetches existing habit data from Convex
 * - Initializes form state (name, emoji, color, reminders)
 * - Parses emoji from habit name (format: "emoji name")
 * - Manages form inputs (name, emoji, color, reminder settings)
 * - Delegates save operation to useHabitSaveHandler
 * - Delegates delete/archive to useHabitActions
 * - Triggers haptic feedback on user actions
 * - Handles success callbacks (close modal, trigger haptics)
 * 
 * **State flow:**
 * 1. Load habit data (useQuery)
 * 2. Parse habit fields (emoji, name, color, reminders)
 * 3. User edits form
 * 4. Save → useHabitSaveHandler → success → haptic + close
 * 5. Delete/Archive → useHabitActions → success → haptic + close
 * 
 * **Props:**
 * - habitId: ID of habit to edit (null for create mode, though this hook is edit-only)
 * - onClose: Callback to close modal on success/cancel
 * 
 * **Returns:**
 * Form state, handlers, loading/saving flags, and haptic trigger
 */
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { createDateFromTimeString, getDefaultReminderTime } from '../../utils/notifications';
import useHapticFeedback from '../../hooks/useHapticFeedback';
import { useHabitSaveHandler } from './useHabitSaveHandler';
import { useHabitActions } from './useHabitActions';

interface UseHabitEditScreenProps {
  habitId: Id<'habits'> | null;
  onClose: () => void;
}

export function useHabitEditScreen({ habitId, onClose }: UseHabitEditScreenProps) {
  const { triggerSelection, triggerSuccess } = useHapticFeedback();

  const habit = useQuery(api.habits.get, habitId ? { habitId } : 'skip');

  const [habitName, setHabitName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>('💪');
  const [selectedColor, setSelectedColor] = useState('#DBEAFE');
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState<Date>(() => getDefaultReminderTime());

  useEffect(() => {
    if (habit) {
      const parts = habit.name.split(' ');
      const emoji = parts[0];
      const name = parts.slice(1).join(' ');

      setHabitName(name || habit.name);
      setSelectedEmoji(emoji || '💪');
      setSelectedColor(habit.color || habit.iconColor || '#10B981');
      setRemindersEnabled(habit.remindersEnabled ?? false);
      setReminderTime(createDateFromTimeString(habit.reminderTime, getDefaultReminderTime()));
    }
  }, [habit]);

  const { handleSave, isSaving } = useHabitSaveHandler({
    habitId,
    habitName,
    onSuccess: () => {
      triggerSuccess();
      onClose();
    },
    remindersEnabled,
    reminderTime,
    selectedColor,
    selectedEmoji,
  });

  const { handleDelete, handleArchive } = useHabitActions({
    habitId,
    onSuccess: () => {
      triggerSelection();
      onClose();
    },
  });

  const handleEmojiSelect = useCallback((emoji: string | null) => {
    setSelectedEmoji(emoji);
  }, []);

  const handleColorSelect = useCallback((color: string) => {
    triggerSelection();
    setSelectedColor(color);
  }, [triggerSelection]);

  const handleReminderToggle = useCallback((enabled: boolean) => {
    setRemindersEnabled(enabled);
  }, []);

  const handleReminderTimeChange = useCallback((time: Date) => {
    setReminderTime(time);
  }, []);

  return {
    habitName,
    handleColorSelect,
    handleDelete,
    handleEmojiSelect,
    handleArchive,
    handleReminderTimeChange,
    handleReminderToggle,
    isLoading: habitId != null && habit === undefined,
    remindersEnabled,
    handleSave,
    selectedEmoji,
    isSaving,
    setHabitName,
    reminderTime,
    selectedColor,
    triggerSelection,
  };
}
