import { act, renderHook } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useHabitDayToggleAnimations } from '../useHabitDayToggleAnimations';

jest.mock('@/hooks/useReduceMotion');
jest.mock('react-native-worklets', () => ({ scheduleOnRN: jest.fn() }));
const mockReduceMotion = jest.mocked(useReduceMotion);
const mockScheduleOnRN = jest.mocked(scheduleOnRN);
const initial = { completed: true, dateString: '2026-08-28', isToday: false };

describe('useHabitDayToggleAnimations interruptions', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    mockScheduleOnRN.mockReset();
  });

  it('ignores a queued stale hide after the day is completed again', () => {
    const timingCallbacks: Array<(finished?: boolean) => void> = [];
    const scheduledJobs: Array<() => void> = [];
    jest.spyOn(Reanimated, 'withTiming').mockImplementation(
      (value, _config, callback) => {
        if (callback) timingCallbacks.push(callback);
        return value;
      }
    );
    mockScheduleOnRN.mockImplementation((fn, ...args) => {
      scheduledJobs.push(() => fn(...args));
    });
    mockReduceMotion.mockReturnValue(false);
    const view = renderHook((props) => useHabitDayToggleAnimations(props), {
      initialProps: initial,
    });

    act(() => view.rerender({ ...initial, completed: false }));
    act(() => timingCallbacks.at(-1)?.(true));
    expect(scheduledJobs).toHaveLength(1);

    act(() => view.rerender(initial));
    act(() => scheduledJobs[0]?.());

    expect(view.result.current.completionIconMounted).toBe(true);
  });

  it('snaps a partial completion fade when reduced motion turns on', () => {
    const values = [
      { value: 1 },
      { value: 1 },
      { value: 1 },
    ] as SharedValue<number>[];
    let sharedValueCall = 0;
    jest.spyOn(Reanimated, 'useSharedValue').mockImplementation(
      (() => values[sharedValueCall++ % values.length]) as typeof Reanimated.useSharedValue
    );
    const timing = jest.spyOn(Reanimated, 'withTiming');
    mockReduceMotion.mockReturnValue(false);
    const view = renderHook((props) => useHabitDayToggleAnimations(props), {
      initialProps: initial,
    });
    timing.mockImplementationOnce(() => 0.4);

    act(() => view.rerender({ ...initial, completed: false }));
    expect(view.result.current.completion.value).toBe(0.4);

    mockReduceMotion.mockReturnValue(true);
    act(() => view.rerender({ ...initial, completed: false }));

    expect(view.result.current.completion.value).toBe(0);
  });
});
