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
  const shouldHideNativeCaret =
    habitName.length === 0 && placeholder.length > 0;
  const showPlaceholderCaret =
    isFocused && shouldHideNativeCaret && caretState.isPlaceholderCaretReady;

  return {
    inputRef,
    caretState,
    shouldHideNativeCaret,
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
