import { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { createDateFromTimeString, getDefaultReminderTime } from '../../utils/notifications';
import useHapticFeedback from '../../hooks/useHapticFeedback';
import { useHabitSaveHandler } from './useHabitSaveHandler';
import { useHabitActions } from './useHabitActions';

export type HabitDifficulty = 'easy' | 'medium' | 'hard';

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
  const [difficulty, setDifficulty] = useState<HabitDifficulty>('medium');

  useEffect(() => {
    if (habit) {
      const parts = (habit.name ?? '').split(' ');
      const emoji = parts[0] ?? '💪';
      const name = parts.slice(1).join(' ');

      setHabitName(name || habit.name || '');
      setSelectedEmoji(emoji || '💪');
      setSelectedColor(habit.color || habit.iconColor || '#10B981');
      setRemindersEnabled(habit.remindersEnabled ?? false);
      setReminderTime(createDateFromTimeString(habit.reminderTime, getDefaultReminderTime()));
      setDifficulty(habit.difficulty || 'medium');
    }
  }, [habit]);

  const { handleSave, isSaving } = useHabitSaveHandler({
    habitId,
    habitName,
    difficulty,
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
    difficulty,
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
    setDifficulty,
    setHabitName,
    reminderTime,
    selectedColor,
    triggerSelection,
  };
}
