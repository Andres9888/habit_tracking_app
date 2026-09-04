/**
 * The request is keyed by the optimistic id first and re-keyed on sync, must
 * expire on its own (offline creates), and must survive the builder cast in
 * buildModalsStateReturnValue.
 */

import { act, renderHook } from '@testing-library/react-native';
import { buildModalsStateReturnValue } from '../buildModalsStateReturnValue';
import {
  CREATED_HABIT_DETAIL_GIVE_UP_MS,
  useCreatedHabitDetailRequest,
} from '../useCreatedHabitDetailRequest';

describe('useCreatedHabitDetailRequest', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('re-keys the request to the server id', () => {
    const { result } = renderHook(() => useCreatedHabitDetailRequest());
    act(() => result.current.requestCreatedHabitDetail('temp-1' as never, 5));
    act(() =>
      result.current.rekeyCreatedHabitDetail('temp-1' as never, 'srv-1' as never)
    );
    expect(result.current.createdHabitDetailRequest).toEqual({
      id: 'srv-1',
      notBefore: 5,
    });
  });

  it('ignores a sync for a different habit', () => {
    const { result } = renderHook(() => useCreatedHabitDetailRequest());
    act(() => result.current.requestCreatedHabitDetail('temp-1' as never, 0));
    act(() =>
      result.current.rekeyCreatedHabitDetail('temp-2' as never, 'srv-2' as never)
    );
    expect(result.current.createdHabitDetailRequest?.id).toBe('temp-1');
  });

  it('expires on its own and clears immediately on demand', () => {
    const { result } = renderHook(() => useCreatedHabitDetailRequest());
    act(() => result.current.requestCreatedHabitDetail('temp-1' as never, 0));
    act(() => jest.advanceTimersByTime(CREATED_HABIT_DETAIL_GIVE_UP_MS - 1));
    expect(result.current.createdHabitDetailRequest?.id).toBe('temp-1');
    act(() => jest.advanceTimersByTime(1));
    expect(result.current.createdHabitDetailRequest).toBeNull();

    act(() => result.current.requestCreatedHabitDetail('temp-2' as never, 0));
    act(() => result.current.clearCreatedHabitDetail());
    expect(result.current.createdHabitDetailRequest).toBeNull();
  });

  it('survives the buildModalsStateReturnValue cast', () => {
    const { result } = renderHook(() => useCreatedHabitDetailRequest());
    const state = buildModalsStateReturnValue(
      result.current as never,
      {} as never,
      {} as never,
      {} as never
    );
    expect(state.requestCreatedHabitDetail).toBe(
      result.current.requestCreatedHabitDetail
    );
    expect(state.rekeyCreatedHabitDetail).toBe(
      result.current.rekeyCreatedHabitDetail
    );
    expect(state.clearCreatedHabitDetail).toBe(
      result.current.clearCreatedHabitDetail
    );
    expect(state.createdHabitDetailRequest).toBeNull();
  });
});
