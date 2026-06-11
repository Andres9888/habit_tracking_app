import { act, renderHook } from '@testing-library/react-native';
import {
  getCenteredPlaceholderCaretInset,
  HABIT_NAME_INPUT_HORIZONTAL_PADDING,
  HABIT_NAME_PLACEHOLDER_CARET_GAP,
  useCenteredPlaceholderCaretInset,
} from '../useCenteredPlaceholderCaretInset';

describe('getCenteredPlaceholderCaretInset', () => {
  it('falls back to input padding before layout measurements are available', () => {
    expect(getCenteredPlaceholderCaretInset(0, 120)).toBe(
      HABIT_NAME_INPUT_HORIZONTAL_PADDING
    );
    expect(getCenteredPlaceholderCaretInset(320, 0)).toBe(
      HABIT_NAME_INPUT_HORIZONTAL_PADDING
    );
  });

  it('places the caret at the first glyph of centered placeholder text', () => {
    expect(getCenteredPlaceholderCaretInset(360, 160)).toBe(
      (360 - 160) / 2 - HABIT_NAME_PLACEHOLDER_CARET_GAP
    );
  });

  it('clamps long placeholders to the field padding when they fill the input', () => {
    expect(getCenteredPlaceholderCaretInset(360, 500)).toBe(
      HABIT_NAME_INPUT_HORIZONTAL_PADDING
    );
  });
});

describe('useCenteredPlaceholderCaretInset', () => {
  it('keeps isPlaceholderCaretReady true across placeholder rotation', () => {
    const { result, rerender } = renderHook(
      ({ habitName, placeholder }) =>
        useCenteredPlaceholderCaretInset(habitName, placeholder),
      {
        initialProps: {
          habitName: '',
          placeholder: 'e.g. Weekly Teaching',
        },
      }
    );

    act(() => {
      result.current.onFieldLayout(360);
      result.current.onPlaceholderTextLayout({
        nativeEvent: { lines: [{ width: 160 }] },
      } as never);
    });

    expect(result.current.isPlaceholderCaretReady).toBe(true);

    rerender({
      habitName: '',
      placeholder: 'e.g. Daily Meditation',
    });

    expect(result.current.isPlaceholderCaretReady).toBe(true);
  });
});
