import { useCallback } from 'react';
import { Keyboard } from 'react-native';
import type { SuggestionChip } from './components/SuggestionChips';

interface HabitForm {
  habitName: string;
  setHabitName: (name: string) => void;
  setSelectedEmoji: (emoji: string | null) => void;
  setSelectedColor: (color: string) => void;
}

interface UseModalV2HandlersOptions {
  form: HabitForm;
  triggerSelection: () => void;
  setShowEmojiPicker: (show: boolean) => void;
}

/**
 * Custom hook for CreateHabitModalV2 event handlers
 */
export function useModalV2Handlers({
  form,
  triggerSelection,
  setShowEmojiPicker,
}: UseModalV2HandlersOptions) {
  const handleSuggestionSelect = useCallback(
    (chip: SuggestionChip) => {
      form.setHabitName(chip.name);
      form.setSelectedEmoji(chip.emoji);
      form.setSelectedColor(chip.color);
      triggerSelection();
      Keyboard.dismiss();
    },
    [form, triggerSelection]
  );

  const handleAIAppend = useCallback(
    (suggestion: string) => {
      const currentName = form.habitName.trim();
      const separator = currentName.endsWith(' ') ? '' : ' ';
      form.setHabitName(`${currentName}${separator}${suggestion}`);
    },
    [form]
  );

  const handleEmojiPress = useCallback(() => {
    setShowEmojiPicker(true);
  }, [setShowEmojiPicker]);

  const handleEmojiSelect = useCallback(
    (emoji: string | null) => {
      form.setSelectedEmoji(emoji);
      setShowEmojiPicker(false);
    },
    [form, setShowEmojiPicker]
  );

  const handleInputFocus = useCallback(() => {
    // Could track focus state if needed
  }, []);

  const handleDismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return {
    handleAIAppend,
    handleDismissKeyboard,
    handleEmojiPress,
    handleEmojiSelect,
    handleInputFocus,
    handleSuggestionSelect,
  };
}
