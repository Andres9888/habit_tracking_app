import React from 'react';
import { Modal } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { NoteSheet } from '../NoteSheet';

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');

  const makeSharedValue = (initial: unknown) => ({
    value: initial,
    get() {
      return this.value;
    },
    set(next: unknown) {
      this.value =
        typeof next === 'function'
          ? (next as (mockCurrentValue: unknown) => unknown)(this.value)
          : next;
    },
  });

  const finishImmediately = (
    value: unknown,
    _config?: unknown,
    callback?: (finished: boolean) => void
  ) => {
    callback?.(true);
    return value;
  };

  return {
    __esModule: true,
    default: { View },
    Easing: { bezier: () => (value: number) => value },
    Extrapolation: { CLAMP: 'clamp' },
    interpolate: (value: number, input: number[], output: number[]) =>
      value <= input[0] ? output[0] : output[output.length - 1],
    useAnimatedStyle: (factory: () => object) => factory(),
    useReducedMotion: () => false,
    useSharedValue: (initial: unknown) =>
      React.useRef(makeSharedValue(initial)).current,
    withSpring: finishImmediately,
    withTiming: finishImmediately,
  };
});

describe('NoteSheet', () => {
  const defaultProps = {
    date: '2026-09-02',
    existing: '',
    hint: 'Optional. Only you will see this.',
    onClose: jest.fn(),
    onSave: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses custom bottom-sheet motion instead of the native modal animation', () => {
    const { UNSAFE_getByType } = render(<NoteSheet {...defaultProps} />);

    expect(UNSAFE_getByType(Modal).props.animationType).toBe('none');
  });

  it('animates closed when the backdrop is pressed', () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <NoteSheet {...defaultProps} onClose={onClose} />
    );

    fireEvent.press(getByLabelText('Dismiss note sheet'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('trims and saves the draft before animating closed', () => {
    const onClose = jest.fn();
    const onSave = jest.fn();
    const { getByLabelText, getByText } = render(
      <NoteSheet {...defaultProps} onClose={onClose} onSave={onSave} />
    );

    fireEvent.changeText(getByLabelText('Day note'), '  Good recovery day  ');
    fireEvent.press(getByText('Save note'));

    expect(onSave).toHaveBeenCalledWith('Good recovery day');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when no date is selected', () => {
    const { toJSON } = render(<NoteSheet {...defaultProps} date={null} />);

    expect(toJSON()).toBeNull();
  });
});
