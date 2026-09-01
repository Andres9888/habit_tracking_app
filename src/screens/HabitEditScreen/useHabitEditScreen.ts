/* eslint-disable max-lines */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import type { Habit } from '../../features/habits/types';
import {
  createDateFromTimeString,
  getDefaultReminderTime,
} from '../../utils/notifications';
import useHapticFeedback from '../../hooks/useHapticFeedback';
import type { ProgressEmojiSet } from '../../utils/progressEmojis';
import { useHabitSaveHandler } from './useHabitSaveHandler';
import { useHabitActions } from './useHabitActions';
import { parseHabitName } from '../../components/CreateHabitModal/utils';

interface UseHabitEditScreenProps {
  habitId: Id<'habits'> | null;
  initialHabit?: Habit | null;
  onClose: () => void;
  onHabitRemoved?: () => void;
}

type StrengthAlgorithm = 'forgiving' | 'balanced' | 'strict';
const DEFAULT_EMOJI = '💪';
const DEFAULT_COLOR = '#10B981';

function getEditFormValues(habit?: Habit | null) {
  const parsedName = parseHabitName(habit?.name ?? '');
  const mode = habit?.strengthAlgorithm;

  return {
    habitName: parsedName.name || habit?.name || '',
    progressEmojis: habit?.progressEmojis ?? undefined,
    reminderTime: createDateFromTimeString(
      habit?.reminderTime,
      getDefaultReminderTime()
    ),
    remindersEnabled: habit?.remindersEnabled ?? false,
    selectedColor: habit?.color || habit?.iconColor || DEFAULT_COLOR,
    selectedEmoji: habit?.icon ?? parsedName.emoji ?? DEFAULT_EMOJI,
    streakGoal: habit?.goalDuration ?? 0,
    strengthAlgorithm:
      mode === 'forgiving' || mode === 'balanced' || mode === 'strict'
        ? mode
        : 'balanced',
  };
}

export function useHabitEditScreen({
  habitId,
  initialHabit,
  onClose,
  onHabitRemoved,
}: UseHabitEditScreenProps) {
  const { triggerSelection, triggerSuccess } = useHapticFeedback();
  const initialFormValues = getEditFormValues(initialHabit);

  const habit = useQuery(api.habits.get, habitId ? { habitId } : 'skip');

  // Track whether form state has been hydrated from the habit query.
  // isLoading stays true until this flips so the skeleton covers the one-render
  // gap between habit arriving and useEffect populating form state.
  const formInitializedRef = useRef(Boolean(initialHabit));

  const [habitName, setHabitName] = useState(initialFormValues.habitName);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(
    initialFormValues.selectedEmoji
  );
  const [selectedColor, setSelectedColor] = useState(
    initialFormValues.selectedColor
  );
  const [remindersEnabled, setRemindersEnabled] = useState(
    initialFormValues.remindersEnabled
  );
  const [reminderTime, setReminderTime] = useState<Date>(
    initialFormValues.reminderTime
  );
  const [streakGoal, setStreakGoal] = useState(initialFormValues.streakGoal);
  const [strengthAlgorithm, setStrengthAlgorithm] = useState<StrengthAlgorithm>(
    initialFormValues.strengthAlgorithm
  );
  const [progressEmojis, setProgressEmojis] = useState<
    ProgressEmojiSet | undefined
  >(initialFormValues.progressEmojis);
  // Seeded only from habits.get — the list-shaped initialHabit has no why,
  // so seeding from it would blank a saved value on open.
  const [why, setWhy] = useState('');

  useEffect(() => {
    const sourceHabit = habit ?? initialHabit;
    if (!sourceHabit) return;

    const values = getEditFormValues(sourceHabit);
    setHabitName(values.habitName);
    setSelectedEmoji(values.selectedEmoji);
    setSelectedColor(values.selectedColor);
    setRemindersEnabled(values.remindersEnabled);
    setReminderTime(values.reminderTime);
    setStreakGoal(values.streakGoal);
    setStrengthAlgorithm(values.strengthAlgorithm);
    setProgressEmojis(values.progressEmojis);
    if (habit) setWhy(habit.why ?? '');
    formInitializedRef.current = true;
  }, [habit, initialHabit]);

  const { handleSave, isSaving } = useHabitSaveHandler({
    habitId,
    habitName,
    why: habit ? why.trim() : undefined,
    onSuccess: () => {
      triggerSuccess();
      onClose();
    },
    progressEmojis,
    remindersEnabled,
    reminderTime,
    selectedColor,
    selectedEmoji,
    streakGoal,
    strengthAlgorithm,
  });

  const { handleDelete, handleArchive } = useHabitActions({
    habitId,
    onSuccess: () => {
      triggerSelection();
      (onHabitRemoved ?? onClose)();
    },
  });

  const handleEmojiSelect = useCallback((emoji: string | null) => {
    setSelectedEmoji(emoji);
  }, []);

  const handleColorSelect = useCallback(
    (color: string) => {
      triggerSelection();
      setSelectedColor(color);
    },
    [triggerSelection]
  );

  const handleReminderToggle = useCallback((enabled: boolean) => {
    setRemindersEnabled(enabled);
  }, []);

  const handleReminderTimeChange = useCallback((time: Date) => {
    setReminderTime(time);
  }, []);

  const handleStreakGoalChange = useCallback((days: number) => {
    setStreakGoal(days);
  }, []);

  const handleStrengthAlgorithmChange = useCallback(
    (mode: StrengthAlgorithm) => {
      triggerSelection();
      setStrengthAlgorithm(mode);
    },
    [triggerSelection]
  );

  const handleProgressEmojisChange = useCallback(
    (next: ProgressEmojiSet | undefined) => {
      triggerSelection();
      setProgressEmojis(next);
    },
    [triggerSelection]
  );

  return {
    habitName,
    growthType: habit?.growthType,
    handleColorSelect,
    handleDelete,
    handleEmojiSelect,
    handleArchive,
    handleProgressEmojisChange,
    handleReminderTimeChange,
    handleReminderToggle,
    handleStreakGoalChange,
    handleStrengthAlgorithmChange,
    isLoading:
      habitId != null &&
      !initialHabit &&
      (habit === undefined || !formInitializedRef.current),
    progressEmojis,
    remindersEnabled,
    handleSave,
    selectedEmoji,
    isSaving,
    setHabitName,
    setWhy,
    reminderTime,
    selectedColor,
    streakGoal,
    strengthAlgorithm,
    triggerSelection,
    why,
  };
}
