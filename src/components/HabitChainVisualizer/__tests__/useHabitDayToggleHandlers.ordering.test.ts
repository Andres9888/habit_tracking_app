import { act, renderHook } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { durations } from '@/theme/animations';
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
    const timing = jest.spyOn(Reanimated, 'withTiming');
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
      result.current.handlePressIn();
      result.current.handlePressOut();
    });

    expect(scale.value).toBe(DAY_TOGGLE_SCALE.pressed);
    expect(timing).toHaveBeenCalledTimes(2);

    act(() => result.current.handlePressOut());

    expect(timing).toHaveBeenCalledTimes(3);
    expect(timing).toHaveBeenLastCalledWith(
      DAY_TOGGLE_SCALE.rest,
      expect.objectContaining({ duration: durations.instant })
    );
    expect(scale.value).toBe(DAY_TOGGLE_SCALE.rest);
  });
});
