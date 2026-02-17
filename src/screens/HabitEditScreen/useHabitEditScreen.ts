import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import type { FrequencyValue } from '../../components/FrequencyPicker';
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
  const [frequency, setFrequency] = useState<string>('daily');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [timesPerWeek, setTimesPerWeek] = useState<number>(3);
  const [everyXDays, setEveryXDays] = useState<number>(2);

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
      setFrequency(habit.frequency ?? 'daily');
      setDaysOfWeek(habit.daysOfWeek ?? []);
      setTimesPerWeek(habit.timesPerWeek ?? 3);
      setEveryXDays(habit.everyXDays ?? 2);
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
    frequency,
    daysOfWeek,
    timesPerWeek,
    everyXDays,
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

  const frequencyValue: FrequencyValue = useMemo(
    () => ({
      frequency: (frequency || 'daily') as FrequencyValue['frequency'],
      daysOfWeek,
      timesPerWeek,
      everyXDays,
    }),
    [frequency, daysOfWeek, timesPerWeek, everyXDays]
  );

  const handleFrequencyChange = useCallback((val: FrequencyValue) => {
    setFrequency(val.frequency);
    if (val.daysOfWeek !== undefined) setDaysOfWeek(val.daysOfWeek);
    if (val.timesPerWeek !== undefined) setTimesPerWeek(val.timesPerWeek);
    if (val.everyXDays !== undefined) setEveryXDays(val.everyXDays);
  }, []);

  return {
    frequencyValue,
    habitName,
    handleColorSelect,
    handleDelete,
    handleFrequencyChange,
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
