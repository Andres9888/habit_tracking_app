/**
 * The focus request must expire on its own — HabitsList is unmounted while the
 * list is empty, so nothing below can be trusted to clear it.
 *
 * Also guards the `as unknown as HabitsModalsState` cast in
 * buildModalsStateReturnValue: tsc cannot see a field the builder forgot.
 */

import { act, renderHook } from '@testing-library/react-native';
import { buildModalsStateReturnValue } from '../buildModalsStateReturnValue';
import {
  FOCUS_GIVE_UP_MS,
  usePendingFocusHabit,
} from '../usePendingFocusHabit';

describe('usePendingFocusHabit', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('drops a request the habits list never fulfils', () => {
    const { result } = renderHook(() => usePendingFocusHabit());

    act(() => result.current.preparePendingFocusHabit('habit-1' as never));
    expect(result.current.pendingFocusHabitId).toBe('habit-1');

    act(() => jest.advanceTimersByTime(FOCUS_GIVE_UP_MS - 1));
    expect(result.current.pendingFocusHabitId).toBe('habit-1');

    act(() => jest.advanceTimersByTime(1));
    expect(result.current.pendingFocusHabitId).toBeNull();
  });

  it('closes the library when the request expires unfulfilled', () => {
    const onGiveUp = jest.fn();
    const { result } = renderHook(() => usePendingFocusHabit(onGiveUp));
    act(() => result.current.commitPendingFocusHabit('habit-1' as never));
    act(() => jest.advanceTimersByTime(FOCUS_GIVE_UP_MS));
    expect(onGiveUp).toHaveBeenCalledTimes(1);
    expect(result.current.pendingFocusHabitId).toBeNull();
  });

  it('does not close the library when a prepared request expires', () => {
    const onGiveUp = jest.fn();
    const { result } = renderHook(() => usePendingFocusHabit(onGiveUp));

    act(() => result.current.preparePendingFocusHabit('habit-1' as never));
    act(() => jest.advanceTimersByTime(FOCUS_GIVE_UP_MS));

    expect(onGiveUp).not.toHaveBeenCalled();
    expect(result.current.pendingFocusHabitId).toBeNull();
  });

  it('restarts a full give-up window when a prepared request is committed', () => {
    const onGiveUp = jest.fn();
    const { result } = renderHook(() => usePendingFocusHabit(onGiveUp));

    act(() => result.current.preparePendingFocusHabit('habit-1' as never));
    act(() => jest.advanceTimersByTime(FOCUS_GIVE_UP_MS - 100));

    // User taps "Go to" just before the prepare deadline. The stale prepare
    // timer must not drop the committed request 100ms later.
    act(() => result.current.commitPendingFocusHabit('habit-1' as never));
    act(() => jest.advanceTimersByTime(100));
    expect(result.current.pendingFocusHabitId).toBe('habit-1');
    expect(onGiveUp).not.toHaveBeenCalled();

    // The commit gets its own full window…
    act(() => jest.advanceTimersByTime(FOCUS_GIVE_UP_MS - 200));
    expect(result.current.pendingFocusHabitId).toBe('habit-1');

    // …and still expires (autoClose path) if never fulfilled.
    act(() => jest.advanceTimersByTime(100));
    expect(result.current.pendingFocusHabitId).toBeNull();
    expect(onGiveUp).toHaveBeenCalledTimes(1);
  });

  it('keeps a fulfilled prepared request until the user commits or cancels', () => {
    const onGiveUp = jest.fn();
    const { result } = renderHook(() => usePendingFocusHabit(onGiveUp));

    act(() => result.current.preparePendingFocusHabit('habit-1' as never));
    act(() => result.current.markPendingFocusReady('habit-1' as never));
    act(() => jest.advanceTimersByTime(FOCUS_GIVE_UP_MS * 2));

    expect(onGiveUp).not.toHaveBeenCalled();
    expect(result.current.pendingFocusHabitId).toBe('habit-1');
    expect(result.current.focusReady).toBe(true);
  });

  it('keeps readiness when the prepared request is committed', () => {
    const { result } = renderHook(() => usePendingFocusHabit());

    act(() => result.current.preparePendingFocusHabit('habit-1' as never));
    act(() => result.current.markPendingFocusReady('habit-1' as never));
    expect(result.current.focusReady).toBe(true);
    expect(result.current.focusRequestAutoClose).toBe(false);

    act(() => result.current.commitPendingFocusHabit('habit-1' as never));
    expect(result.current.pendingFocusHabitId).toBe('habit-1');
    expect(result.current.focusReady).toBe(true);
    expect(result.current.focusRequestAutoClose).toBe(true);
  });

  it('replaces a prepared anchor and clears its readiness', () => {
    const { result } = renderHook(() => usePendingFocusHabit());

    act(() => result.current.preparePendingFocusHabit('habit-1' as never));
    act(() => result.current.markPendingFocusReady('habit-1' as never));
    act(() => result.current.preparePendingFocusHabit('habit-2' as never));

    expect(result.current.pendingFocusHabitId).toBe('habit-2');
    expect(result.current.focusReady).toBe(false);
    expect(result.current.focusRequestAutoClose).toBe(false);
  });

  it('does not arm a timer while idle', () => {
    const { result } = renderHook(() => usePendingFocusHabit());
    act(() => jest.advanceTimersByTime(FOCUS_GIVE_UP_MS * 2));
    expect(result.current.pendingFocusHabitId).toBeNull();
  });
});

