import { useState } from 'react';
import { useCenteredPlaceholderCaretInset } from './useCenteredPlaceholderCaretInset';
import { useHabitNameInputFocus } from './useHabitNameInputFocus';

export function useHabitNameInputField(
  autoFocus: boolean,
  habitName: string,
  placeholder: string,
  onBlur: () => void,
  onFocus: () => void
) {
  const inputRef = useHabitNameInputFocus(autoFocus);
  const [isFocused, setIsFocused] = useState(false);
  const caretState = useCenteredPlaceholderCaretInset(habitName, placeholder);
  const shouldReplaceNativeCaret =
    isFocused && habitName.length === 0 && placeholder.length > 0;
  const showPlaceholderCaret =
    shouldReplaceNativeCaret && caretState.isPlaceholderCaretReady;

  return {
    inputRef,
    caretState,
    shouldReplaceNativeCaret,
    showPlaceholderCaret,
    handleBlur: () => {
      setIsFocused(false);
      onBlur();
    },
    handleFocus: () => {
      setIsFocused(true);
      onFocus();
    },
  };
}
