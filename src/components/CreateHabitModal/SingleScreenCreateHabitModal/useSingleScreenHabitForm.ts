/**
 * useSingleScreenHabitForm - Form state for single-screen habit creation
 *
 * Smart defaults per spec:
 * - Random emoji from curated set
 * - Sage green (#6B8F71) color
 * - No reminder
 * - Anytime phase
 */

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldValidation } from '../../../utils/validation/useFieldValidation';
import { validateHabitName } from '../../../utils/validation';
import { buildHabitName, parseReminderTime } from '../utils';
import { DEFAULT_SAGE_GREEN, getRandomEmoji } from './constants';
import type { HabitDoc } from '../types';

export type DayPhase = 'morning' | 'evening' | 'anytime';

interface UseSingleScreenHabitFormOptions {
  habitToEdit?: HabitDoc | null;
  visible: boolean;
}

export function useSingleScreenHabitForm({
  habitToEdit,
  visible,
}: UseSingleScreenHabitFormOptions) {
  const isEditMode = !!habitToEdit;

  // Form state with smart defaults
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_SAGE_GREEN);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(() => parseReminderTime());
  const [dayPhase, setDayPhase] = useState<DayPhase>('anytime');
  const [isCustomizeExpanded, setIsCustomizeExpanded] = useState(false);

  // Name validation with debounce
  const habitNameValidation = useFieldValidation({
    debounceMs: 300,
    initialValue: '',
    showErrorsAfterBlur: true,
    validate: validateHabitName,
  });

  // Build full habit name with emoji prefix
  const fullHabitName = useMemo(
    () => buildHabitName(selectedEmoji, habitNameValidation.value),
    [habitNameValidation.value, selectedEmoji]
  );

  // Reset form when modal opens (new habit mode)
  useEffect(() => {
    if (visible && !isEditMode) {
      setSelectedEmoji(getRandomEmoji());
      setSelectedColor(DEFAULT_SAGE_GREEN);
      setReminderEnabled(false);
      setReminderTime(parseReminderTime());
      setDayPhase('anytime');
      setIsCustomizeExpanded(false);
      habitNameValidation.setValue('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isEditMode]);

  // Initialize form for edit mode
  useEffect(() => {
    if (visible && isEditMode && habitToEdit) {
      // Parse emoji from habit name (format: "emoji name")
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
      // Map preferredTime to phase
      const preferredTime = habitToEdit.preferredTime;
      if (preferredTime === 'morning') {
        setDayPhase('morning');
      } else if (preferredTime === 'evening') {
        setDayPhase('evening');
      } else {
        setDayPhase('anytime');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isEditMode, habitToEdit]);

  // Actions
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

  const handlePhaseSelect = useCallback((phase: DayPhase) => {
    setDayPhase(phase);
  }, []);

  // Validation: can create when name is valid (min 2 chars)
  const canCreate = useMemo(() => {
    return (
      habitNameValidation.value.trim().length >= 2 &&
      habitNameValidation.isValid
    );
  }, [habitNameValidation.isValid, habitNameValidation.value]);

  // Build form data for submission
  const getFormData = useCallback(() => {
    return {
      dayPhase: dayPhase === 'anytime' ? null : dayPhase,
      fullHabitName,
      hasReminders: reminderEnabled,
      reminderSound: 'Default',
      reminderTime,
      selectedColor,
      selectedEmoji,
    };
  }, [
    dayPhase,
    fullHabitName,
    reminderEnabled,
    reminderTime,
    selectedColor,
    selectedEmoji,
  ]);

  return {
    // State
    canCreate,
    dayPhase,
    // Actions
    getFormData,

    habitName: habitNameValidation.value,

    habitNameError: habitNameValidation.error,

    handleColorSelect,

    handleEmojiSelect,

    handlePhaseSelect,

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
