import { renderHook, act } from '@testing-library/react-native';
import { useCompleteHandlers } from '../useCompleteHandlers';

describe('useCompleteHandlers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('marks done and shows a confirmation toast on first press', () => {
    const onDayPress = jest.fn();
    const { result } = renderHook(() =>
      useCompleteHandlers({
        habitId: 'habit-1',
        habitName: 'Morning Run',
        isCompletedToday: false,
        isToggling: false,
        onDayPress,
      })
    );

    act(() => {
      result.current.handleCompletePress();
    });

    expect(onDayPress).toHaveBeenCalledTimes(1);
    expect(onDayPress).toHaveBeenCalledWith(expect.any(String), false);
    expect(result.current.toastMessage).toBe('Morning Run done!');
  });

  it('does not un-complete on a second press — the CTA is one-way', () => {
    const onDayPress = jest.fn();
    const { result, rerender } = renderHook(
      (props: { isCompletedToday: boolean }) =>
        useCompleteHandlers({
          habitId: 'habit-1',
          habitName: 'Morning Run',
          isCompletedToday: props.isCompletedToday,
          isToggling: false,
          onDayPress,
        }),
      { initialProps: { isCompletedToday: false } }
    );

    act(() => {
      result.current.handleCompletePress();
    });
    expect(onDayPress).toHaveBeenCalledTimes(1);

    // Simulate the screen re-rendering with the now-completed state.
    rerender({ isCompletedToday: true });

    act(() => {
      result.current.handleCompletePress();
    });

    // No second mutation call — only the toast message changes.
    expect(onDayPress).toHaveBeenCalledTimes(1);
    expect(result.current.toastMessage).toBe('Already done today');
  });

  it('undo calls the same toggle mutation with wasCompleted=true and clears the toast', () => {
    const onDayPress = jest.fn();
    const { result } = renderHook(() =>
      useCompleteHandlers({
        habitId: 'habit-1',
        habitName: 'Morning Run',
        isCompletedToday: true,
        isToggling: false,
        onDayPress,
      })
    );

    act(() => {
      result.current.handleUndo();
    });

    expect(onDayPress).toHaveBeenCalledWith(expect.any(String), true);
    expect(result.current.toastMessage).toBeNull();
  });

  it('auto-dismisses the toast after the undo window', () => {
    const onDayPress = jest.fn();
    const { result } = renderHook(() =>
      useCompleteHandlers({
        habitId: 'habit-1',
        habitName: 'Morning Run',
        isCompletedToday: false,
        isToggling: false,
        onDayPress,
      })
    );

    act(() => {
      result.current.handleCompletePress();
    });
    expect(result.current.toastMessage).toBe('Morning Run done!');

    act(() => {
      jest.advanceTimersByTime(3200);
    });
    expect(result.current.toastMessage).toBeNull();
  });

  it('dismissToast clears the toast immediately', () => {
    const onDayPress = jest.fn();
    const { result } = renderHook(() =>
      useCompleteHandlers({
        habitId: 'habit-1',
        habitName: 'Morning Run',
        isCompletedToday: false,
        isToggling: false,
        onDayPress,
      })
    );

    act(() => {
      result.current.handleCompletePress();
    });
    act(() => {
      result.current.dismissToast();
    });
    expect(result.current.toastMessage).toBeNull();
  });

  it('clears a stale toast when the displayed habit changes', () => {
    const onDayPress = jest.fn();
    const { result, rerender } = renderHook(
      (props: { habitId: string }) =>
        useCompleteHandlers({
          habitId: props.habitId,
          habitName: 'Morning Run',
          isCompletedToday: false,
          isToggling: false,
          onDayPress,
        }),
      { initialProps: { habitId: 'habit-A' } }
    );

    act(() => {
      result.current.handleCompletePress();
    });
    expect(result.current.toastMessage).toBe('Morning Run done!');

    // The detail modal stays mounted across habit switches — the toast (and
    // its Undo action, which would otherwise still be bound to habit A's
    // mutation) must not survive onto habit B.
    rerender({ habitId: 'habit-B' });
    expect(result.current.toastMessage).toBeNull();
  });

  it('ignores a press while a mutation for today is already in flight', () => {
    const onDayPress = jest.fn();
    const { result } = renderHook(() =>
      useCompleteHandlers({
        habitId: 'habit-1',
        habitName: 'Morning Run',
        isCompletedToday: false,
        isToggling: true,
        onDayPress,
      })
    );

    act(() => {
      result.current.handleCompletePress();
    });
    expect(onDayPress).not.toHaveBeenCalled();
    expect(result.current.toastMessage).toBeNull();
  });

  it('ignores undo while a mutation for today is already in flight, keeping the toast up', () => {
    const onDayPress = jest.fn();
    const { result, rerender } = renderHook(
      (props: { isToggling: boolean }) =>
        useCompleteHandlers({
          habitId: 'habit-1',
          habitName: 'Morning Run',
          isCompletedToday: false,
          isToggling: props.isToggling,
          onDayPress,
        }),
      { initialProps: { isToggling: false } }
    );

    act(() => {
      result.current.handleCompletePress();
    });
    expect(onDayPress).toHaveBeenCalledTimes(1);

    // A mutation is now in flight for today (e.g. the mark itself).
    rerender({ isToggling: true });

    act(() => {
      result.current.handleUndo();
    });

    // Undo is a no-op while toggling — it must not be silently dropped by
    // handleCalendarDayPress's own guard after the toast has already closed.
    expect(onDayPress).toHaveBeenCalledTimes(1);
    expect(result.current.toastMessage).toBe('Morning Run done!');
  });
});
