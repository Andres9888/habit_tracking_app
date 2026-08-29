import { act, renderHook } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { springs } from '@/theme/animations';
import {
  DAY_TOGGLE_SCALE,
  useHabitDayToggleHandlers,
} from '../useHabitDayToggleHandlers';

describe('useHabitDayToggleHandlers press ordering', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('does not let a delayed prior press-out cancel the current hold', () => {
    const spring = jest.spyOn(Reanimated, 'withSpring');
    const scale = { value: 1 } as SharedValue<number>;
    const { result } = renderHook(() =>
      useHabitDayToggleHandlers({
        buttonScale: scale,
        onPress: jest.fn(),
        reduceMotion: false,
      })
    );

    act(() => {
      result.current.handlePressIn();
      result.current.handlePress();
      result.current.handlePressIn();
      setTimeout(result.current.handlePressOut, 130);
      jest.advanceTimersByTime(130);
    });

    expect(scale.value).toBe(DAY_TOGGLE_SCALE.pressed);
    expect(spring).toHaveBeenCalledTimes(1);

    act(() => result.current.handlePressOut());

    expect(spring).toHaveBeenCalledTimes(2);
    expect(spring).toHaveBeenLastCalledWith(
      DAY_TOGGLE_SCALE.rest,
      springs.responsive
    );
    expect(scale.value).toBe(DAY_TOGGLE_SCALE.rest);
  });
});
