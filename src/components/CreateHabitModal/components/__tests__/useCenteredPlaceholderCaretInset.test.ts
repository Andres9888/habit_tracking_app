import { act, renderHook } from '@testing-library/react-native';
import type { TextLayoutEvent } from 'react-native';
import {
  HABIT_NAME_INPUT_HORIZONTAL_PADDING,
  HABIT_NAME_PLACEHOLDER_CARET_GAP,
  useCenteredPlaceholderCaretInset,
} from '../useCenteredPlaceholderCaretInset';

const textLayoutEventWithX = (x: number) =>
  ({
    nativeEvent: {
      lines: [{ x }],
    },
  }) as TextLayoutEvent;

describe('useCenteredPlaceholderCaretInset', () => {
  it('places the empty-field caret slightly before the first placeholder glyph', () => {
    const placeholderX = 42;
    const { result } = renderHook(() =>
      useCenteredPlaceholderCaretInset('', 'Self-Compassion After Setbacks')
    );

    act(() => {
      result.current.onPlaceholderTextLayout(textLayoutEventWithX(placeholderX));
    });

    expect(result.current.inputTextStyle).toEqual(
      expect.objectContaining({
        paddingLeft:
          HABIT_NAME_INPUT_HORIZONTAL_PADDING +
          placeholderX -
          HABIT_NAME_PLACEHOLDER_CARET_GAP,
        textAlign: 'left',
      })
    );
  });

  it('keeps the caret inside the normal input padding when the placeholder is already near the edge', () => {
    const { result } = renderHook(() =>
      useCenteredPlaceholderCaretInset('', 'Run')
    );

    act(() => {
      result.current.onPlaceholderTextLayout(textLayoutEventWithX(2));
    });

    expect(result.current.inputTextStyle).toEqual(
      expect.objectContaining({
        paddingLeft: HABIT_NAME_INPUT_HORIZONTAL_PADDING,
        textAlign: 'left',
      })
    );
  });
});
