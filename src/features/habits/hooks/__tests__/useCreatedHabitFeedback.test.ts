/**
 * The post-create toast is keyed by the optimistic id first; a sync that
 * lands before, during, or after the show delay must re-key it, and the
 * builder cast in buildModalsStateReturnValue must not drop the fields.
 */

import { act, renderHook } from '@testing-library/react-native';
import { buildModalsStateReturnValue } from '../buildModalsStateReturnValue';
import { useCreatedHabitFeedback } from '../useCreatedHabitFeedback';

const feedback = (habitId: string) => ({
  color: '#10B981',
  habitId: habitId as never,
  icon: '📚',
  name: 'Read',
});

describe('useCreatedHabitFeedback', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows immediately without a delay and counts the create', () => {
    const { result } = renderHook(() => useCreatedHabitFeedback());
    act(() => result.current.showCreatedHabitFeedback(feedback('temp-1')));
    expect(result.current.createdHabitFeedback?.habitId).toBe('temp-1');
    expect(result.current.createdHabitCount).toBe(1);
  });

  it('waits out the delay so the toast enters after the form exits', () => {
    const { result } = renderHook(() => useCreatedHabitFeedback());
    act(() => result.current.showCreatedHabitFeedback(feedback('temp-1'), 300));
    expect(result.current.createdHabitFeedback).toBeNull();
    act(() => jest.advanceTimersByTime(299));
    expect(result.current.createdHabitFeedback).toBeNull();
    act(() => jest.advanceTimersByTime(1));
    expect(result.current.createdHabitFeedback?.name).toBe('Read');
  });

  it('re-keys a visible toast to the server id', () => {
    const { result } = renderHook(() => useCreatedHabitFeedback());
    act(() => result.current.showCreatedHabitFeedback(feedback('temp-1')));
    act(() =>
      result.current.rekeyCreatedHabitFeedback('temp-1' as never, 'srv-1' as never)
    );
    expect(result.current.createdHabitFeedback?.habitId).toBe('srv-1');
  });

  it('re-keys feedback that is still waiting on its delay', () => {
    const { result } = renderHook(() => useCreatedHabitFeedback());
    act(() => result.current.showCreatedHabitFeedback(feedback('temp-1'), 300));
    act(() =>
      result.current.rekeyCreatedHabitFeedback('temp-1' as never, 'srv-1' as never)
    );
    act(() => jest.advanceTimersByTime(300));
    expect(result.current.createdHabitFeedback?.habitId).toBe('srv-1');
  });

  it('ignores a sync for a different habit', () => {
    const { result } = renderHook(() => useCreatedHabitFeedback());
    act(() => result.current.showCreatedHabitFeedback(feedback('temp-1')));
    act(() =>
      result.current.rekeyCreatedHabitFeedback('temp-2' as never, 'srv-2' as never)
    );
    expect(result.current.createdHabitFeedback?.habitId).toBe('temp-1');
  });

  it('dismiss clears the toast and cancels a pending show', () => {
    const { result } = renderHook(() => useCreatedHabitFeedback());
    act(() => result.current.showCreatedHabitFeedback(feedback('temp-1'), 300));
    act(() => result.current.dismissCreatedHabitFeedback());
    act(() => jest.advanceTimersByTime(300));
    expect(result.current.createdHabitFeedback).toBeNull();
  });

  it('a second create replaces the first and replays the entrance', () => {
    const { result } = renderHook(() => useCreatedHabitFeedback());
    act(() => result.current.showCreatedHabitFeedback(feedback('temp-1')));
    act(() => result.current.showCreatedHabitFeedback(feedback('temp-2'), 300));
    expect(result.current.createdHabitFeedback).toBeNull();
    act(() => jest.advanceTimersByTime(300));
    expect(result.current.createdHabitFeedback?.habitId).toBe('temp-2');
    expect(result.current.createdHabitCount).toBe(2);
  });

  it('survives the buildModalsStateReturnValue cast', () => {
    const { result } = renderHook(() => useCreatedHabitFeedback());
    const state = buildModalsStateReturnValue(
      result.current as never,
      {} as never,
      {} as never,
      {} as never
    );
    expect(state.showCreatedHabitFeedback).toBe(
      result.current.showCreatedHabitFeedback
    );
    expect(state.rekeyCreatedHabitFeedback).toBe(
      result.current.rekeyCreatedHabitFeedback
    );
    expect(state.dismissCreatedHabitFeedback).toBe(
      result.current.dismissCreatedHabitFeedback
    );
    expect(state.createdHabitFeedback).toBeNull();
    expect(state.createdHabitCount).toBe(0);
  });
});
