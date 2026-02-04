/**
 * useSingleScreenHabitForm - Form state hook for single-screen habit creation
 * Smart defaults: random emoji, sage green, no reminder, Anytime phase
 */

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldValidation } from '../../../utils/validation/useFieldValidation';
import { validateHabitName } from '../../../utils/validation';
import { buildHabitName, parseReminderTime } from '../utils';
import { DEFAULT_SAGE_GREEN, getRandomEmoji } from './constants';
import type { HabitDoc } from '../types';

interface UseSingleScreenHabitFormOptions {
  habitToEdit?: HabitDoc | null;
  visible: boolean;
}

export function useSingleScreenHabitForm({
  habitToEdit,
  visible,
}: UseSingleScreenHabitFormOptions) {
  const isEditMode = !!habitToEdit;
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_SAGE_GREEN);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(() => parseReminderTime());
  const [isCustomizeExpanded, setIsCustomizeExpanded] = useState(false);

  const habitNameValidation = useFieldValidation({
    debounceMs: 300,
    initialValue: '',
    showErrorsAfterBlur: true,
    validate: validateHabitName,
  });

  const fullHabitName = useMemo(
    () => buildHabitName(selectedEmoji, habitNameValidation.value),
    [habitNameValidation.value, selectedEmoji]
  );

  useEffect(() => {
    if (visible && !isEditMode) {
      setSelectedEmoji(getRandomEmoji());
      setSelectedColor(DEFAULT_SAGE_GREEN);
      setReminderEnabled(false);
      setReminderTime(parseReminderTime());
      setIsCustomizeExpanded(false);
      habitNameValidation.setValue('');
    }
  }, [habitNameValidation, isEditMode, visible]);

  useEffect(() => {
    if (visible && isEditMode && habitToEdit) {
      const nameMatch = habitToEdit.name?.match(/^(\p{Emoji})\s+(.+)$/u);
      if (nameMatch) {
        setSelectedEmoji(nameMatch[1]);
        habitNameValidation.setValue(nameMatch[2]);
      } else {
        habitNameValidation.setValue(habitToEdit.name || '');
      }
      setSelectedColor(habitToEdit.iconColor || DEFAULT_SAGE_GREEN);
      setReminderEnabled(habitToEdit.remindersEnabled || false);
      if (habitToEdit.reminderTime) {
        setReminderTime(parseReminderTime(habitToEdit.reminderTime));
      }
    }
  }, [habitNameValidation, habitToEdit, isEditMode, visible]);

  const toggleCustomize = useCallback(() => {
    setIsCustomizeExpanded((prev) => !prev);
  }, []);

  const toggleReminder = useCallback(() => {
    setReminderEnabled((prev) => !prev);
  }, []);

  const handleEmojiSelect = useCallback((emoji: string | null) => {
    setSelectedEmoji(emoji);
  }, []);

  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  const handleReminderTimeChange = useCallback((time: Date) => {
    setReminderTime(time);
    setReminderEnabled(true);
  }, []);

  const canCreate = useMemo(() => {
    return (
      habitNameValidation.value.trim().length >= 2 &&
      habitNameValidation.isValid
    );
  }, [habitNameValidation.isValid, habitNameValidation.value]);

  const getFormData = useCallback(() => {
    return {
      dayPhase: null as string | null,
      fullHabitName,
      hasReminders: reminderEnabled,
      reminderSound: 'Default',
      reminderTime,
      selectedColor,
      selectedEmoji,
    };
  }, [fullHabitName, reminderEnabled, reminderTime, selectedColor, selectedEmoji]);

  return {
    canCreate,
    getFormData,
    habitName: habitNameValidation.value,
    habitNameError: habitNameValidation.error,
    handleColorSelect,
    handleEmojiSelect,
    handleReminderTimeChange,
    isCustomizeExpanded,
    isEditMode,
    onHabitNameBlur: habitNameValidation.onBlur,
    reminderEnabled,
    reminderTime,
    selectedColor,
    selectedEmoji,
    setHabitName: habitNameValidation.setValue,
    toggleCustomize,
    toggleReminder,
  };
}
