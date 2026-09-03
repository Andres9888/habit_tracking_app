import { act, renderHook } from '@testing-library/react-native';

import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useHabitDayToggleAnimations } from '../useHabitDayToggleAnimations';
import { runPressIn } from '../useHabitDayToggleHandlers';

jest.mock('@/hooks/useReduceMotion');
const mockReduceMotion = jest.mocked(useReduceMotion);
const initial = {
  dateString: '2026-08-28',
  reduceMotionPreference: false,
};

describe('useHabitDayToggleAnimations interruptions', () => {
  beforeEach(() => mockReduceMotion.mockReturnValue(false));
  afterEach(() => jest.restoreAllMocks());

  it('releases a stranded press scale when the slot moves to another date', () => {
    const view = renderHook((props) => useHabitDayToggleAnimations(props), {
      initialProps: initial,
    });
    act(() => runPressIn(view.result.current.buttonScale, false));
    expect(view.result.current.buttonScale.value).toBe(0.97);

    act(() => view.rerender({ ...initial, dateString: '2026-09-04' }));

    expect(view.result.current.buttonScale.value).toBe(1);
  });

  it('snaps a stranded press scale when reduced motion turns on', () => {
    const view = renderHook((props) => useHabitDayToggleAnimations(props), {
      initialProps: initial,
    });
    act(() => runPressIn(view.result.current.buttonScale, false));
    expect(view.result.current.buttonScale.value).toBe(0.97);

    mockReduceMotion.mockReturnValue(true);
    act(() => view.rerender({ ...initial }));

    expect(view.result.current.buttonScale.value).toBe(1);
  });

  it('keeps the scale at rest across a same-date re-render', () => {
    const view = renderHook((props) => useHabitDayToggleAnimations(props), {
      initialProps: initial,
    });

    act(() => view.rerender({ ...initial }));

    expect(view.result.current.buttonScale.value).toBe(1);
  });
});
