import { useMemo, useState } from 'react';
import type { TextLayoutEvent } from 'react-native';
import {
  buildHabitNameInputTextStyle,
  getCenteredPlaceholderCaretInset,
} from './centeredPlaceholderCaretInset.helpers';

export {
  getCenteredPlaceholderCaretInset,
  HABIT_NAME_INPUT_HORIZONTAL_PADDING,
  HABIT_NAME_PLACEHOLDER_CARET_GAP,
} from './centeredPlaceholderCaretInset.helpers';

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

  const inputTextStyle = useMemo(
    () => buildHabitNameInputTextStyle(caretInset, isEmpty),
    [caretInset, isEmpty]
  );

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
