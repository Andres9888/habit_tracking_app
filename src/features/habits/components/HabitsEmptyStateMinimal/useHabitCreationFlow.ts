import { useCallback, useRef, useEffect, useState } from 'react';
import { Keyboard, TextInput } from 'react-native';
import { useHapticFeedback } from '../../../../hooks/useHapticFeedback';
import { useChipSelection } from './useChipSelection';
import { ERROR_MESSAGES } from '../../../../constants/errorMessages';

interface UseHabitCreationFlowParams {
  onQuickCreateHabit: (habitName: string) => Promise<void>;
  inputRef: React.RefObject<TextInput | null>;
}

export function useHabitCreationFlow({
  onQuickCreateHabit,
  inputRef,
}: UseHabitCreationFlowParams) {
  const { triggerSuccess } = useHapticFeedback();
  const chipSelection = useChipSelection();

  const [isCreating, setIsCreating] = useState(false);
  const [successHabitName, setSuccessHabitName] = useState<string | null>(null);
  const [successEmoji, setSuccessEmoji] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timer on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    };
  }, []);

  const handleCreateHabit = useCallback(async () => {
    if (!chipSelection.inputValue.trim() || isCreating) return;

    Keyboard.dismiss();
    setIsCreating(true);
    setErrorMessage(null);

    try {
      await onQuickCreateHabit(chipSelection.inputValue.trim());
      triggerSuccess();
      setSuccessHabitName(chipSelection.inputValue.trim());
      setSuccessEmoji(chipSelection.selectedEmoji);

      if (chipSelection.selectedChipIndex !== null) {
        chipSelection.trackChipConversion(chipSelection.selectedChipIndex);
      }
    } catch (error) {
      setIsCreating(false);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.DATA_OPS.CREATE_HABIT_FAILED
      );
    }
  }, [chipSelection, isCreating, onQuickCreateHabit, triggerSuccess]);

  const handleSubmitEditing = useCallback(() => {
    if (chipSelection.inputValue.trim() && !isCreating) {
      handleCreateHabit();
    }
  }, [chipSelection.inputValue, isCreating, handleCreateHabit]);

  const handleClearInput = useCallback(() => {
    chipSelection.resetSelection();
    inputRef.current?.focus();
  }, [chipSelection, inputRef]);

  const handleAddAnother = useCallback(() => {
    setSuccessHabitName(null);
    setSuccessEmoji(null);
    setIsCreating(false);
    chipSelection.resetSelection();
    if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    focusTimerRef.current = setTimeout(() => inputRef.current?.focus(), 100);
  }, [chipSelection, inputRef]);

  const handleDismissError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return {
    errorMessage,
    handleAddAnother,
    handleChipSelect: chipSelection.handleChipSelect,
    handleClearInput,
    handleCreateHabit,
    handleDismissError,
    handleInputChange: chipSelection.handleInputChange,
    handleSubmitEditing,
    inputValue: chipSelection.inputValue,
    isCreating,
    selectedChipIndex: chipSelection.selectedChipIndex,
    successEmoji,
    successHabitName,
  };
}
