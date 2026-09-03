import { renderHook } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';

import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useHabitDayToggleAnimations } from '../useHabitDayToggleAnimations';

jest.mock('@/hooks/useReduceMotion');
const mockReduceMotion = jest.mocked(useReduceMotion);
const initial = {
  dateString: '2026-08-28',
  reduceMotionPreference: false,
};

describe('useHabitDayToggleAnimations', () => {
  beforeEach(() => mockReduceMotion.mockReturnValue(false));
  afterEach(() => jest.restoreAllMocks());

  it('parks the press scale at rest', () => {
    const view = renderHook(() => useHabitDayToggleAnimations(initial));

    expect(view.result.current.buttonScale.value).toBe(1);
  });

  it('no longer owns completion state', () => {
    const view = renderHook(() => useHabitDayToggleAnimations(initial));

    expect(view.result.current).not.toHaveProperty('completion');
    expect(view.result.current).not.toHaveProperty('completionIconMounted');
  });

  it('starts no timing animation for a completion change', () => {
    const timing = jest.spyOn(Reanimated, 'withTiming');
    renderHook(() => useHabitDayToggleAnimations(initial));

    expect(timing).not.toHaveBeenCalled();
  });

  it('does not run a decorative idle animation for check-in cells', () => {
    const repeat = jest.spyOn(Reanimated, 'withRepeat');

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
