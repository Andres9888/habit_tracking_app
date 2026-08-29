import { act, renderHook } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { durations, springs } from '@/theme/animations';
import {
  DAY_TOGGLE_SCALE,
  useHabitDayToggleHandlers,
} from '../useHabitDayToggleHandlers';

const makeScale = () => ({ value: 1 }) as SharedValue<number>;

describe('useHabitDayToggleHandlers', () => {
  afterEach(() => jest.restoreAllMocks());

  it('gives a committed press one spring choreography', () => {
    const spring = jest.spyOn(Reanimated, 'withSpring');
    const sequence = jest.spyOn(Reanimated, 'withSequence');
    const timing = jest.spyOn(Reanimated, 'withTiming');
    const onPress = jest.fn();
    const scale = makeScale();
    const { result } = renderHook(() =>
      useHabitDayToggleHandlers({ buttonScale: scale, onPress, reduceMotion: false })
    );
    act(() => {
      result.current.handlePressIn();
      result.current.handlePress();
      result.current.handlePressOut();
    });

    expect(sequence).toHaveBeenCalledTimes(1);
    expect(timing).toHaveBeenCalledWith(
      DAY_TOGGLE_SCALE.pressed,
      expect.objectContaining({ duration: durations.stagger })
    );
    expect(spring).toHaveBeenCalledTimes(1);
    expect(spring).toHaveBeenCalledWith(DAY_TOGGLE_SCALE.rest, springs.responsive);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(scale.value).toBe(DAY_TOGGLE_SCALE.rest);
  });

  it('springs a cancelled press back without a pop', () => {
    const spring = jest.spyOn(Reanimated, 'withSpring');
    const sequence = jest.spyOn(Reanimated, 'withSequence');
    const scale = makeScale();
    const { result } = renderHook(() =>
      useHabitDayToggleHandlers({ buttonScale: scale, onPress: jest.fn(), reduceMotion: false })
    );
    act(() => {
      result.current.handlePressIn();
      result.current.handlePressOut();
    });

    expect(sequence).not.toHaveBeenCalled();
    expect(spring).toHaveBeenCalledWith(DAY_TOGGLE_SCALE.rest, springs.responsive);
    expect(scale.value).toBe(DAY_TOGGLE_SCALE.rest);
  });

  it('removes all scale animation for reduced motion', () => {
    const spring = jest.spyOn(Reanimated, 'withSpring');
    const timing = jest.spyOn(Reanimated, 'withTiming');
    const scale = makeScale();
    const { result } = renderHook(() =>
      useHabitDayToggleHandlers({ buttonScale: scale, onPress: jest.fn(), reduceMotion: true })
    );
    act(() => {
      result.current.handlePressIn();
      result.current.handlePress();
    });
    expect(spring).not.toHaveBeenCalled();
    expect(timing).not.toHaveBeenCalled();
    expect(scale.value).toBe(DAY_TOGGLE_SCALE.rest);
  });

  it('retargets rapid taps and finishes at rest', () => {
    const scale = makeScale();
    const { result } = renderHook(() =>
      useHabitDayToggleHandlers({ buttonScale: scale, onPress: jest.fn(), reduceMotion: false })
    );
    act(() => {
      for (let count = 0; count < 3; count += 1) {
        result.current.handlePressIn();
        result.current.handlePress();
      }
    });
    expect(scale.value).toBe(DAY_TOGGLE_SCALE.rest);
  });
});
