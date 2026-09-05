import { useHabitNameInputFocus } from './useHabitNameInputFocus';

export function useHabitNameInputField(
  autoFocus: boolean,
  onBlur: () => void,
  onFocus: () => void
) {
  const inputRef = useHabitNameInputFocus(autoFocus);

  return {
    inputRef,
    handleBlur: () => onBlur(),
    handleFocus: () => onFocus(),
  };
}
