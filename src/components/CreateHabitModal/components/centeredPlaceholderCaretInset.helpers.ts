export const HABIT_NAME_INPUT_HORIZONTAL_PADDING = 20;
export const HABIT_NAME_PLACEHOLDER_CARET_GAP = 1;

export function getCenteredPlaceholderCaretInset(
  fieldWidth: number,
  textWidth: number
) {
  if (fieldWidth <= 0 || textWidth <= 0) {
    return HABIT_NAME_INPUT_HORIZONTAL_PADDING;
  }

  const innerWidth = Math.max(
    0,
    fieldWidth - HABIT_NAME_INPUT_HORIZONTAL_PADDING * 2
  );
  const visibleTextWidth = Math.min(textWidth, innerWidth);

  return Math.max(
    HABIT_NAME_INPUT_HORIZONTAL_PADDING,
    (fieldWidth - visibleTextWidth) / 2 - HABIT_NAME_PLACEHOLDER_CARET_GAP
  );
}

export function buildHabitNameInputTextStyle(
  caretInset: number,
  isEmpty: boolean
) {
  if (!isEmpty) {
    return {
      paddingHorizontal: HABIT_NAME_INPUT_HORIZONTAL_PADDING,
      textAlign: 'center' as const,
    };
  }

  return {
    paddingLeft: caretInset,
    paddingRight: HABIT_NAME_INPUT_HORIZONTAL_PADDING,
    textAlign: 'left' as const,
  };
}