function buildWithVisibility(visibility: Record<string, unknown>) {
  return buildModalsStateReturnValue(
    visibility as never,
    { setHabitToPause: jest.fn() } as never,
    {} as never,
    {} as never
  );
}

describe('buildModalsStateReturnValue focus wiring', () => {
  it('exposes the two-phase focus fields', () => {
    const state = buildWithVisibility({
      focusReady: false,
      focusRequestAutoClose: false,
      pendingFocusHabitId: 'habit-1',
      clearPendingFocusHabit: jest.fn(),
      commitPendingFocusHabit: jest.fn(),
      markPendingFocusReady: jest.fn(),
      preparePendingFocusHabit: jest.fn(),
      setShowTemplatesScreen: jest.fn(),
    });

    expect(state.pendingFocusHabitId).toBe('habit-1');
    expect(typeof state.prepareFocusHabitOnHome).toBe('function');
    expect(typeof state.commitFocusHabitOnHome).toBe('function');
    expect(typeof state.markFocusHabitReady).toBe('function');
    expect(typeof state.clearPendingFocusHabit).toBe('function');
  });

  it('prepareFocusHabitOnHome arms without closing the library', () => {
    const preparePendingFocusHabit = jest.fn();
    const setShowTemplatesScreen = jest.fn();
    const state = buildWithVisibility({
      focusReady: false,
      focusRequestAutoClose: false,
      pendingFocusHabitId: null,
      preparePendingFocusHabit,
      setShowTemplatesScreen,
    });

    state.prepareFocusHabitOnHome('habit-2' as never);

    expect(preparePendingFocusHabit).toHaveBeenCalledWith('habit-2');
    expect(setShowTemplatesScreen).not.toHaveBeenCalled();
  });

  it('commitFocusHabitOnHome requests reveal without closing early', () => {
    const commitPendingFocusHabit = jest.fn();
    const setShowTemplatesScreen = jest.fn();
    const state = buildWithVisibility({
      commitPendingFocusHabit,
      focusReady: true,
      focusRequestAutoClose: false,
      pendingFocusHabitId: 'habit-2',
      setShowTemplatesScreen,
    });

    state.commitFocusHabitOnHome('habit-2' as never);

    expect(commitPendingFocusHabit).toHaveBeenCalledWith('habit-2');
    expect(setShowTemplatesScreen).not.toHaveBeenCalled();
  });

  it('reopening the library cancels a stale request', () => {
    const clearPendingFocusHabit = jest.fn();
    const setShowTemplatesScreen = jest.fn();
    const state = buildWithVisibility({
      clearPendingFocusHabit,
      focusReady: true,
      focusRequestAutoClose: false,
      pendingFocusHabitId: 'habit-3',
      setShowTemplatesScreen,
    });

    state.openTemplatesScreen();

    expect(clearPendingFocusHabit).toHaveBeenCalledTimes(1);
    expect(setShowTemplatesScreen).toHaveBeenCalledWith(true);
  });

  it('clearPendingFocusHabit resets the request', () => {
    const clearPendingFocusHabit = jest.fn();
    const state = buildWithVisibility({
      clearPendingFocusHabit,
      focusReady: false,
      focusRequestAutoClose: false,
      pendingFocusHabitId: 'habit-4',
      setShowTemplatesScreen: jest.fn(),
    });

    state.clearPendingFocusHabit();

    expect(clearPendingFocusHabit).toHaveBeenCalledTimes(1);
  });
});
