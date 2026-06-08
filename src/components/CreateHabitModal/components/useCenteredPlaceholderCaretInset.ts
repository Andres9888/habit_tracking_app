import { useEffect, useMemo, useState } from 'react';
import type { TextLayoutEvent } from 'react-native';

export const HABIT_NAME_INPUT_HORIZONTAL_PADDING = 20;
export const HABIT_NAME_PLACEHOLDER_CARET_GAP = 1;

/** Centered text while empty, with the caret at the first visible placeholder glyph. */
export function useCenteredPlaceholderCaretInset(
  habitName: string,
  placeholder: string
) {
  const [fieldWidth, setFieldWidth] = useState(0);
  const [caretInset, setCaretInset] = useState(
    HABIT_NAME_INPUT_HORIZONTAL_PADDING
  );
  const isEmpty = habitName.length === 0;

  useEffect(() => {
    setCaretInset(HABIT_NAME_INPUT_HORIZONTAL_PADDING);
  }, [fieldWidth, placeholder]);

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
    setCaretInset(
      Math.max(
        HABIT_NAME_INPUT_HORIZONTAL_PADDING,
        HABIT_NAME_INPUT_HORIZONTAL_PADDING +
          line.x -
          HABIT_NAME_PLACEHOLDER_CARET_GAP
      )
    );
  };

  return {
    fieldWidth,
    inputTextStyle,
    measurePlaceholder: isEmpty && placeholder.length > 0,
    onFieldLayout: (width: number) => setFieldWidth(width),
    onPlaceholderTextLayout,
    placeholder,
  };
}
