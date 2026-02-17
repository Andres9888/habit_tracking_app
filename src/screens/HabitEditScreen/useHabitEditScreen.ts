import { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { createDateFromTimeString, getDefaultReminderTime } from '../../utils/notifications';
import useHapticFeedback from '../../hooks/useHapticFeedback';
import { useHabitSaveHandler } from './useHabitSaveHandler';
import { useHabitActions } from './useHabitActions';

interface VacationPeriod {
  end: string;
  start: string;
}

interface UseHabitEditScreenProps {
  habitId: Id<'habits'> | null;
  onClose: () => void;
}

export function useHabitEditScreen({ habitId, onClose }: UseHabitEditScreenProps) {
  const { triggerSelection, triggerSuccess } = useHapticFeedback();

  const habit = useQuery(api.habits.get, habitId ? { habitId } : 'skip');
  const settings = useQuery(api.settings.get);
  const isPremium = settings?.hasPremium ?? false;

  const [habitName, setHabitName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>('💪');
  const [selectedColor, setSelectedColor] = useState('#DBEAFE');
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState<Date>(() => getDefaultReminderTime());
  const [vacationMode, setVacationMode] = useState(false);
  const [vacationPeriods, setVacationPeriods] = useState<VacationPeriod[]>([]);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setVacationMode((habit as any).vacationMode ?? false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setVacationPeriods(((habit as any).vacationPeriods as VacationPeriod[] | undefined) ?? []);
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
    isPremium,
    remindersEnabled,
    handleSave,
    selectedEmoji,
    isSaving,
    setHabitName,
    reminderTime,
    selectedColor,
    triggerSelection,
    vacationMode,
    vacationPeriods,
  };
}
