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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState<Date>(() => getDefaultReminderTime());

  useEffect(() => {
    if (habit) {
      const parts = (habit.name ?? '').split(' ');
      const emoji = parts[0] ?? '💪';
      const name = parts.slice(1).join(' ');

      setHabitName(name || habit.name || '');
      setSelectedEmoji(emoji || '💪');
      setSelectedColor(habit.color || habit.iconColor || '#10B981');
      setSelectedCategory(habit.category ?? null);
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
    selectedCategory,
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

  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
  }, []);

  return {
    habitName,
    handleCategorySelect,
    handleColorSelect,
    handleDelete,
    handleEmojiSelect,
    handleArchive,
    handleReminderTimeChange,
    handleReminderToggle,
    isLoading: habitId != null && habit === undefined,
    remindersEnabled,
    handleSave,
    selectedCategory,
    selectedEmoji,
    isSaving,
    setHabitName,
    reminderTime,
    selectedColor,
    triggerSelection,
  };
}
