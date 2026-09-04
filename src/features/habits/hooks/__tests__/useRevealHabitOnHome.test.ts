/**
 * The reveal request must expire on its own (the row may never reach
 * habits.list) and must survive the builder cast in
 * buildModalsStateReturnValue.
 */

import { act, renderHook } from '@testing-library/react-native';
import { buildModalsStateReturnValue } from '../buildModalsStateReturnValue';
import {
  REVEAL_GIVE_UP_MS,
  useRevealHabitOnHome,
} from '../useRevealHabitOnHome';

describe('useRevealHabitOnHome', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('drops a request the list never fulfils', () => {
    const { result } = renderHook(() => useRevealHabitOnHome());
    act(() => result.current.revealHabitOnHome('habit-1' as never));
    expect(result.current.revealHabitId).toBe('habit-1');
    act(() => jest.advanceTimersByTime(REVEAL_GIVE_UP_MS - 1));
    expect(result.current.revealHabitId).toBe('habit-1');
    act(() => jest.advanceTimersByTime(1));
    expect(result.current.revealHabitId).toBeNull();
  });

  it('clears immediately and cancels the give-up timer', () => {
    const { result } = renderHook(() => useRevealHabitOnHome());
    act(() => result.current.revealHabitOnHome('habit-1' as never));
    act(() => result.current.clearRevealHabit());
    expect(result.current.revealHabitId).toBeNull();
    act(() => result.current.revealHabitOnHome('habit-2' as never));
    act(() => jest.advanceTimersByTime(REVEAL_GIVE_UP_MS - 1));
    expect(result.current.revealHabitId).toBe('habit-2');
  });

  it('survives the buildModalsStateReturnValue cast', () => {
    const { result } = renderHook(() => useRevealHabitOnHome());
    const state = buildModalsStateReturnValue(
      result.current as never,
      {} as never,
      {} as never,
      {} as never
    );
    expect(state.revealHabitOnHome).toBe(result.current.revealHabitOnHome);
    expect(state.clearRevealHabit).toBe(result.current.clearRevealHabit);
    expect(state.revealHabitId).toBeNull();
  });
});
