import { useMemo, useState } from 'react';
import type { TextLayoutEvent } from 'react-native';

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

/** Centered text while empty, with the caret at the first visible placeholder glyph. */
export function useCenteredPlaceholderCaretInset(
  habitName: string,
  placeholder: string
) {
  const [fieldWidth, setFieldWidth] = useState(0);
  const [placeholderTextWidth, setPlaceholderTextWidth] = useState(0);
  const caretInset = getCenteredPlaceholderCaretInset(
    fieldWidth,
    placeholderTextWidth
  );
  const isEmpty = habitName.length === 0;
  const isPlaceholderCaretReady = fieldWidth > 0 && placeholderTextWidth > 0;

  const inputTextStyle = useMemo(() => {
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
  }, [caretInset, isEmpty]);

  const onPlaceholderTextLayout = (event: TextLayoutEvent) => {
    const line = event.nativeEvent.lines[0];
    if (!line) return;
    setPlaceholderTextWidth(line.width);
  };

  return {
    caretInset,
    fieldWidth,
    inputTextStyle,
    isPlaceholderCaretReady,
    onFieldLayout: (width: number) => setFieldWidth(width),
    onPlaceholderTextLayout,
    placeholder,
  };
}
