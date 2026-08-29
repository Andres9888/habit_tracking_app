import { act, renderHook } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';

import { useReduceMotion } from '@/hooks/useReduceMotion';
import { durations } from '@/theme/animations';
import { useHabitDayToggleAnimations } from '../useHabitDayToggleAnimations';

jest.mock('@/hooks/useReduceMotion');
const mockReduceMotion = jest.mocked(useReduceMotion);
const initial = { completed: false, dateString: '2026-08-28', isToday: false };

describe('useHabitDayToggleAnimations', () => {
  afterEach(() => jest.restoreAllMocks());

  it('uses the reveal clock for completion and the short fade when reduced', () => {
    const timing = jest.spyOn(Reanimated, 'withTiming');
    mockReduceMotion.mockReturnValue(false);
    const view = renderHook((props) => useHabitDayToggleAnimations(props), {
      initialProps: initial,
    });
    timing.mockClear();
    act(() => view.rerender({ ...initial, completed: true }));
    expect(timing).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ duration: durations.reveal }),
      expect.any(Function)
    );

    mockReduceMotion.mockReturnValue(true);
    act(() => view.rerender(initial));
    expect(timing).toHaveBeenLastCalledWith(
      0,
      expect.objectContaining({ duration: durations.stagger }),
      expect.any(Function)
    );
  });

  it('snaps a reused date slot without replaying completion', () => {
    const timing = jest.spyOn(Reanimated, 'withTiming');
    mockReduceMotion.mockReturnValue(false);
    const view = renderHook((props) => useHabitDayToggleAnimations(props), {
      initialProps: initial,
    });
    timing.mockClear();
    act(() =>
      view.rerender({ completed: true, dateString: '2026-09-04', isToday: false })
    );
    expect(timing).not.toHaveBeenCalled();
    expect(view.result.current.completion.value).toBe(1);
    expect(view.result.current.completionIconMounted).toBe(true);
  });

  it('retargets rapid completion changes to the final logical state', () => {
    mockReduceMotion.mockReturnValue(false);
    const view = renderHook((props) => useHabitDayToggleAnimations(props), {
      initialProps: initial,
    });
    act(() => view.rerender({ ...initial, completed: true }));
    act(() => view.rerender(initial));
    act(() => view.rerender({ ...initial, completed: true }));
    expect(view.result.current.completion.value).toBe(1);
    expect(view.result.current.completionIconMounted).toBe(true);
  });
});
