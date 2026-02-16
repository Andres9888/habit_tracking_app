import { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import type { FrequencyType } from '../../components/CreateHabitModal/components/FrequencyPicker';
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
  const [frequency, setFrequency] = useState<FrequencyType>('daily');
  const [frequencyCount, setFrequencyCount] = useState(3);
  const [customDays, setCustomDays] = useState<number[]>([1, 2, 3, 4, 5]);

  useEffect(() => {
    if (habit) {
      const parts = habit.name.split(' ');
      const emoji = parts[0];
      const name = parts.slice(1).join(' ');

      setHabitName(name || habit.name);
      setSelectedEmoji(emoji || '💪');
      setSelectedColor(habit.iconColor || '#DBEAFE');
      setRemindersEnabled(habit.remindersEnabled ?? false);
      setReminderTime(createDateFromTimeString(habit.reminderTime, getDefaultReminderTime()));
      setFrequency((habit.frequency as FrequencyType) || 'daily');
      setFrequencyCount(habit.frequencyCount || 3);
      setCustomDays(habit.daysOfWeek || [1, 2, 3, 4, 5]);
    }
  }, [habit]);

  const { handleSave, isSaving } = useHabitSaveHandler({
    customDays,
    frequency,
    frequencyCount,
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

  const handleFrequencyChange = useCallback((freq: FrequencyType, count?: number, days?: number[]) => {
    setFrequency(freq);
    if (count !== undefined) setFrequencyCount(count);
    if (days !== undefined) setCustomDays(days);
  }, []);

  const handleCustomDaysChange = useCallback((days: number[]) => {
    setCustomDays(days);
  }, []);

  const handleFrequencyCountChange = useCallback((count: number) => {
    setFrequencyCount(count);
  }, []);

  return {
    customDays,
    frequency,
    frequencyCount,
    habitName,
    handleColorSelect,
    handleCustomDaysChange,
    handleDelete,
    handleEmojiSelect,
    handleFrequencyChange,
    handleFrequencyCountChange,
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
