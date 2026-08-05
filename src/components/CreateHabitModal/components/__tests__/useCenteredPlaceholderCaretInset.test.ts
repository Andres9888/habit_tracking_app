import { act, renderHook } from '@testing-library/react-native';
import type { TextLayoutEvent } from 'react-native';
import {
  HABIT_NAME_INPUT_HORIZONTAL_PADDING,
  useCenteredPlaceholderCaretInset,
} from '../useCenteredPlaceholderCaretInset';

describe('useCenteredPlaceholderCaretInset', () => {
  it('aligns the empty-field caret to centered placeholder text when native x is zero', () => {
    const { result } = renderHook(() =>
      useCenteredPlaceholderCaretInset('', 'Vaccination Status Review')
    );

    act(() => {
      result.current.onFieldLayout(300);
    });

    act(() => {
      result.current.onPlaceholderTextLayout({
        nativeEvent: {
          lines: [{ width: 160, x: 0 }],
        },
      } as TextLayoutEvent);
    });

    expect(result.current.inputTextStyle).toEqual(
      expect.objectContaining({
        paddingLeft: 69,
        textAlign: 'left',
      })
    );
  });

  it('keeps filled text centered with standard input padding', () => {
    const { result } = renderHook(() =>
      useCenteredPlaceholderCaretInset('Vaccination Status Review', 'Read')
    );

    expect(result.current.inputTextStyle).toEqual({
      paddingHorizontal: HABIT_NAME_INPUT_HORIZONTAL_PADDING,
      textAlign: 'center',
    });
  });
});
