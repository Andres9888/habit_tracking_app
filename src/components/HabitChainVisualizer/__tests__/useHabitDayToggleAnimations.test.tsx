import { act, renderHook } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';

import { useReduceMotion } from '@/hooks/useReduceMotion';
import { durations } from '@/theme/animations';
import { useHabitDayToggleAnimations } from '../useHabitDayToggleAnimations';

jest.mock('@/hooks/useReduceMotion');
const mockReduceMotion = jest.mocked(useReduceMotion);
const initial = {
  completed: false,
  dateString: '2026-08-28',
  reduceMotionPreference: false,
};

describe('useHabitDayToggleAnimations', () => {
  afterEach(() => jest.restoreAllMocks());

  it('snaps completion immediately and uses the short fade when reduced', () => {
    const timing = jest.spyOn(Reanimated, 'withTiming');
    mockReduceMotion.mockReturnValue(false);
    const view = renderHook((props) => useHabitDayToggleAnimations(props), {
      initialProps: initial,
    });
    timing.mockClear();
    act(() => view.rerender({ ...initial, completed: true }));
    expect(view.result.current.completion.value).toBe(1);
    expect(timing).not.toHaveBeenCalled();

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
      view.rerender({
        completed: true,
        dateString: '2026-09-04',
      })
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

  it('does not run a decorative idle animation for check-in cells', () => {
    const repeat = jest.spyOn(Reanimated, 'withRepeat');
    mockReduceMotion.mockReturnValue(false);

    renderHook(() => useHabitDayToggleAnimations(initial));

    expect(repeat).not.toHaveBeenCalled();
  });

  it('passes the app reduce-motion preference to the animation hook', () => {
    renderHook(() =>
      useHabitDayToggleAnimations({
        ...initial,
        reduceMotionPreference: true,
      })
    );

    expect(mockReduceMotion).toHaveBeenCalledWith({ preference: true });
  });
});
